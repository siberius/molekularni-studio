// Molekulární Studio - Hlavní stránka
// Interaktivní 3D vizualizér molekul s daty z PubChem
'use client';

import { useState, useCallback } from 'react';
import { Molecule, LoadingState } from '@/lib/types';
import MoleculeViewer from '@/components/molecule-viewer';
import UIOverlay from '@/components/ui-overlay';

export default function Home() {
  // Stav aplikace
  const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [query, setQuery] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  // Funkce pro vyhledávání molekuly
  const handleSearch = useCallback(async () => {
    // Validace vstupu
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Zadejte název molekuly');
      return;
    }

    // Reset stavu a zahájení načítání
    setLoadingState('loading');
    setError(null);
    setMolecule(null);

    try {
      // Odeslání požadavku na API
      const response = await fetch('/api/molecule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      // Zpracování odpovědi
      const data = await response.json();

      if (!response.ok) {
        // Chybová odpověď
        throw new Error(data.error || 'Neznámá chyba');
      }

      // Úspěšné načtení molekuly
      setMolecule(data);
      setLoadingState('success');

    } catch (err) {
      // Zpracování chyby
      const errorMessage = err instanceof Error ? err.message : 'Chyba při načítání molekuly';
      setError(errorMessage);
      setLoadingState('error');
    }
  }, [query]);

  // Renderování stránky
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D vizualizace molekuly */}
      <MoleculeViewer 
        molecule={molecule} 
        isLoading={loadingState === 'loading'} 
      />
      
      {/* Uživatelské rozhraní */}
      <UIOverlay
        molecule={molecule}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        isLoading={loadingState === 'loading'}
        error={error}
      />
    </main>
  );
}
