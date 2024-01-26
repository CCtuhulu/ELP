// jarnac.js

// Fonction pour initialiser le jeu
function initializeGame() {
    console.log("Bienvenue dans Jarnac Game");

    // Tirer au sort le premier joueur à jouer (1 ou 2)
    const premierJoueur = Math.floor(Math.random() * 2) + 1;

    console.log(`Le joueur ${premierJoueur} jouera en premier.`);
}

// Appel de la fonction pour initialiser le jeu
initializeGame();

const lettresDisponibles = [
    { lettre: 'A', quantite: 14 },
    { lettre: 'B', quantite: 4 },
    { lettre: 'C', quantite: 7 },
    { lettre: 'D', quantite: 5 },
    { lettre: 'E', quantite: 19 },
    { lettre: 'F', quantite: 2 },
    { lettre: 'G', quantite: 4 },
    { lettre: 'H', quantite: 2 },
    { lettre: 'I', quantite: 11 },
    { lettre: 'J', quantite: 1 },
    { lettre: 'K', quantite: 1 },
    { lettre: 'L', quantite: 6 },
    { lettre: 'M', quantite: 5 },
    { lettre: 'N', quantite: 9 },
    { lettre: 'O', quantite: 8 },
    { lettre: 'P', quantite: 4 },
    { lettre: 'Q', quantite: 1 },
    { lettre: 'R', quantite: 10 },
    { lettre: 'S', quantite: 7 },
    { lettre: 'T', quantite: 9 },
    { lettre: 'U', quantite: 8 },
    { lettre: 'V', quantite: 2 },
    { lettre: 'W', quantite: 1 },
    { lettre: 'X', quantite: 1 },
    { lettre: 'Y', quantite: 1 },
    { lettre: 'Z', quantite: 2 }
];

// Fonction pour piocher des lettres au hasard pour un joueur
function piocherLettresJoueur() {
    const lettresPiochees = [];

    // Piocher 6 lettres au hasard
    for (let i = 0; i < 6; i++) {
        const lettreIndex = Math.floor(Math.random() * lettresDisponibles.length);
        const lettre = lettresDisponibles[lettreIndex].lettre;
        
        // Retirer la lettre du pool des lettres disponibles
        lettresDisponibles[lettreIndex].quantite--;
        if (lettresDisponibles[lettreIndex].quantite === 0) {
            lettresDisponibles.splice(lettreIndex, 1);
        }

        lettresPiochees.push(lettre);
    }

    return lettresPiochees;
}

// Fonction pour chaque joueur pioche 6 lettres
function initialiserMainsJoueurs() {
    const mainJoueur1 = piocherLettresJoueur();
    const mainJoueur2 = piocherLettresJoueur();

    return {
        joueur1: mainJoueur1,
        joueur2: mainJoueur2
    };
}


const readline = require('readline');

// Fonction pour le tour du joueur
function tourDuJoueur(joueur, main) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Que voulez-vous faire ? (jouer, ne pas jouer, passer) ", (decision) => {
        console.log("Vous avez choisi de :" + decision);

        // Vérifier la décision du joueur
        if (decision === "jouer") {
            console.log("Bonne chance !");
            // Ajoutez ici le code pour le cas où le joueur choisit de jouer
        } else if (decision === "ne pas jouer") {
            console.log("Vous avez choisi de ne pas jouer.");
            // Ajoutez ici le code pour le cas où le joueur choisit de ne pas jouer
        } else if (decision === "passer") {
            console.log("Vous avez choisi de passer votre tour.");
            // Ajoutez ici le code pour le cas où le joueur choisit de passer son tour
        } else {
            console.log("Décision invalide. Veuillez choisir parmi jouer, ne pas jouer ou passer.");
            // Vous pouvez ajouter ici une logique pour gérer une décision invalide
        }

        rl.close();
    });
    
}

// Fonction pour jouer un tour
function jouerTour(joueur, main) {
    console.log(`Tour du joueur ${joueur}`);
    console.log(`Main du joueur ${joueur}: ${main}`);

    // Appeler la fonction pour le tour du joueur
    tourDuJoueur(joueur, main);

    // Le joueur pioche une lettre à chaque tour
    const nouvelleLettre = piocherLettresJoueur()[0];
    main.push(nouvelleLettre);

    console.log(`Le joueur ${joueur} a pioché la lettre "${nouvelleLettre}". Nouvelle main: ${main}`);
}

// Initialiser les mains des joueurs
const mainsJoueurs = initialiserMainsJoueurs();

// Début du jeu (tour du joueur 1)
jouerTour(1, mainsJoueurs.joueur1);

// Tour du joueur 2
jouerTour(2, mainsJoueurs.joueur2);
