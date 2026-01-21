'use client';

// Klientská wrapper komponenta pro 3D vizualizaci molekuly
// Spravuje načítání Three.js komponent a zobrazení stavů

import { useState, useEffect } from 'react';
import { Molecule } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

/**
 * Props pro MoleculeViewer
 */
interface MoleculeViewerProps {
  molecule: Molecule | null;
  isLoading: boolean;
}

/**
 * Loading komponenta - zobrazí se při načítání
 */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-slate-400 text-sm">Načítám 3D prostředí...</p>
    </div>
  );
}

/**
 * Stav hledání - zobrazí se při vyhledávání molekuly
 */
function SearchingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      <p className="text-slate-400 text-lg">Hledám molekulu v databázi PubChem...</p>
    </div>
  );
}

// Dynamický import Three.js scény bez SSR
const ThreeScene = dynamic(() => import('./three-scene'), {
  ssr: false,
  loading: () => <LoadingState />
});

/**
 * Wrapper komponenta pro bezpečné načtení Three.js na klientovi
 */
export default function MoleculeViewer({ molecule, isLoading }: MoleculeViewerProps) {
  // Stav připojení komponenty pro bezpečné klientské renderování
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Zobrazíme loading dokud není komponenta připojena
  if (!isMounted) {
    return <LoadingState />;
  }

  // Zobrazíme stav hledání
  if (isLoading) {
    return <SearchingState />;
  }

  // Zobrazíme prázdný stav pokud není molekula
  if (!molecule) {
    return null; // UI overlay zobrazí úvodní text
  }

  return <ThreeScene molecule={molecule} />;
}
