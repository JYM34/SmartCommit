#!/usr/bin/env node
import "dotenv/config";
import fetch from "node-fetch";
import { execSync } from "child_process";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "openai/gpt-3.5-turbo";

if (!OPENAI_API_KEY) {
  console.error("❌ Clé OpenAI manquante. Ajoute-la dans .env.");
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const getStagedFiles = () => {
  const output = run("git diff --cached --name-only");
  return output.split("\n").filter(Boolean);
};

const getDiff = (file) => {
  try {
    return run(`git diff --cached ${file}`);
  } catch {
    return "";
  }
};

const askOpenAI = async (diff, filename) => {
    const prompt = `
  Tu es un assistant qui aide à écrire des messages de commit git. Résume clairement ce que fait ce diff du fichier ${filename}, en français, avec un emoji au début :
  \`\`\`diff
  ${diff}
  \`\`\`
  `;
  
  const res = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL, // ou "anthropic/claude-3-haiku" ou autre modèle OpenRouter
      messages: [
        { role: "system", content: "Tu génères des messages de commit git concis, utiles, en français." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    })
  });
  
    const json = await res.json();
  
    // 🛠️ DEBUG pour voir ce que répond OpenAI
    console.log(`📤 Prompt envoyé à OpenAI (${filename}) :\n`, prompt);
    console.log("📥 Réponse brute :\n", JSON.stringify(json, null, 2));
  
    const message = json.choices?.[0]?.message?.content?.trim();
    return message && !message.includes("non précisée")
      ? message
      : `🛠️ Modification dans \`${filename}\``;
  };
  

const generate = async () => {
  const files = getStagedFiles();
  if (files.length === 0) {
    console.log("📭 Aucun fichier stagé.");
    return;
  }

  console.log("🧠 Analyse des fichiers modifiés...\n");

  const results = await Promise.all(files.map(async (file) => {
    const diff = getDiff(file);
    if (!diff) return `- 🛠️ Modification de \`${file}\``;

    const message = await askOpenAI(diff, path.basename(file));
    return `- ${message}`;
  }));

  console.log("\n📝 **Message de commit suggéré :**\n");
  console.log(results.join("\n"));
};

generate();