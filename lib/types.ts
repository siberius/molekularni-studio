// Molekulární Studio - Typy a rozhraní
// Definice TypeScript typů pro molekulární vizualizaci

// Styl prvku pro CPK barevné schéma
export interface ElementStyle {
  color: string;          // Barva prvku v hexadecimálním formátu
  radius: number;         // Poloměr atomu v angströmech
}

// Rozhraní pro atom
export interface Atom {
  id: number;           // Unikátní identifikátor atomu
  element: string;      // Symbol prvku (H, C, O, N, atd.)
  x: number;            // X souřadnice v 3D prostoru
  y: number;            // Y souřadnice v 3D prostoru
  z: number;            // Z souřadnice v 3D prostoru
}

// Rozhraní pro chemickou vazbu
export interface Bond {
  atom1: number;        // ID prvního atomu
  atom2: number;        // ID druhého atomu
  order: number;        // Řád vazby (1=jednoduchá, 2=dvojná, 3=trojná)
}

// Metadata molekuly z PubChem
export interface MoleculeMetadata {
  weight?: string;      // Molekulární hmotnost
  source?: string;      // Zdroj dat (PubChem)
  atomCount?: number;   // Počet atomů
  bondCount?: number;   // Počet vazeb
}

// Hlavní rozhraní pro molekulu
export interface Molecule {
  name: string;         // Název molekuly
  formula: string;      // Chemický vzorec
  atoms: Atom[];        // Pole atomů
  bonds: Bond[];        // Pole vazeb
  metadata?: MoleculeMetadata; // Dodatečné informace
}

// Stav načítání
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Rozhraní pro chybovou odpověď
export interface ErrorResponse {
  error: string;
}

// Rozhraní pro stav aplikace
export interface AppState {
  molecule: Molecule | null;
  loadingState: LoadingState;
  error: string | null;
  query: string;
}

// Props pro 3D scénu
export interface ThreeSceneProps {
  molecule: Molecule;
}

// Props pro MoleculeViewer
export interface MoleculeViewerProps {
  molecule: Molecule | null;
  isLoading: boolean;
}

// Props pro UI overlay
export interface UIOverlayProps {
  molecule: Molecule | null;
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: string | null;
}
