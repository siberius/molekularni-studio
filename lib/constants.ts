// Konstanty pro Molekulární Studio
// CPK barevné schéma pro chemické prvky

import { ElementStyle } from './types';

/**
 * CPK barevné schéma pro chemické prvky
 * Každý prvek má přiřazenou charakteristickou barvu a velikost
 * Barvy jsou založeny na standardním CPK (Corey–Pauling–Koltun) modelu
 */
export const ELEMENT_STYLES: Record<string, ElementStyle> = {
  // Základní prvky
  H: { color: '#FFFFFF', radius: 0.31 }, // Vodík - bílá
  C: { color: '#909090', radius: 0.77 }, // Uhlík - tmavě šedá
  N: { color: '#3050F8', radius: 0.71 }, // Dusík - modrá
  O: { color: '#FF0D0D', radius: 0.66 }, // Kyslík - červená
  
  // Halogeny
  F: { color: '#90E050', radius: 0.64 }, // Fluor - zelená
  Cl: { color: '#1FF01F', radius: 0.99 }, // Chlor - jasně zelená
  Br: { color: '#A62929', radius: 1.14 }, // Brom - tmavě červená
  I: { color: '#940094', radius: 1.33 }, // Jód - fialová
  
  // Další nekovové prvky
  P: { color: '#FF8000', radius: 1.07 }, // Fosfor - oranžová
  S: { color: '#FFFF30', radius: 1.05 }, // Síra - žlutá
  B: { color: '#FFB5B5', radius: 0.87 }, // Bor - růžová
  Si: { color: '#F0C8A0', radius: 1.11 }, // Křemík - béžová
  
  // Kovy
  Fe: { color: '#E06633', radius: 1.26 }, // Železo - oranžovo-hnědá
  Cu: { color: '#C88033', radius: 1.28 }, // Měď - měděná
  Zn: { color: '#7D80B0', radius: 1.34 }, // Zinek - šedomodrá
  
  // Alkalické kovy a kovy alkalických zemin
  Li: { color: '#CC80FF', radius: 1.34 }, // Lithium - světle fialová
  Na: { color: '#AB5CF2', radius: 1.66 }, // Sodík - fialová
  K: { color: '#8F40D4', radius: 2.03 }, // Draslík - tmavě fialová
  Mg: { color: '#8AFF00', radius: 1.41 }, // Hořčík - jasně zelená
  Ca: { color: '#3DFF00', radius: 1.76 }, // Vápník - zelená
};

/**
 * Výchozí styl pro neznámé prvky
 */
export const DEFAULT_ELEMENT_STYLE: ElementStyle = {
  color: '#FF69B4', // Růžová pro neznámé prvky
  radius: 1.0
};

/**
 * Získá styl prvku podle jeho symbolu
 * @param element - Symbol chemického prvku
 * @returns Styl prvku (barva a poloměr)
 */
export const getElementStyle = (element: string): ElementStyle => {
  return ELEMENT_STYLES[element] ?? DEFAULT_ELEMENT_STYLE;
};

/**
 * Konstanty pro vizualizaci vazeb
 */
export const BOND_CONSTANTS = {
  SINGLE_RADIUS: 0.08, // Poloměr jednoduché vazby
  DOUBLE_SPACING: 0.2, // Rozestup dvojné vazby
  TRIPLE_SPACING: 0.25, // Rozestup trojné vazby
  COLOR: '#4A5568', // Barva vazby (šedá)
};
