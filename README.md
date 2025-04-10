# 🧠 SmartCommit

> Génère automatiquement des messages de commit intelligents en français à partir du diff Git, grâce à l'API OpenAI.

![demo](https://img.shields.io/badge/AI-Powered-blueviolet)  
✨ Écris des messages de commit clairs, utiles et stylés — sans te prendre la tête.

---

## 🔍 Fonctionnalités

- Analyse les fichiers `staged` (`git add`)
- Récupère le `diff` de chaque fichier
- Utilise GPT-3.5/4 via OpenAI pour générer une ligne de commit par fichier
- Format clair, en français, avec emoji
- Compatible avec les clés API OpenAI **`sk-proj-...`**

---

## ⚙️ Installation

1. Clone le repo :
   ```bash
   git clone https://github.com/JYM34/smart-commit.git
   cd smart-commit-helper
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

3. Crée ton fichier `.env` :
   ```bash
   cp .env.example .env
   ```

4. Mets ta clé API OpenAI dans `.env` :
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

---

## 🚀 Utilisation

1. Stage tes fichiers modifiés :
   ```bash
   git add .
   ```

2. Lance le script :
   ```bash
   npm start
   ```

3. Résultat :
   ```
   📝 Message de commit suggéré :

   - ✨ Ajout de la vérification d'auth dans `dashboard.js`
   - 🔧 Mise à jour de la config JSON pour les guilds
   ```

4. Copie-colle le message dans ton `git commit -m`

---

## 📦 Dépendances

- Node.js 18+
- [`dotenv`](https://www.npmjs.com/package/dotenv)
- [`node-fetch`](https://www.npmjs.com/package/node-fetch)

---

## 🛡️ Sécurité

- Ta clé API est lue depuis un fichier `.env` (non commité)
- Ne publie jamais ta clé `sk-proj-...` en public !

---

## 💡 À venir

- Support pour `OpenRouter`, `Ollama`, ou autres backends IA
- Mode `conventional commits`
- Intégration directe dans un `git hook`

---

## 🤝 Contribuer

Tu as une idée d'amélioration ? Une PR est la bienvenue 🙌  
Ou ouvre une `issue` si tu veux discuter d’une nouvelle feature !

---

## 🧑‍💻 Auteur

Made with ❤️ by **JYM**

Licence : MIT
