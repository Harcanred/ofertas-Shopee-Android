import React, { useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Star, MoreVertical, X, Check, Bookmark, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { AndroidStatusBar } from '../android/AndroidStatusBar';
import { AndroidNavBar } from '../android/AndroidNavBar';

export const SearchScreen: React.FC = () => {
  const { products, goBack, navigateTo, toggleSaveProduct, savedProducts, openShareSheet } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const categories = ['Todos', 'Eletrônicos', 'Casa', 'Beleza', 'Moda'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductSelect = (product: Product) => {
    navigateTo('details', product);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <AndroidStatusBar />

      {/* Top Bar (Matching Screen 7) */}
      <div className="bg-[#ee4d2d] text-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">Buscar Produtos</h2>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-xs">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Digite o que você procura..."
              className="w-full bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>

          <button
            onClick={() => setSelectedCategory('Todos')}
            className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills (Matching Screen 7) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#ee4d2d] text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product List (Matching Screen 7) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-xs">
            Nenhum produto encontrado para sua busca.
          </div>
        ) : (
          filteredProducts.map(product => {
            const isSaved = savedProducts.some(p => p.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="relative bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow group"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {product.title}
                  </h4>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[11px] font-bold text-red-500">
                      -{product.discountPercent}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span>|</span>
                    <span>{(product.soldCount / 1000).toFixed(1)} mil vendidos</span>
                  </div>
                </div>

                {/* 3-dots action menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === product.id ? null : product.id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === product.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 w-36 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-30 text-xs animate-fadeIn"
                    >
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          navigateTo('prepare', product);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                      >
                        Preparar Oferta
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          toggleSaveProduct(product.id);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                      >
                        {isSaved ? 'Remover dos Salvos' : 'Salvar Produto'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <AndroidNavBar />
    </div>
  );
};
