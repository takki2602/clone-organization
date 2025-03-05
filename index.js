const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const readline = require("readline");

// Funktion zum Abrufen der Benutzereingabe
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  console.log("==== 🏗️ GitHub Repositories Klonen ====\n");

  // Benutzer nach Eingaben fragen
  const orgName = await askQuestion("📝 GitHub Organisation: ");

  console.log("\n🔑 Falls du private Repositories klonen möchtest, benötigst du einen Personal Access Token.");
  console.log("➡️ Token generieren: https://github.com/settings/tokens\n");
  const githubToken = await askQuestion("🔐 GitHub Token (optional, leer lassen für öffentliche Repos): ");

  const targetDir = (await askQuestion(`📂 Zielverzeichnis (Standard: ./${orgName}-repos): `)) || `./${orgName}-repos`;

  // Zielverzeichnis erstellen
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // API-URL für die Repositories der Organisation
  const apiUrl = `https://api.github.com/orgs/${orgName}/repos?per_page=100`;

  async function getRepositories() {
    try {
      const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
      const response = await axios.get(apiUrl, { headers });
      return response.data.map((repo) => repo.ssh_url); // SSH-URLs verwenden
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Repository-Liste:", error.message);
      process.exit(1);
    }
  }

  async function cloneRepositories() {
    const repos = await getRepositories();

    if (repos.length === 0) {
      console.log("⚠️ Keine Repositories gefunden.");
      return;
    }

    console.log(`📥 Klone ${repos.length} Repositories in "${targetDir}"...\n`);

    for (const repo of repos) {
      const repoName = repo.split("/").pop().replace(".git", "");
      const repoPath = path.join(targetDir, repoName);

      if (fs.existsSync(repoPath)) {
        console.log(`🔄 Überspringe ${repoName}, da es bereits existiert.`);
        continue;
      }

      console.log(`🚀 Cloning ${repoName}...`);
      try {
        execSync(`git clone ${repo}`, { stdio: "inherit", cwd: targetDir });
      } catch (error) {
        console.error(`❌ Fehler beim Klonen von ${repoName}:`, error.message);
      }
    }

    console.log("\n✅ Alle Repositories wurden erfolgreich geklont!");
  }

  await cloneRepositories();
}

main();
