// Molekulární Studio - PubChem API Route
// API route pro získávání molekulárních dat z veřejné databáze PubChem
// Bez potřeby API klíče - zcela zdarma

import { NextRequest, NextResponse } from 'next/server';

// Rozhraní pro PubChem odpověď
interface PubChemCompound {
  id: { id: { cid: number } };
  atoms: {
    aid: number[];
    element: number[];
  };
  bonds?: {
    aid1: number[];
    aid2: number[];
    order?: number[];
  };
  coords: Array<{
    type: number[];
    aid: number[];
    conformers: Array<{
      x: number[];
      y: number[];
      z?: number[];
    }>;
  }>;
  props?: Array<{
    urn: { label: string };
    value: { sval?: string; fval?: number; ival?: number };
  }>;
}

// Mapování atomových čísel na symboly prvků
const ELEMENT_SYMBOLS: { [key: number]: string } = {
  1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne',
  11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar',
  19: 'K', 20: 'Ca', 26: 'Fe', 29: 'Cu', 30: 'Zn', 35: 'Br', 53: 'I'
};

// Pomocná funkce pro získání symbolu prvku
function getElementSymbol(atomicNumber: number): string {
  return ELEMENT_SYMBOLS[atomicNumber] || 'X';
}

// Funkce pro vyhledání molekuly podle názvu
async function searchMolecule(query: string): Promise<number | null> {
  try {
    // Zkusíme přímé vyhledání podle názvu
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`;
    const response = await fetch(searchUrl, { next: { revalidate: 3600 } });
    
    if (response.ok) {
      const data = await response.json();
      if (data.IdentifierList?.CID?.length > 0) {
        return data.IdentifierList.CID[0];
      }
    }
    
    // Pokud přímé vyhledání selže, zkusíme autocomplete
    const autocompleteUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(query)}/json?limit=1`;
    const autoResponse = await fetch(autocompleteUrl, { next: { revalidate: 3600 } });
    
    if (autoResponse.ok) {
      const autoData = await autoResponse.json();
      if (autoData.dictionary_terms?.compound?.length > 0) {
        const exactName = autoData.dictionary_terms.compound[0];
        // Vyhledáme CID pro nalezený název
        const cidUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(exactName)}/cids/JSON`;
        const cidResponse = await fetch(cidUrl, { next: { revalidate: 3600 } });
        if (cidResponse.ok) {
          const cidData = await cidResponse.json();
          if (cidData.IdentifierList?.CID?.length > 0) {
            return cidData.IdentifierList.CID[0];
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Chyba při vyhledávání molekuly:', error);
    return null;
  }
}

// Funkce pro získání 3D dat molekuly
async function get3DData(cid: number): Promise<PubChemCompound | null> {
  try {
    // Nejprve zkusíme 3D konformér
    const url3d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/JSON?record_type=3d`;
    const response3d = await fetch(url3d, { next: { revalidate: 3600 } });
    
    if (response3d.ok) {
      const data = await response3d.json();
      if (data.PC_Compounds?.length > 0) {
        return data.PC_Compounds[0];
      }
    }
    
    // Pokud 3D není k dispozici, použijeme 2D a přidáme z=0
    const url2d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/JSON`;
    const response2d = await fetch(url2d, { next: { revalidate: 3600 } });
    
    if (response2d.ok) {
      const data = await response2d.json();
      if (data.PC_Compounds?.length > 0) {
        return data.PC_Compounds[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Chyba při získávání 3D dat:', error);
    return null;
  }
}

// Funkce pro získání vlastností molekuly
async function getMoleculeProperties(cid: number): Promise<{ formula: string; name: string; weight: string }> {
  try {
    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,Title/JSON`;
    const response = await fetch(propsUrl, { next: { revalidate: 3600 } });
    
    if (response.ok) {
      const data = await response.json();
      const props = data.PropertyTable?.Properties?.[0];
      if (props) {
        return {
          formula: props.MolecularFormula || 'N/A',
          name: props.Title || props.IUPACName || 'N/A',
          weight: props.MolecularWeight ? `${props.MolecularWeight} g/mol` : 'N/A'
        };
      }
    }
    
    return { formula: 'N/A', name: 'N/A', weight: 'N/A' };
  } catch (error) {
    console.error('Chyba při získávání vlastností:', error);
    return { formula: 'N/A', name: 'N/A', weight: 'N/A' };
  }
}

// Funkce pro transformaci PubChem dat do formátu aplikace
function transformToMolecule(
  compound: PubChemCompound,
  props: { formula: string; name: string; weight: string }
) {
  const atoms: Array<{ id: number; element: string; x: number; y: number; z: number }> = [];
  const bonds: Array<{ atom1: number; atom2: number; order: number }> = [];
  
  // Získáme koordináty
  const coords = compound.coords?.[0]?.conformers?.[0];
  if (!coords || !compound.atoms) {
    throw new Error('Molekula nemá dostupné souřadnice');
  }
  
  const xCoords = coords.x || [];
  const yCoords = coords.y || [];
  const zCoords = coords.z || Array(xCoords.length).fill(0); // 2D molekuly mají z=0
  
  // Vytvoříme mapování aid -> index
  const aidToIndex: { [key: number]: number } = {};
  
  // Transformace atomů
  compound.atoms.aid.forEach((aid, index) => {
    const element = getElementSymbol(compound.atoms.element[index]);
    aidToIndex[aid] = index;
    
    atoms.push({
      id: index,
      element,
      x: xCoords[index] || 0,
      y: yCoords[index] || 0,
      z: zCoords[index] || 0
    });
  });
  
  // Transformace vazeb
  if (compound.bonds) {
    const aid1 = compound.bonds.aid1 || [];
    const aid2 = compound.bonds.aid2 || [];
    const orders = compound.bonds.order || Array(aid1.length).fill(1);
    
    aid1.forEach((a1, index) => {
      const a2 = aid2[index];
      const order = orders[index] || 1;
      
      if (aidToIndex[a1] !== undefined && aidToIndex[a2] !== undefined) {
        bonds.push({
          atom1: aidToIndex[a1],
          atom2: aidToIndex[a2],
          order: Math.min(order, 3) // Max trojná vazba
        });
      }
    });
  }
  
  return {
    name: props.name,
    formula: props.formula,
    atoms,
    bonds,
    metadata: {
      weight: props.weight,
      source: 'PubChem',
      atomCount: atoms.length,
      bondCount: bonds.length
    }
  };
}

// POST handler - hlavní endpoint pro vyhledávání molekul
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Chybí dotaz na molekulu' },
        { status: 400 }
      );
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return NextResponse.json(
        { error: 'Prázdný dotaz' },
        { status: 400 }
      );
    }
    
    // Vyhledáme CID molekuly
    const cid = await searchMolecule(trimmedQuery);
    
    if (!cid) {
      return NextResponse.json(
        { error: `Molekula "${trimmedQuery}" nebyla nalezena v databázi PubChem` },
        { status: 404 }
      );
    }
    
    // Získáme 3D data a vlastnosti paralelně
    const [compound, props] = await Promise.all([
      get3DData(cid),
      getMoleculeProperties(cid)
    ]);
    
    if (!compound) {
      return NextResponse.json(
        { error: 'Nepodařilo se získat strukturu molekuly' },
        { status: 500 }
      );
    }
    
    // Transformujeme do formátu aplikace
    const molecule = transformToMolecule(compound, props);
    
    return NextResponse.json(molecule);
    
  } catch (error) {
    console.error('Chyba API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}

// GET handler - pro testování a informace
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Molekulární Studio API',
    dataSource: 'PubChem (NIH/NCBI)',
    apiKey: 'Není vyžadován',
    endpoints: {
      POST: 'Vyhledání molekuly podle názvu'
    },
    example: {
      method: 'POST',
      body: { query: 'caffeine' }
    }
  });
}
