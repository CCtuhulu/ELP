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
    while (fin.is_still_going(player1.carpet, player2.carpet,disp_letters )) {
		activePlayer = partie[tour % 2] ;
		jump_line(9);
		console.log("joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		jarnac(activePlayer, tour, partie[(tour + 1) % 2]);
		activePlayer.disp_carpet();
		jump_line(1);
		activePlayer.disp_letters();
		//jump_line(2);
		drawTurn(tour, activePlayer);
		jump_line(3);
		activePlayer.disp_letters();
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

// Fonction pour détecter si un mot aurait pu être formé avec les lettres du tapis de l'adversaire
function detecterJarnac(motPotentiel, tapisAdversaire) {
    // Ajouter ici la logique pour vérifier si le mot aurait pu être formé avec les lettres du tapis
    // Vous devez vous assurer que les lettres du mot potentiel sont disponibles dans le tapis de l'adversaire
    return true; 
}

// Fonction pour vérifier si toutes les lignes du plateau sont remplies
function toutesLesLignesRemplies(plateau) {
    // Ajouter ici la logique pour vérifier si toutes les lignes sont remplies
    // Vous devez vous assurer que chaque ligne contient des mots (ou d'autres critères spécifiques)
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


// Fonction pour gérer le tour du joueur
function tourDuJoueur() {
    
    // Demander au joueur de prendre une décision
    let decision = prompt("Que voulez-vous faire ? (jouer, ne pas jouer, passer)");

    // Vérifier la décision du joueur
    if (decision === "jouer") {
        console.log("Bonne chance !");
    
        // Demander au joueur de saisir un mot
        console.log("Veuillez saisir un nouveau mot:");
        let proposition = prompt("Entrez votre proposition :");
    
        // Valider le mot
        if (proposition.length >= 3 && estNomCommun(proposition)) {
            console.log(`Vous avez joué le mot : ${proposition}`);
            
        } else {
            console.log("Mot invalide. Veuillez choisir un mot d'au moins trois lettres qui est un nom commun.");
        }
    
    
    
    
    } else if (decision === "transformer un mot") {
        console.log("Vous avez choisi de transformer un mot.");
    
        // Demander au joueur de saisir le mot à transformer
        console.log("quel mot voulez vous transformer?");
        let transformation = prompt("Entrez votre proposition :");
    
        
    // Valider que le mot à transformer est affiché
    if (motAffiche.includes(transformation)) {
        // Demander au joueur de saisir les lettres à ajouter
        console.log("Saisissez les lettres que vous voulez ajouter :");
        let lettresAAjouter = prompt("les lettres a ajouter sont:");
    
        // Valider que les lettres à ajouter sont disponibles dans la main du joueur
        if (lettresDisponiblesDansMain(lettresAAjouter, main)) {
            console.log(`Vous avez choisi de transformer le mot : ${transformation} en ajoutant les lettres : ${lettresAAjouter}`);
    
            // Demander au joueur de saisir le nouveau mot
            console.log("Saisissez le nouveau mot que vous voulez afficher :");
            let nouveauMot = prompt("quel nouveau mot voulez vous former?");
    
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
   

} else {
    console.log("Décision invalide. Veuillez choisir parmi jouer, transformer un mot ou passer.");
    // Ajoutez ici le code pour gérer une décision invalide
}
  
}

// Appel de la fonction pour le tour du joueur
tourDuJoueur();
