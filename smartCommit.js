const { execSync } = require("child_process");
const fs = require("fs");

// 📂 Liste les fichiers modifiés par rapport au dernier commit
const changedFiles = execSync("git diff --name-only HEAD")
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean);

if (changedFiles.length === 0) {
  console.log("✅ Aucun fichier modifié.");
  process.exit(0);
}

// 🔄 Analyse les diffs, même pour les fichiers supprimés
const diffs = changedFiles.map(file => {
  try {
    const fileExists = fs.existsSync(file);

    // ⚠️ Important : on utilise '--' pour dire à Git que ce sont des fichiers, pas des branches
    const diff = execSync(`git diff HEAD -- "${file}"`).toString();

    if (!fileExists) {
      console.log(`🗑️  Le fichier supprimé "${file}" est inclus dans le commit.`);
    }

    return { file, diff };
  } catch (e) {
    console.warn(`⚠️ Erreur lors de l'analyse de ${file} :`, e.message);
    return null;
  }
}).filter(Boolean);

// 🧠 Génère un titre de commit basé sur les domaines de fichiers touchés
const getTitle = () => {
  // 🗂️ Dictionnaire de domaines personnalisés selon les chemins
  const domainMap = {
    "bot/Modules": "statut du bot",
    "bot/Events": "événements Discord",
    "bot/SlashCommands": "commandes",
    "bot/Loaders": "chargement du bot",
    "bot/Fonctions": "fonctions utilitaires",
    "shared/": "données partagées",
    "web/Routes/auth.js": "authentification Discord",
    "web/Views/": "vues EJS",
    "bot/config.js": "configuration",
    "start.js": "démarrage",
    "bot/index.js": "lancement principal"
  };

  const domains = new Set();

  changedFiles.forEach(file => {
    for (const prefix in domainMap) {
      if (file.startsWith(prefix)) {
        domains.add(domainMap[prefix]);
        break;
      }
    }
  });

  const base = "🔧 Améliorations diverses sur ";
  const title = [...domains].join(", ") || "le projet";
  return base + title;
};

// 📋 Génère un résumé des fichiers modifiés
const summary = diffs.map(({ file }) => {
  const isDeleted = !fs.existsSync(file);
  const emoji = isDeleted ? "🗑️" : "🛠️";
  return `- ${emoji} Modification de \`${file}\``;
}).join("\n");

// 📝 Affichage final du commit généré
console.log("\n📝 **Message de commit suggéré :**\n");
console.log(getTitle());
console.log("\n" + summary);
