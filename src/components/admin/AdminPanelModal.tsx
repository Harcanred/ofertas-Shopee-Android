import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Key, 
  Copy, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  Calendar, 
  Check, 
  Search, 
  UserPlus, 
  RefreshCw, 
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Cloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  getStoredLicenses, 
  subscribeToLicenses,
  createNewLicense, 
  toggleBlockLicense, 
  releaseLicenseDevice, 
  renewLicense, 
  revokeLicense 
} from '../../services/licenseService';
import { 
  changeAdminPassword, 
  clearAdminSession, 
  isHideAdminButtonEnabled, 
  setHideAdminButtonEnabled 
} from '../../services/adminAuthService';
import { License } from '../../types';
import { copyToClipboard } from '../../services/shareService';

export const AdminPanelModal: React.FC = () => {
  const { adminPanelOpen, setAdminPanelOpen, showToast } = useApp();
  const [licenses, setLicenses] = useState<License[]>(() => getStoredLicenses());
  const [searchFilter, setSearchFilter] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [unmaskedKeyId, setUnmaskedKeyId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    if (!adminPanelOpen) return;
    setIsSyncing(true);
    const unsubscribe = subscribeToLicenses((updated) => {
      setLicenses(updated);
      setIsSyncing(false);
    });
    return () => unsubscribe();
  }, [adminPanelOpen]);

  // Security state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [hideAdminBtn, setHideAdminBtn] = useState(() => isHideAdminButtonEnabled());
  const [securityMsg, setSecurityMsg] = useState<{ text: string; error: boolean } | null>(null);

  // New key form
  const [newClientName, setNewClientName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [durationMonths, setDurationMonths] = useState(12);

  if (!adminPanelOpen) return null;

  const refreshList = () => {
    setLicenses(getStoredLicenses());
  };

  // Metrics
  const totalCount = licenses.length;
  const activeCount = licenses.filter(l => l.status === 'active').length;
  const availableCount = licenses.filter(l => l.status === 'available').length;
  const blockedCount = licenses.filter(l => l.status === 'blocked').length;
  const expiredCount = licenses.filter(l => {
    return l.status === 'expired' || new Date() > new Date(l.expiresAt);
  }).length;

  const filteredLicenses = licenses.filter(l => 
    l.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.key.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (l.notes && l.notes.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      alert('Informe o nome do afiliado / cliente.');
      return;
    }

    const created = await createNewLicense({
      clientName: newClientName,
      notes: newNotes,
      durationMonths,
      deviceLimit: 1,
    });

    setNewClientName('');
    setNewNotes('');
    setShowNewKeyModal(false);
    refreshList();
    showToast(`Chave ${created.key} gerada e sincronizada na nuvem!`);
  };

  const handleCopyKey = async (key: string) => {
    await copyToClipboard(key);
    showToast('Chave copiada para a área de transferência!');
  };

  const handleToggleBlock = async (id: string) => {
    await toggleBlockLicense(id);
    refreshList();
    showToast('Status da licença atualizado no banco em nuvem!');
  };

  const handleReleaseDevice = async (id: string) => {
    await releaseLicenseDevice(id);
    refreshList();
    showToast('Dispositivo liberado no banco em nuvem! Pronto para novo aparelho.');
  };

  const handleRenew = async (id: string) => {
    await renewLicense(id, 12);
    refreshList();
    showToast('Licença renovada por mais 12 meses na nuvem!');
  };

  const handleRevoke = async (id: string) => {
    if (window.confirm('Tem certeza que deseja revogar e excluir permanentemente esta licença do banco em nuvem?')) {
      await revokeLicense(id);
      refreshList();
      showToast('Licença revogada e excluída da nuvem.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border-b border-neutral-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold tracking-tight">
                Painel Administrativo de Licenças
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span>Nuvem Firestore Conectada</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Central de Ofertas · Painel Privado de Ronaldo Costa
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSecurityModal(true);
                setSecurityMsg(null);
              }}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Configurações de Segurança e Senha Mestre"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Segurança</span>
            </button>

            <button
              onClick={() => setShowNewKeyModal(true)}
              className="py-2 px-3.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-950/20 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>GERAR NOVA CHAVE</span>
            </button>

            <button
              onClick={() => {
                clearAdminSession();
                setAdminPanelOpen(false);
                showToast('Painel administrativo bloqueado.');
              }}
              className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Sair e Bloquear Painel"
            >
              <span>Bloquear</span>
            </button>

            <button
              onClick={() => setAdminPanelOpen(false)}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Metrics (PRD Section 30) */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                Licenças Totais
              </span>
              <span className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
                {totalCount}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-emerald-200 dark:border-emerald-950">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                Ativas
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeCount}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-blue-200 dark:border-blue-950">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                Disponíveis
              </span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {availableCount}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-red-200 dark:border-red-950">
              <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 block mb-1">
                Bloqueadas
              </span>
              <span className="text-2xl font-black text-red-600 dark:text-red-400 tabular-nums">
                {blockedCount}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-amber-200 dark:border-amber-950">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                Expiradas
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {expiredCount}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Buscar por nome, chave ou observação..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border-transparent focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]"
            />
          </div>

          <span className="text-xs text-neutral-500 font-medium">
            {filteredLicenses.length} chave(s) encontrada(s)
          </span>
        </div>

        {/* License Table (PRD Section 32) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredLicenses.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-xs">
              Nenhuma licença encontrada.
            </div>
          ) : (
            filteredLicenses.map(lic => {
              const isUnmasked = unmaskedKeyId === lic.id;
              const displayKey = isUnmasked
                ? lic.key
                : `${lic.key.slice(0, 11)}••••-••••`;

              const isExpired = new Date() > new Date(lic.expiresAt);
              const statusDisplay = lic.status === 'blocked'
                ? { label: 'Bloqueada', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' }
                : isExpired
                ? { label: 'Expirada', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' }
                : lic.activeDeviceId
                ? { label: 'Ativa no Aparelho', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' }
                : { label: 'Disponível', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' };

              return (
                <div
                  key={lic.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {lic.clientName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusDisplay.color}`}>
                        {statusDisplay.label}
                      </span>
                    </div>

                    {/* Key with Mask / Unmask and Copy */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        {displayKey}
                      </span>
                      <button
                        onClick={() => setUnmaskedKeyId(isUnmasked ? null : lic.id)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                        title={isUnmasked ? 'Ocultar chave' : 'Exibir chave'}
                      >
                        {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopyKey(lic.key)}
                        className="text-neutral-400 hover:text-[#ee4d2d] p-1"
                        title="Copiar chave"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                      <span>Validade: <strong className="text-neutral-700 dark:text-neutral-300">{new Date(lic.expiresAt).toLocaleDateString('pt-BR')}</strong></span>
                      <span>Dispositivo: <strong className="text-neutral-700 dark:text-neutral-300">{lic.activeDeviceId ? `1/1 (${lic.activeDeviceModel || 'Vinculado'})` : 'Nenhum'}</strong></span>
                      {lic.notes && <span className="italic">Obs: {lic.notes}</span>}
                    </div>
                  </div>

                  {/* Actions (PRD Section 32) */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {/* Liberar Dispositivo (PRD Section 28: Troca de celular) */}
                    {lic.activeDeviceId && (
                      <button
                        onClick={() => handleReleaseDevice(lic.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Liberar ativação para o usuário trocar de aparelho"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                        <span>Liberar Aparelho</span>
                      </button>
                    )}

                    {/* Bloquear / Desbloquear */}
                    <button
                      onClick={() => handleToggleBlock(lic.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        lic.status === 'blocked'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100'
                      }`}
                    >
                      {lic.status === 'blocked' ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Desbloquear</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloquear</span>
                        </>
                      )}
                    </button>

                    {/* Renovar */}
                    <button
                      onClick={() => handleRenew(lic.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Renovar por mais 1 ano"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                      <span>Renovar</span>
                    </button>

                    {/* Excluir / Revogar */}
                    <button
                      onClick={() => handleRevoke(lic.id)}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Revogar chave"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Generate New Key Modal (PRD Section 31) */}
        {showNewKeyModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#ee4d2d]" />
                  Gerar Nova Chave de Ativação
                </h3>
                <button onClick={() => setShowNewKeyModal(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateKey} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                    Nome do Usuário / Afiliado *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    placeholder="Ex: João Silva Afiliado"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                    Observações / Contato
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="Ex: WhatsApp (11) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                    Validade da Licença
                  </label>
                  <select
                    value={durationMonths}
                    onChange={e => setDurationMonths(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  >
                    <option value={1}>1 Mês (Teste)</option>
                    <option value={3}>3 Meses</option>
                    <option value={6}>6 Meses</option>
                    <option value={12}>1 Ano (Recomendado)</option>
                    <option value={24}>2 Anos</option>
                    <option value={120}>Vitalícia (10 Anos)</option>
                  </select>
                </div>

                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[11px] text-neutral-600 dark:text-neutral-400">
                  🔒 <strong>Regra:</strong> 1 chave = 1 instalação/dispositivo autorizado. Formato criptograficamente seguro <code>OFERTA-XXXX-XXXX-XXXX</code>.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold"
                  >
                    CRIAR CHAVE AGORA
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewKeyModal(false)}
                    className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security & Access Settings Modal */}
        {showSecurityModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  Segurança do Administrador (Ronaldo Costa)
                </h3>
                <button onClick={() => setShowSecurityModal(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Option 1: Hide Admin button in user settings */}
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-xs">
                      Ocultar atalho do painel no aplicativo
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Impede que afiliados comuns vejam o botão "Painel Administrativo" nas configurações.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hideAdminBtn}
                    onChange={e => {
                      const val = e.target.checked;
                      setHideAdminBtn(val);
                      setHideAdminButtonEnabled(val);
                      showToast(val ? 'Atalho do painel ocultado nas configurações.' : 'Atalho do painel reexibido.');
                    }}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  💡 <strong>Como você acessa quando estiver oculto:</strong> Toque 5 vezes no texto <em>"Criado por Ronaldo Costa"</em> na tela Sobre do app, ou use a barra de controle web.
                </div>
              </div>

              {/* Option 2: Change Master Password */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const res = changeAdminPassword(currentPassInput, newPassInput);
                  setSecurityMsg({ text: res.message, error: !res.success });
                  if (res.success) {
                    setCurrentPassInput('');
                    setNewPassInput('');
                    showToast(res.message);
                  }
                }}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3"
              >
                <h4 className="font-bold text-neutral-900 dark:text-white text-xs">
                  Alterar Senha Mestre de Acesso
                </h4>

                <div>
                  <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={e => setCurrentPassInput(e.target.value)}
                    placeholder="Digite a senha atual..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={e => setNewPassInput(e.target.value)}
                    placeholder="Mínimo 4 caracteres..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                {securityMsg && (
                  <div className={`p-2 rounded-xl text-[11px] font-semibold ${securityMsg.error ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                    {securityMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Salvar Nova Senha
                </button>
              </form>

              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold"
              >
                Concluído
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
