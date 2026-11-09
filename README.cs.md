# Molekulární Studio: 3D vizualizér molekul s daty z PubChem

[English](README.md)

Interaktivní 3D prohlížeč chemických molekul. Zadej anglický název molekuly,
aplikace stáhne strukturní data z veřejné databáze PubChem (NIH/NCBI)
a vykreslí model koule a tyče s CPK barvami prvků. Není potřeba API klíč,
databáze ani registrace.

## Spuštění

Ověřeno proti skriptům v `package.json`; instalace v této dokumentační
revizi nebyla spuštěna celá.

1. Naklonuj repozitář a otevři ho v terminálu.
2. `npm install` (nebo `yarn install`)
3. `npm run dev` a otevři `http://localhost:3000`

Vyžaduje Node.js pro Next.js 14. Produkční nasazení: `npm run build`
a `npm start`. Nejsou potřeba žádné proměnné prostředí; přibalené schéma
Prisma se nepoužívá (`lib/db.ts` exportuje null klient, aplikace čte jen
PubChem).

## Funkce

- Hledání podle anglického názvu molekuly (například Caffeine, Aspirin,
  Ethanol); dotazy jdou vlastní API routou aplikace do PubChem
- Interaktivní 3D scéna s otáčením a přibližováním, postavená na Three.js
- CPK barvy prvků a jednoduché, dvojné i trojné vazby
- Informace o molekule: vzorec, hmotnost a počet atomů
- Žádný API klíč, žádná databáze, žádná telemetrie

## Co to není

Není to editor molekul ani nástroj výpočetní chemie: žádná měření, silová
pole ani molekulová dynamika. Model je omezen strukturálními daty, která
PubChem pro danou látku vrátí. Rozhraní je jen české; názvy molekul se
zadávají anglicky, protože vyhledávání PubChem očekává anglickou
nomenklaturu.

## Jazyky

Rozhraní aplikace je české. Toto README existuje v angličtině
([README.md](README.md)) a češtině (tento soubor); obě vydání nesou
stejná fakta.

## Data a soukromí

Vyhledávací dotazy posílá vlastní API routa aplikace do veřejné REST
služby PubChem. Neexistuje databáze, systém účtů, analytika ani cookies.
Vlastní nasazení posílá dotazy ze svého serveru do PubChem.

## Soubory

| Cesta | Účel |
|---|---|
| `app/page.tsx` | Stav a rozvržení stránky |
| `app/api/molecule/route.ts` | Serverová routa načítající data PubChem |
| `components/three-scene.tsx`, `components/molecule-viewer.tsx` | 3D vykreslování |
| `components/ui-overlay.tsx` | Vyhledávací rozhraní |
| `lib/constants.ts` | CPK barvy a konstanty |

## Dokumentace

- [Průvodce nasazením](DEPLOYMENT_GUIDE.md) (Vercel a alternativy)

## Licence a autor

MIT, copyright © 2026 Luděk Sušický. Viz [LICENSE](LICENSE).

Luděk Sušický: biolog, středoškolský a vysokoškolský učitel informatických
předmětů · [@siberius na GitHubu](https://github.com/siberius) — další
vzdělávací projekty a open-source aplikace

[Repozitář na GitHubu](https://github.com/siberius/molekularni-studio)
