import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  SunMoon, 
  FolderDown, 
  Info, 
  LogOut, 
  ChevronRight, 
  Key, 
  ShieldCheck, 
  Check, 
  Loader2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { AndroidNavBar } from '../android/AndroidNavBar';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { testShopeeConnection } from '../../services/shopeeService';
import { isHideAdminButtonEnabled } from '../../services/adminAuthService';
import { AppTheme } from '../../types';

export const SettingsScreen: React.FC = () => {
  const { 
    goBack, 
    navigateTo, 
    activeLicense, 
    setActiveLicenseState, 
    theme, 
    setTheme, 
    shopeeConfig, 
    updateShopeeConfig, 
    showToast,
    openAdminPanelSecurely 
  } = useApp();

  // Modals for settings items
  const [activeModal, setActiveModal] = useState<'account' | 'shopee' | 'theme' | 'about' | null>(null);
  const [easterEggTaps, setEasterEggTaps] = useState(0);

  const handleSecretTap = () => {
    const next = easterEggTaps + 1;
    if (next >= 5) {
      setEasterEggTaps(0);
      showToast('Acesso de Desenvolvedor: abrindo painel...');
      setActiveModal(null);
      openAdminPanelSecurely();
    } else {
      setEasterEggTaps(next);
      if (next >= 2) {
        showToast(`Toque mais ${5 - next} vezes para acesso admin...`);
      }
    }
  };

  // Shopee config form
  const [partnerId, setPartnerId] = useState(shopeeConfig.partnerId);
  const [appKey, setAppKey] = useState(shopeeConfig.appKey);
  const [appSecret, setAppSecret] = useState(shopeeConfig.appSecret);
  const [testingShopee, setTestingShopee] = useState(false);
  const [shopeeTestMsg, setShopeeTestMsg] = useState<string | null>(null);

  const handleTestShopee = async () => {
    setTestingShopee(true);
    setShopeeTestMsg(null);

    const result = await testShopeeConnection({ partnerId, appKey, appSecret });
    setTestingShopee(false);
    setShopeeTestMsg(result.message);

    updateShopeeConfig({
      partnerId,
      appKey,
      appSecret,
      connected: result.success,
      status: result.status,
      lastTested: new Date().toISOString(),
    });
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja desativar este aparelho? Você precisará de uma chave de ativação para entrar novamente.')) {
      setActiveLicenseState(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Header (Matching Screen 12) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">Configurações</h2>
        </div>
      </div>

      {/* Settings List (Matching Screen 12) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
          {/* Minha Conta */}
          <button
            onClick={() => setActiveModal('account')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Minha Conta</h3>
                <p className="text-[11px] text-neutral-400">Licença e ativação</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          </button>

          {/* Configurar Shopee */}
          <button
            onClick={() => setActiveModal('shopee')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#ee4d2d] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Configurar Shopee</h3>
                <p className="text-[11px] text-neutral-400">Conectar sua API</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          </button>

          {/* Tema */}
          <button
            onClick={() => setActiveModal('theme')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <SunMoon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Tema</h3>
                <p className="text-[11px] text-neutral-400 capitalize">
                  {theme === 'system' ? 'Seguir Sistema' : theme === 'dark' ? 'Escuro' : 'Claro'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          </button>

          {/* Minha Mídia */}
          <button
            onClick={() => navigateTo('media')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FolderDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Minha Mídia</h3>
                <p className="text-[11px] text-neutral-400">Vídeos e imagens baixados</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          </button>

          {/* Painel Administrativo (Ronaldo Costa) - Exibido apenas se não estiver oculto */}
          {!isHideAdminButtonEnabled() && (
            <button
              onClick={openAdminPanelSecurely}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Painel Administrativo</h3>
                  <p className="text-[11px] text-neutral-400">Gerenciar licenças (Requer senha)</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Privado
              </span>
            </button>
          )}

          {/* Sobre (Matching Screen 12) */}
          <button
            onClick={() => setActiveModal('about')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Sobre</h3>
                <p className="text-[11px] text-neutral-400">Central de Ofertas · Criado por Ronaldo Costa</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          </button>
        </div>

        {/* Install on device banner */}
        <PWAInstallButton variant="banner" />

        {/* Sair do aplicativo (Matching Screen 12) */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold">Sair do aplicativo</h3>
              <p className="text-[11px] text-neutral-400">Desativar licença neste celular</p>
            </div>
          </button>
        </div>
      </div>

      {/* Minha Conta Modal */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold">Minha Licença</h3>
              <button onClick={() => setActiveModal(null)} className="text-xs text-neutral-400">Fechar</button>
            </div>
            {activeLicense ? (
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Titular:</span>
                  <span className="font-bold">{activeLicense.clientName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Chave de Ativação:</span>
                  <span className="font-mono font-bold text-[#ee4d2d]">{activeLicense.key}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Status:</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold text-[10px]">
                    Ativa e vinculada a este aparelho
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Validade:</span>
                  <span>Até {new Date(activeLicense.expiresAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Nenhuma licença ativa vinculada.</p>
            )}
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Configurar Shopee Modal */}
      {activeModal === 'shopee' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#ee4d2d]" />
                Credenciais Shopee
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-xs text-neutral-400">Fechar</button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
              <strong>Atenção:</strong> Por segurança e conforme a regra do projeto, cada afiliado deve inserir suas <strong>próprias credenciais</strong> obtidas no Portal de Afiliados Shopee. Nunca utilize credenciais de terceiros.
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Partner ID / App ID</label>
                <input
                  type="text"
                  placeholder="Ex: 1084920"
                  value={partnerId}
                  onChange={e => setPartnerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">App Key</label>
                <input
                  type="text"
                  placeholder="Ex: sp_key_live_..."
                  value={appKey}
                  onChange={e => setAppKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">App Secret</label>
                <input
                  type="password"
                  placeholder="Chave secreta da API Shopee"
                  value={appSecret}
                  onChange={e => setAppSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPartnerId('1084920');
                    setAppKey('sp_key_live_9a8b7c6d5e4f3a2b1c');
                    setAppSecret('sp_sec_live_abcdef1234567890abcdef');
                    setShopeeTestMsg(null);
                  }}
                  className="text-[#ee4d2d] hover:underline font-semibold"
                >
                  Preencher dados de Teste (Mock)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPartnerId('');
                    setAppKey('');
                    setAppSecret('');
                    setShopeeTestMsg(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  Limpar
                </button>
              </div>

              {shopeeTestMsg && (
                <div className={`p-2.5 rounded-xl text-[11px] font-medium ${shopeeConfig.connected ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'}`}>
                  {shopeeTestMsg}
                </div>
              )}

              <button
                onClick={handleTestShopee}
                disabled={testingShopee}
                className="w-full py-2.5 rounded-xl bg-[#ee4d2d] text-white font-bold flex items-center justify-center gap-2"
              >
                {testingShopee ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Testando Conexão...</span>
                  </>
                ) : (
                  <span>TESTAR CONEXÃO</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tema Modal */}
      {activeModal === 'theme' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold mb-2">Escolha o Tema</h3>
            {(['light', 'dark', 'system'] as AppTheme[]).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setActiveModal(null);
                  showToast(`Tema alterado para: ${t === 'system' ? 'Sistema' : t === 'dark' ? 'Escuro' : 'Claro'}`);
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold border transition-colors ${
                  theme === t
                    ? 'border-[#ee4d2d] bg-orange-50/50 dark:bg-orange-950/30 text-[#ee4d2d]'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="capitalize">{t === 'system' ? 'Seguir Sistema' : t === 'dark' ? 'Escuro' : 'Claro'}</span>
                {theme === t && <Check className="w-4 h-4 text-[#ee4d2d]" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sobre Modal (PRD Section 24 & 25) */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ee4d2d] text-white flex items-center justify-center mx-auto shadow-md shadow-orange-600/20">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Central de Ofertas</h3>
              <p
                onClick={handleSecretTap}
                className="text-xs font-semibold text-[#ee4d2d] mt-0.5 cursor-pointer hover:underline select-none"
                title="Toque 5 vezes para acesso administrativo"
              >
                Criado por Ronaldo Costa
              </p>
              <span className="text-[11px] text-neutral-400 block mt-1">Versão 1.0.0 (Build 2026.09)</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed text-left bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl">
              Aplicativo exclusivo para descoberta, organização, preparação e compartilhamento de ofertas de afiliados, com módulo nativo para download manual de vídeos da Shopee e Mercado Livre.
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <AndroidNavBar />
    </div>
  );
};
