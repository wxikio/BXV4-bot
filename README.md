# 🤖 Discord Shop Bot

Bot complet pour serveur shop — FiveM, Steam, Discord, Netflix.

---

## ⚙️ Installation

```bash
# 1. Installe les dépendances
npm install

# 2. Copie le fichier d'environnement
cp .env.example .env

# 3. Mets ton token dans .env
#    DISCORD_TOKEN=ton_token_ici

# 4. Lance le bot
node index.js
```

---

## 🚀 Commande Setup

Une fois le bot sur ton serveur, tape dans n'importe quel salon :

```
!setup
```

> ⚠️ Tu dois être **Administrateur** pour lancer le setup.

Le bot va créer automatiquement :

### 📢 INFORMATIONS
| Salon | Description |
|---|---|
| 👋・bienvenue | Message de bienvenue automatique |
| 📜・règles | Règles du serveur |
| 📣・annonces | Annonces staff |

### 🛒 SHOP
| Salon | Contenu |
|---|---|
| 🖥️・fivem | Embed FiveM Ready [Fresh] |
| 🎮・steam | Embed Steam Full Access |
| 💬・discord | Embed FA Discord Accounts |
| 🎬・netflix | Embed Netflix Lifetime |

### 🎫 TICKETS
| Salon | Description |
|---|---|
| 🎫・ouvrir-ticket | Panel avec bouton ticket |
| ticket-[pseudo] | Créé automatiquement à l'ouverture |

---

## 🎫 Système Ticket

- Clic sur **🎫 Ouvrir un Ticket** → salon privé créé
- Clic sur **🔒 Fermer le Ticket** → salon supprimé après 5s
- 1 ticket par utilisateur

## 👋 Bienvenue Auto

Chaque nouveau membre reçoit un embed de bienvenue dans `👋・bienvenue`.

---

## 🔑 Obtenir un Token Bot

1. Va sur [discord.com/developers](https://discord.com/developers/applications)
2. **New Application** → donne un nom
3. Onglet **Bot** → **Reset Token** → copie le token
4. Active les **Privileged Intents** : `Server Members Intent` & `Message Content Intent`
5. **OAuth2 → URL Generator** : scopes `bot`, permissions `Administrator`
6. Invite le bot sur ton serveur avec l'URL générée
