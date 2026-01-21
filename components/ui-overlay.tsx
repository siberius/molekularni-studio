'use client';

// UI překryvná vrstva pro vyhledávání a zobrazení informací o molekule
// Obsahuje vyhledávací formulář a informační panel s daty z PubChem

import { FormEvent, KeyboardEvent } from 'react';
import { Search, Loader2, Info, Atom, Link2, AlertCircle, Database, Scale } from 'lucide-react';
import { Molecule, UIOverlayProps } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Komponenta překryvné vrstvy s vyhledáváním a informacemi
 * Zobrazuje formulář pro vyhledávání a panel s detaily molekuly z PubChem
 */
export default function UIOverlay({ 
  molecule, 
  query, 
  setQuery, 
  onSearch, 
  isLoading, 
  error 
}: UIOverlayProps) {

  // Zpracování odeslání formuláře
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query?.trim?.() ?? '';
    if (trimmedQuery && !isLoading) {
      onSearch();
    }
  };

  // Zpracování klávesy Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && query?.trim?.()) {
      onSearch();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Vyhledávací formulář - horní část */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-4 py-2 border border-slate-700/50 shadow-xl"
        >
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e?.target?.value ?? '')}
            onKeyDown={handleKeyDown}
            placeholder="Zadejte název molekuly (např. Caffeine)"
            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-64 md:w-80"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query?.trim?.()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-full transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Hledám...</span>
              </>
            ) : (
              <span>Vizualizovat</span>
            )}
          </button>
        </motion.form>
      </div>

      {/* Zobrazení chyby */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto z-10"
          >
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-lg px-4 py-3 flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informační panel o molekule - dolní část */}
      <AnimatePresence>
        {molecule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto pointer-events-auto z-10"
          >
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow-xl max-w-md">
              {/* Název molekuly */}
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Atom className="w-5 h-5 text-blue-400" />
                {molecule?.name ?? 'Neznámá molekula'}
              </h2>
              
              {/* Chemický vzorec */}
              <p className="text-blue-400 font-mono text-lg mb-3">
                {molecule?.formula ?? ''}
              </p>
              
              {/* Statistiky */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>{molecule?.atoms?.length ?? 0} atomů</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Link2 className="w-4 h-4" />
                  <span>{molecule?.bonds?.length ?? 0} vazeb</span>
                </div>
                {molecule?.metadata?.weight && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Scale className="w-4 h-4" />
                    <span>{molecule.metadata.weight}</span>
                  </div>
                )}
              </div>

              {/* Zdroj dat */}
              {molecule?.metadata?.source && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Database className="w-3 h-3" />
                  <span>Zdroj: {molecule.metadata.source}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Úvod ní text když není molekula */}
      <AnimatePresence>
        {!molecule && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Molekulární Studio</h1>
            <p className="text-slate-400 text-lg">3D vizualizér chemických molekul</p>
            <p className="text-slate-500 text-sm mt-4">Zadejte název molekuly v angličtině (např. Caffeine, Aspirin, Ethanol)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informační tooltip */}
      <div className="absolute bottom-4 right-4 pointer-events-auto z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-slate-900/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/30 flex items-center gap-2 text-slate-400 text-xs"
        >
          <Info className="w-4 h-4" />
          <span>Použijte myš pro otáčení a přiblížení</span>
        </motion.div>
      </div>
    </div>
  );
}
