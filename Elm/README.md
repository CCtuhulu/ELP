# Guess it!

## Ce qu'on propose
Notre projet "Guess it!" est un jeu qui consiste à deviner un mot grâce à ses définitions.
Voici quelques fonctionnalités qu'on a:
- Un affichage plûtot beau et agréable.
- Une difficulté réglable en ajoutant des définitions.
- Un timer qui calcule le temps qu'il a fallu pour trouver la réponse.

## Configuration
### Etape 1: Installation de Elm et des packages
1.Suivez ce lien pour installer Elm: https://guide.elm-lang.org/install/elm.html
2.Installez ces packages avec ces commandes `elm install elm/browser
                                           elm install elm/http
                                           elm install elm/random
                                           elm install elm/json
                                           elm install elm/time`

### Etape 2: Clonage et compilation du projet
1. Clonez le projet en utilisant `git clone https://github.com/CCtuhulu/ELP`
2. Mettez vous dans le dossier Elm avec: `cd /Elm`
3. Créez le fichier index.html avec: `elm make src/Main.elm`
4. Créez le fichier js avec: `elm make src/Main.elm --optimize --output=elm.js`

### Etape 3: Connexion au serveur
1. Tapez dans le terminal: `elm reactor`
2. Tapez sur votre navigateur: http://localhost:8000/
