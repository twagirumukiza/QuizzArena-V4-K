# Connexion Firebase — BuzzArena V2.2

1. Dans la console Firebase, créez un projet puis une **application Web**.
2. Activez **Authentication > Méthode de connexion > Anonyme**.
3. Créez **Realtime Database** dans la région souhaitée.
4. Ouvrez les règles de Realtime Database et collez le contenu de `database.rules.json`, puis publiez.
5. Copiez la configuration de l’application Web dans `firebase-config.js`.
6. Dans **Authentication > Settings > Authorized domains**, ajoutez votre domaine GitHub Pages, par exemple `votre-compte.github.io`.
7. Déposez tous les fichiers à la racine du dépôt GitHub Pages.

## Test rapide

- Ouvrez le site dans deux navigateurs ou deux appareils.
- Le premier joueur crée un salon et copie le lien.
- Le second ouvre le lien, saisit son pseudo et rejoint le salon.
- Le créateur lance la partie.

La connexion utilise Firebase Authentication anonyme. Les joueurs disposent donc d’un identifiant Firebase unique sans création de compte.
