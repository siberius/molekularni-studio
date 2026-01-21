# 🚀 Deployment Guide / Příručka pro nasazení

---

## 🇷🇺 Руководство по деплою

### Важно: API ключ не нужен!

Приложение использует бесплатную публичную базу данных PubChem (NIH/NCBI). Никаких API ключей или регистраций не требуется!

---

### Шаг 1: Создание GitHub репозитория

1. Откройте [github.com/new](https://github.com/new)
2. Введите имя репозитория: `molekularni-studio`
3. Выберите "Public" или "Private"
4. Нажмите "Create repository"

### Шаг 2: Загрузка кода

```bash
# Клонирование пустого репозитория
git clone https://github.com/YOUR_USERNAME/molekularni-studio.git
cd molekularni-studio

# Копирование файлов проекта
# (скопируйте все файлы проекта сюда)

# Коммит и пуш
git add .
git commit -m "Initial commit: Molekulární Studio"
git push origin main
```

### Шаг 3: Деплой на Vercel

1. Откройте [vercel.com](https://vercel.com) и войдите через GitHub
2. Нажмите **"Add New..." → "Project"**
3. Найдите и выберите репозиторий `molekularni-studio`
4. Настройки:
   - **Framework Preset:** Next.js
   - **Root Directory:** `nextjs_space` ⚠️ **ВАЖНО!**
   - **Environment Variables:** ✅ **Не нужны!**
5. Нажмите **"Deploy"**

Готово! Приложение будет доступно по адресу `https://molekularni-studio.vercel.app`

### Шаг 4: Автоматические обновления

Vercel автоматически деплоит при каждом push в main ветку!

```bash
# Внесите изменения
git add .
git commit -m "Ваше описание"
git push origin main
# Деплой произойдёт автоматически!
```

---

## 🇨🇿 Příručka pro nasazení

### Důležité: API klíč není potřeba!

Aplikace využívá bezplatnou veřejnou databázi PubChem (NIH/NCBI). Žádné API klíče ani registrace nejsou vyžadovány!

---

### Krok 1: Vytvoření GitHub repozitáře

1. Otevřete [github.com/new](https://github.com/new)
2. Zadejte název: `molekularni-studio`
3. Zvolte viditelnost (Public/Private)
4. Klikněte "Create repository"

### Krok 2: Nahrání kódu

```bash
# Klonování prázdného repozitáře
git clone https://github.com/YOUR_USERNAME/molekularni-studio.git
cd molekularni-studio

# Zkopírujte soubory projektu
# (všechny soubory z tohoto projektu)

# Commit a push
git add .
git commit -m "Initial commit: Molekulární Studio"
git push origin main
```

### Krok 3: Deploy na Vercel

1. Otevřete [vercel.com](https://vercel.com) a přihlašte se přes GitHub
2. Klikněte **"Add New..." → "Project"**
3. Najděte a vyberte `molekularni-studio`
4. Nastavení:
   - **Framework Preset:** Next.js
   - **Root Directory:** `nextjs_space` ⚠️ **DŮLEŽITÉ!**
   - **Environment Variables:** ✅ **Nejsou potřeba!**
5. Klikněte **"Deploy"**

Hotovo! Aplikace bude dostupná na `https://molekularni-studio.vercel.app`

### Krok 4: Automatické aktualizace

Vercel automaticky deployuje při každém push do main větve!

```bash
# Proveďte změny
git add .
git commit -m "Váš popis změn"
git push origin main
# Deploy proběhne automaticky!
```

---

## 🛠️ GitHub Actions (volitelně / опционально)

Pokud chcete použít GitHub Actions místo automatického Vercel deploy:

### Nastavení secrets:

1. V repozitáři: **Settings → Secrets and variables → Actions**
2. Přidejte:
   - `VERCEL_TOKEN` - z [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - z `.vercel/project.json` po `vercel link`
   - `VERCEL_PROJECT_ID` - z `.vercel/project.json` po `vercel link`

### Získání Vercel ID:

```bash
# Nainstalujte Vercel CLI
npm i -g vercel

# Připojte projekt
vercel link

# Zkopírujte hodnoty z .vercel/project.json
cat .vercel/project.json
```

Workflow soubor je již připraven v `.github/workflows/deploy.yml`

---

## 🌐 Alternativní hosting

### Netlify

1. [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
2. Připojte GitHub repozitář
3. Build settings:
   - **Build command:** `yarn build`
   - **Publish directory:** `.next`
4. Deploy!

### Vlastní server

```bash
# Instalace
yarn install

# Build
yarn build

# Spuštění
yarn start -p 3000
```

Použijte PM2 nebo Docker pro produkční provoz.

---

## ❓ řešení problémů / Troubleshooting

### Molekula nebyla nalezena

- Použijte anglický název (Caffeine, ne Kofein)
- Zkuste systematický název (acetylsalicylic acid místo Aspirin)
- Ověřte správnost názvu na [pubchem.ncbi.nlm.nih.gov](https://pubchem.ncbi.nlm.nih.gov)

### Build selhává

- Zkontrolujte verzi Node.js (vyžadováno 18+)
- Smažte `node_modules` a `yarn.lock`, pak `yarn install`

### 3D scéna se nezobrazuje

- Aktualizujte prohlížeč
- Zapněte hardwarovou akceleraci
- Vyzkoušejte jiný prohlížeč (Chrome/Firefox)

---

## 📞 Podpora / Support

- PubChem dokumentace: [pubchem.ncbi.nlm.nih.gov/docs](https://pubchem.ncbi.nlm.nih.gov/docs/)
- Next.js dokumentace: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel dokumentace: [vercel.com/docs](https://vercel.com/docs)
