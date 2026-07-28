# BuzzArena V4 — Quiz multijoueur avec Présentateur TV

## 🎙️ Nouveautés V4

### Présentateur TV IA
- **Voix masculine** ou **voix féminine** via synthèse vocale du navigateur
- **Mode sobre** : annonces textuelles uniquement
- **Mode désactivé** : silence total
- Annonces dynamiques : questions DOUBLE/TRIPLE, finalistes, suspense, champion

### Fin de partie spectaculaire
- Extinction des lumières + transition dramatique
- Roulement de tambour + suspense vocal
- Confettis animés en canvas
- Feux d'artifice CSS
- Trophée doré animé
- Musique de victoire

### 📊 Analyse finale
Le présentateur conclut avec les statistiques du champion :
- Nombre de bonnes réponses
- Temps moyen de réponse
- Meilleure série
- Badges décernés

### 🏅 Badges & Succès
- 🔥 Série de 5 bonnes réponses consécutives
- ⚡ Éclair (réponse en moins de 1 seconde)
- 🎯 Sans faute (100% de bonnes réponses)
- 👑 Champion

### 🎲 Thèmes multiples
Le créateur coche plusieurs thèmes parmi :
- 🏛️ Histoire
- 📚 Culture générale
- 📱 Culture contemporaine
- 🎬 7ᵉ Art
- ⚽ Sport
- 🐘 Animaux
- 🏛️ Capitales des pays
- 🚩 Drapeaux des pays

L'IA compose un quiz unique en répartissant équitablement les questions entre les thèmes sélectionnés.

### ⚙️ Gameplay
- Scores réinitialisés à chaque manche
- **Anti-répetition** : une question posée dans une manche ne revient jamais dans la suivante
- Temps par question : **10 à 120 secondes** au choix
- Passage automatique dès que **tous les joueurs ont répondu**
- **Reconnexion automatique** après rafraîchissement de page

## 📁 Structure

| Fichier | Description |
|---------|-------------|
| `index.html` | Interface complète (home, lobby, jeu, résultats, finale) |
| `styles.css` | Design responsive + animations confettis/feux d'artifice |
| `app.js` | Logique multijoueur, présentateur vocal, stats, fin de partie |
| `questions.js` | Banque de 9 thèmes × 20 questions |
| `firebase-config.js` | Configuration Firebase (à remplir) |
| `database.rules.json` | Règles de sécurité Realtime Database |

## 🚀 Déploiement rapide

1. Créez un projet Firebase, activez **Realtime Database** et **Authentication Anonyme**.
2. Copiez la config Web dans `firebase-config.js`.
3. Publiez les règles de `database.rules.json`.
4. Déployez sur GitHub Pages (ou tout hébergeur statique).

## 🎮 Test local (sans Firebase)

Si `firebase-config.js` est vide, le jeu démarre en **mode démonstration** avec un bot.

## 📝 Crédits sons

Les fichiers audio fournis sont utilisés pour :
- `floraphonic-cute-level-up-1-189852.mp3` — Buzzer réponse
- `freesound_community-clock-timer-reverb-58822.mp3` — Timer tick
- `maksymmalko-game-minecraft-gaming-background-music-402451.mp3` — Musique d'ambiance
- `mori_sound-fx-done-trumpet-510841.mp3` — Fin du timer
- `peekaboolabcreative-11l-victory_sound_with_t-1749487402950-357606.mp3` — Victoire
- `astralsynthesizer-11l-victory_trumpet-1749704498589-358767.mp3` — Roulement de tambour
- `freesound_community-finished-54341.mp3` — Fin de partie
