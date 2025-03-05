# 🏰️ GitHub Organisation Repositories Klonen

Dieses Skript ermöglicht das automatische Klonen aller Repositories einer GitHub-Organisation.  
Es fragt interaktiv nach den benötigten Informationen und verwendet **SSH**.

---

## 🚀 Installation

1. **Node.js installieren** (falls nicht vorhanden)  
   [Download Node.js](https://nodejs.org/)
2. **Pakete installieren**

   ```sh
   npm install
   ```

3. **Skript ausführen**
   ```sh
   node index.js
   ```

---

## 🔑 GitHub Token für private Repositories (optional)

Falls du private Repositories klonen möchtest, benötigst du einen **Personal Access Token (PAT)**.

### **📌 Token erstellen:**

1. Gehe zu [GitHub Tokens](https://github.com/settings/tokens)
2. Klicke auf **"Generate new token (classic)"**
3. Aktiviere die **Repo-Berechtigungen**:
   - ✅ `repo`
   - ✅ `read:org`
4. **Token speichern**, da er nach der Erstellung nicht erneut angezeigt wird.
5. Gib den Token ein, wenn das Skript danach fragt.

---

## 🔐 GitHub SSH-Key einrichten (empfohlen für SSH)

Falls du **SSH für GitHub** verwenden möchtest, benötigst du einen SSH-Schlüssel.

### **📌 Prüfen, ob bereits ein SSH-Schlüssel existiert**

```sh
ls -al ~/.ssh
```

Falls du eine Datei wie `id_rsa.pub` oder `id_ed25519.pub` siehst, hast du bereits einen Key.

### **📌 Falls kein SSH-Schlüssel existiert, neuen erstellen**

```sh
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Falls `ed25519` nicht unterstützt wird:

```sh
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

Die Datei wird unter `~/.ssh/id_ed25519.pub` gespeichert.

### **📌 SSH-Agent starten und Schlüssel hinzufügen**

```sh
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### **📌 SSH-Schlüssel zu GitHub hinzufügen**

1. Öffne den Schlüssel:
   ```sh
   cat ~/.ssh/id_ed25519.pub
   ```
2. Kopiere den Inhalt und füge ihn unter [GitHub SSH-Keys](https://github.com/settings/keys) hinzu.

### **📌 Verbindung zu GitHub testen**

```sh
ssh -T git@github.com
```

Falls alles funktioniert, siehst du:

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🛠️ Nutzung des Skripts

1. **Skript starten**
   ```sh
   node cloneRepos.js
   ```
2. **Folgende Eingaben tätigen:**

   - 📝 **GitHub Organisation** (z. B. `openai`).
   - 🔑 **GitHub Token** (optional, wenn private Repos geklont werden sollen).
   - 👤 **Zielverzeichnis** (wenn leer gelassen, wird `./ORG_NAME-repos` genutzt).

3. **Das Skript klont alle Repositories in das gewählte Verzeichnis.**  
   Falls ein Repository bereits existiert, wird es **übersprungen**.

---

## ❓ Fehlerbehebung

### **💡 GitHub SSH Permission Denied (`git@github.com: Permission denied (publickey).`)**

- Stelle sicher, dass dein **SSH-Schlüssel zu GitHub hinzugefügt wurde**.
- Führe das Testkommando aus:
  ```sh
  ssh -T git@github.com
  ```
- Falls Probleme bestehen, lösche alte Keys:
  ```sh
  rm -rf ~/.ssh
  ssh-keygen -t ed25519 -C "your-email@example.com"
  ```

### **💡 Fehler: `fatal: could not read from remote repository`**

- Prüfe, ob du das **richtige Protokoll verwendest**:
  - SSH: `git@github.com:...`
  - HTTPS: `https://github.com/...`
- Falls du kein SSH nutzen möchtest, passe das Skript an, um **HTTPS statt SSH** zu verwenden:
  ```javascript
  return response.data.map((repo) => repo.clone_url);
  ```

---

## 📚 Lizenz

Dieses Projekt ist unter der **MIT-Lizenz** veröffentlicht.
