// jarnac.js
const prompt =require("prompt-sync")();

// Fonction pour initialiser le jeu
function initializeGame() {
    console.log("Bienvenue dans Jarnac Game");
}

// Appel de la fonction pour initialiser le jeu
initializeGame();

function jeuPrincipal() {
    let game_log = "";
    let joueur1 = player.create_player(1);
    let joueur2 = player.create_player(2);
    let partie = [joueur1, joueur2];
    let tour = 0;
    while (fin.is_still_going(player1.carpet, player2.carpet,lettresDisponibles )) {
		activePlayer = partie[tour % 2] ;
		jump_line(9);
		console.log("joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		jarnac(activePlayer, tour, partie[(tour + 1) % 2]);
		activePlayer.disp_carpet();
		jump_line(1);
		actionOfPlayer(activePlayer, 0);
		tour = tour + 1;
	}
	console.log("Fin de partie au bout de " + Math.round(tour/2) + " tours.");
	console.log(fin.winner(player1.carpet, player2.carpet));
	console.log("Scores :")
	console.log("Joueur 1 : " + fin.score(player1.carpet))
	console.log("Joueur 2 : " + fin.score(player2.carpet))

	return game_log

}

module.exports = {
    jeuPrincipal,
};



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

//fonction pour vérifier si un mot est correct
function mot_correct(mot) {
    // Vérifier si la longueur du mot est entre 3 et 9 inclus
    if (mot.length >= 3 && mot.length <= 9) {
        return true;
    } else {
        return false;
    }
}

// Fonction pour vérifier si les lettres à ajouter sont disponibles dans la main du joueur
function lettresDisponiblesDansMain(lettresAAjouter, main) {
    // Copier la main du joueur pour éviter les modifications directes
    const mainCopie = [...main];

    // Vérifier chaque lettre à ajouter
    for (const lettre of lettresAAjouter) {
        // Vérifier si la lettre est dans la main du joueur
        const indexLettre = mainCopie.indexOf(lettre);

        // Si la lettre n'est pas trouvée, retourner false
        if (indexLettre === -1) {
            console.log(`Lettre "${lettre}" non disponible dans la main du joueur.`);
            return false;
        }

        // Retirer la lettre de la mainCopie
        mainCopie.splice(indexLettre, 1);
    }

    // Si toutes les lettres sont disponibles, retourner true
    return true;
}



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
    const mainJoueur2= piocherLettresJoueur();

    return {
        joueur1: mainJoueur1,
        joueur2: mainJoueur2,
    };
}


function tourDuJoueur() {
    let decision;

    // Utiliser une boucle while pour répéter le processus jusqu'à ce que la décision soit valide
    while (true) {
        // Demander au joueur de prendre une décision
        decision = prompt("Que voulez-vous faire ? (jouer, transformer un mot, passer)");

        // Vérifier la décision du joueur
        if (decision === "jouer") {
            console.log("Bonne chance !");

            // Demander au joueur de saisir un mot
            console.log("Veuillez saisir un nouveau mot:");
            let proposition = prompt("Entrez votre proposition :");

            // Valider le mot
            if (proposition.length >= 3 && mot_correct(proposition)) {
                console.log(`Vous avez joué le mot : ${proposition}`);
                break; // Sortir de la boucle si la décision est valide
            } else {
                console.log("Mot invalide. Veuillez choisir un mot d'au moins trois lettres qui est un nom commun.");
            }
        } else if (decision === "transformer un mot") {
            console.log("Vous avez choisi de transformer un mot.");

            // Demander au joueur de saisir le mot à transformer
            console.log("Quel mot voulez-vous transformer?");
            let transformation = prompt("Entrez votre proposition :");

            // Valider que le mot à transformer est affiché
            if (motAffiche.includes(transformation)) {
                // Demander au joueur de saisir les lettres à ajouter
                console.log("Saisissez les lettres que vous voulez ajouter :");
                let lettresAAjouter = prompt("Les lettres à ajouter sont:");

                // Valider que les lettres à ajouter sont disponibles dans la main du joueur
                if (lettresDisponiblesDansMain(lettresAAjouter, main)) {
                    console.log(`Vous avez choisi de transformer le mot : ${transformation} en ajoutant les lettres : ${lettresAAjouter}`);

                    // Demander au joueur de saisir le nouveau mot
                    console.log("Saisissez le nouveau mot que vous voulez afficher :");
                    let nouveauMot = prompt("Quel nouveau mot voulez-vous former?");

                    // Valider le nouveau mot
                    if (nouveauMot.length >= 3 && mot_correct(nouveauMot)) {
                        console.log(`Vous avez choisi d'afficher le nouveau mot : ${nouveauMot}`);
                        // Ajoutez ici le code pour traiter l'affichage du nouveau mot
                        break; // Sortir de la boucle si la décision est valide
                    } else {
                        console.log("Mot invalide. Veuillez choisir un mot d'au moins trois lettres qui est un nom commun.");
                    }
                } else {
                    console.log("Lettres invalides. Veuillez choisir des lettres disponibles dans votre main.");
                }
            }
        } else if (decision === "passer") {
            console.log("Vous avez choisi de passer votre tour.");
            break; // Sortir de la boucle si la décision est valide
        } else {
            console.log("Décision invalide. Veuillez choisir parmi jouer, transformer un mot ou passer.");
            // Ajoutez ici le code pour gérer une décision invalide
        }
    }
}

// Appeler la fonction pour le tour du joueur
tourDuJoueur();


// Fonction pour détecter si un mot aurait pu être formé avec les lettres du tapis de l'adversaire
function detecterJarnac(motPotentiel, carpetAdversaire) {
    // Vérifier si les lettres du mot potentiel sont disponibles dans le tapis de l'adversaire
    if (lettresDisponiblesDansMain(motPotentiel, carpetAdversaire)) {
        // Ajouter ici la logique pour traiter Jarnac
        console.log('Jarnac détecté ! Le mot "${motPotentiel}"  aurait pu être formé:');

        // Ajouter le mot au tapis de l'adversaire
        carpetAdversaire.push(...motPotentiel);

        // Piocher 6 lettres supplémentaires
        const lettresPiochees = lettresDisponibles(6);
        carpetAdversaire.push(...lettresPiochees);

        return true;
    } 
}
// Appeler la fonction pour détecter Jarnac
detecterJarnac(motPotentiel, carpetAdversaire);


