# Molekulární Studio 🧪

**3D vizualizér chemických molekul s daty z PubChem**

---

## 🇷🇺 Русский

### Описание

Interaktivný 3D vizualizér molekul, který využívá veřejnou databázi PubChem (NIH/NCBI) pro získávání strukturních dat molekul. Žádný API klíč není potřeba!

### Funkce

- 🔍 **Vyhledávání molekul** - zadejte název v angličtině
- 🌐 **3D vizualizace** - interaktivní rotace a zoom
- 🎨 **CPK barvy** - standardní barevné schéma prvků
- ⛓️ **Chemické vazby** - jednoduché, dvojné, trojné
- 📊 **Informace** - vzorec, hmotnost, počet atomů
- 🆓 **Zdarma** - bez API klíče, bez omezení

### Spuštění lokálně

```bash
# Klonovъní repozitáře
git clone https://github.com/YOUR_USERNAME/molekularni-studio.git
cd molekularni-studio

# Instalace závislostí
yarn install

# Spuštění vývojového serveru
yarn dev
```

Aplikace bude dostupná na `http://localhost:3000`

### Technologie

- **Next.js 14** - React framework
- **Three.js** - 3D grafika
- **TypeScript** - typová bezpečnost
- **Tailwind CSS** - stylování
- **PubChem API** - zdroj molekulárních dat

---

## 🇨🇿 Čeština

### Popis

Interaktivní 3D vizualizér molekul využívající veřejnou databázi PubChem (NIH/NCBI). Není potřeba žádný API klíč!

### Vlastnosti

- 🔍 **Vyhledávání** - názvy molekul v angličtině
- 🌐 **3D zobrazení** - interaktivní ovládání myší
- 🎨 **CPK barvy** - standardní chemické barvy
- ⛓️ **Vazby** - všechny typy chemických vazeb
- 📊 **Metadata** - vzorec, hmotnost, zdroj
- 🆓 **Bezplatně** - žádné poplatky, žádná registrace

### Použití

1. Otevřete aplikaci v prohlížeči
2. Zadejte název molekuly v angličtině (např. "Caffeine", "Aspirin", "Ethanol")
3. Klikněte na "Vizualizovat"
4. Použijte myš pro rotaci a kolečko pro přiblížení

### Příklady molekul

- `Caffeine` - kofein
- `Aspirin` - kyselina acetylsalicylová
- `Ethanol` - etanol (alkohol)
- `Glucose` - glukóza
- `Dopamine` - dopamin
- `Serotonin` - serotonin
- `Cholesterol` - cholesterol
- `Testosterone` - testosteron

---

## 🚀 Deploy

Viz [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pro podrobné instrukce.

**Rychlý deploy na Vercel:**
1. Fork tento repozitář
2. Propojte s Vercel
3. Deploy! (žádné environment variables nejsou potřeba)

---

## 📄 Licence

MIT License - volné použití

## 🙏 Poděkování

- [PubChem](https://pubchem.ncbi.nlm.nih.gov/) - NIH/NCBI za veřejnou databázi molekul
- [Three.js](https://threejs.org/) - 3D grafická knihovna
- [Next.js](https://nextjs.org/) - React framework
