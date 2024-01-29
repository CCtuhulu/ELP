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

// Fonction pour valider si un mot est un nom commun 
function estNomCommun(mot) {
    // Ajouter ici la logique pour vérifier si le mot est un nom commun
    // Par exemple, vous pouvez utiliser une liste de noms communs pour la vérification
    return true; 
}


// Fonction pour vérifier si les lettres à ajouter sont disponibles dans la main du joueur
function lettresDisponiblesDansMain(lettresAAjouter, main) {
    // Ajouter ici la logique pour vérifier si les lettres sont disponibles dans la main du joueur
    // Devoir s'assurer que les lettres à ajouter sont dans la main du joueur
    return true; 
}

// Fonction pour le tour du joueur
const readline = require('readline');

// Fonction asynchrone pour obtenir la décision du joueur
async function obtenirDecision() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question("Que voulez-vous faire ? (jouer, transformer un mot, passer) ", (decision) => {
            resolve(decision);
            rl.close();
        });
    });
}


async function tourDuJoueur(joueur, main) {
const decision = await obtenirDecision();
console.log(`Vous avez choisi de : ${decision}`);

// Vérifier la décision du joueur
if (decision === "jouer") {
    console.log("Bonne chance !");

    // Demander au joueur de saisir un mot
    motJoue = await obtenirDecision();

    // Valider le mot
    if (motJoue.length >= 3 && estNomCommun(motJoue)) {
        console.log(`Vous avez joué le mot : ${motJoue}`);
        // Ajoutez ici le code pour traiter le mot joué
    } else {
        console.log("Mot invalide. Veuillez choisir un mot d'au moins trois lettres qui est un nom commun.");
    }




} else if (decision === "transformer un mot") {
    console.log("Vous avez choisi de transformer un mot.");

    // Demander au joueur de saisir le mot à transformer
    const motATransformer = await obtenirDecision();

    
// Valider que le mot à transformer est affiché
if (motAffiche.includes(motATransformer)) {
    // Demander au joueur de saisir les lettres à ajouter
    const lettresAAjouter = await obtenirDecision("Saisissez les lettres que vous voulez ajouter :");

    // Valider que les lettres à ajouter sont disponibles dans la main du joueur
    if (lettresDisponiblesDansMain(lettresAAjouter, main)) {
        console.log(`Vous avez choisi de transformer le mot : ${motATransformer} en ajoutant les lettres : ${lettresAAjouter}`);

        // Demander au joueur de saisir le nouveau mot
        const nouveauMot = await obtenirDecision("Saisissez le nouveau mot que vous voulez afficher :");

        // Valider le nouveau mot
        if (nouveauMot.length >= 3 && estNomCommun(nouveauMot)) {
            console.log(`Vous avez choisi d'afficher le nouveau mot : ${nouveauMot}`);
            // Ajoutez ici le code pour traiter l'affichage du nouveau mot
        } else {
            console.log("Mot invalide. Veuillez choisir un mot d'au moins trois lettres qui est un nom commun.");
        }
    } else {
        console.log("Lettres invalides. Veuillez choisir des lettres disponibles dans votre main.");
    }
}


} else if (decision === "passer") {
    console.log("Vous avez choisi de passer votre tour.");
    // Ajoutez ici le code pour le cas où le joueur choisit de passer son tour
} else {
    console.log("Décision invalide. Veuillez choisir parmi jouer, transformer un mot ou passer.");
    // Ajoutez ici le code pour gérer une décision invalide
}
}

    // Appel de la fonction pour le tour du joueur
tourDuJoueur();

// Fonction pour jouer un tour
function jouerTour(joueur, main) {
    console.log(`Tour du joueur ${joueur}`);
    console.log(`Main du joueur ${joueur}: ${main}`);

    // Appeler la fonction pour le tour du joueur
    tourDuJoueur(joueur, main);

    // Le joueur pioche une lettre à chaque tour
    if (lettresDisponibles.length > 0) {
    const nouvelleLettre = piocherLettresJoueur()[0];
    main.push(nouvelleLettre);

    console.log(`Le joueur ${joueur} a pioché la lettre "${nouvelleLettre}". Nouvelle main: ${main}`);
}

else {
    console.log("Il n'y a plus de lettres disponibles. Fin du jeu !");
}
}

// Initialiser les mains des joueurs
const mainsJoueurs = initialiserMainsJoueurs();

// Début du jeu (tour du joueur 1)
jouerTour(1, mainsJoueurs.joueur1);

// Tour du joueur 2
jouerTour(2, mainsJoueurs.joueur2);

    




