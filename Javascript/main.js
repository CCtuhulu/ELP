const readlineSync = require('readline-sync');
const fs = require('fs');
const logFile = 'log.txt';


//Liste des lettres
const lettresDisponibles = [["A", 14],["B", 4],["C", 7],["D", 5],["E", 19],["F", 2],["G", 4],["H", 2],["I", 11],["J", 1],["K", 1],["L", 6],["M", 5],["N" , 9],["O" , 8],["P" , 4],["Q" , 1],["R" , 10],["S", 7],["T", 9],["U", 8],["V", 2],["W" , 1],["X" , 1],["Y" , 1],["Z", 2]]

//Piocher un nombre nbaPiocher de lettres
function piocherLettres(nbaPiocher, pioche) {
    let lettresListe = []

    for(i=0; i<nbaPiocher; i++) {
        let randomNumber = Math.floor(Math.random() * lettresDisponibles.length);

        let lettre = pioche[randomNumber][0];
        pioche[randomNumber][1] = (pioche[randomNumber][1])-1;

        //Check si il y'a plus de ces lettres
        if (pioche[randomNumber][1] === 0){
            pioche.splice(randomNumber,1);
        }

        lettresListe.push(lettre);
        
    }
    return lettresListe
}

//Affichage du début du tour
function affichage(mainJoueur1, mainJoueur2, plateauJoueur1, plateauJoueur2){
    console.log("======================= Etat du jeu =======================")
    console.log(`Main du premier joueur : ${mainJoueur1.join(" ")}`)
    console.log(`\nMain du deuxième joueur: ${mainJoueur2.join(" ")}`)
    
    console.log("\nPlateau du premier joueur :")
    for (i=0; i < plateauJoueur1.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauJoueur1[i]}`)
    }

    console.log("\nPlateau du deuxieme joueur:")
    for (i=0; i < plateauJoueur2.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauJoueur2[i]}`)
    }
}


//Echanger 3 lettres de la pioche
function echangeLettres(mainActuel){
    let proceed = false
    let reponse

    //Check si le joueur a bien mis des lettres qu'il a
    while(!proceed){
        proceed = true

        console.log(`\nVotre main: ${mainActuel.join(" ")}`)
        reponse = readlineSync.question("Quelles lettres voulez vous echanger?(colles) ")

        if (reponse.length != 3){
            console.log("Il faut 3 lettres exactement!")
            proceed = false
        }

        else{
            let tempMain = [...mainActuel]

            for(i=0; i<reponse.length; i++){
                let letter = reponse[i].toUpperCase()

                if(tempMain.includes(letter)){
                    let index = tempMain.indexOf(letter)
                    tempMain.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Tu n'a pas ces lettres!!")
                    break
                }
            }

        }
    }

    //Enleve les lettres choisis et les ajoute à la pioche
    for(i=0; i<reponse.length; i++){
        let letter = reponse[i].toUpperCase()

        let index = mainActuel.indexOf(letter)
        mainActuel.splice(index,1)
        lettresDisponibles.push([letter,1])
    }

    //Pioche 3 autres lettres
    newLetters = piocherLettres(3,lettresDisponibles)
    mainActuel = [...mainActuel,...newLetters]

    //Afficher la nouvell main
    console.log(`Votre nouvelle main: ${mainActuel.join(" ")}`)

    //Log l'action
    fs.appendFileSync(logFile, `Il a echange 3 lettres de sa main\n`)

    return mainActuel

}

//Jouer un mot de la main du joueur
function jouerMot(mainActuel,plateauActuel){
    let proceed = false
    let reponse

    //Check si le joueur a bien les lettres du mot
    while(!proceed){
        proceed = true

        console.log(`\nVotre main: ${mainActuel.join(" ")}`)
        reponse = readlineSync.question("Quel mot voulez vous creer? ")

        if (reponse.length < 3){
            console.log("Le mot doit avoir une taille minimale de 3")
            proceed = false
        }

        else{
            let tempMain = [...mainActuel]

            for(i=0; i<reponse.length; i++){
                let letter = reponse[i].toUpperCase()

                if(tempMain.includes(letter)){
                    let index = tempMain.indexOf(letter)
                    tempMain.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Tu n'a pas ces lettres!!")
                    break
                }
            }

        }
    }

    //Enleve les lettres choisis
    for(i=0; i<reponse.length; i++){
        let letter = reponse[i].toUpperCase()

        let index = mainActuel.indexOf(letter)
        mainActuel.splice(index,1)
    }

    //Ajoute le mot au plateau
    plateauActuel.push(reponse)

    //Piocher une lettre
    newLetter = piocherLettres(1,lettresDisponibles)
    mainActuel = [...mainActuel,...newLetter]

    //Afficher les changements
    console.log(`Vous jouer le mot: ${reponse}`)

    console.log("Votre nouveau plateau :")
    for (i=0; i < plateauActuel.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauActuel[i]}`)
    }

    console.log(`Vous piochez une lettre, votre nouvelle main est: ${mainActuel.join(" ")}\n`)

    //Log l'action
    fs.appendFileSync(logFile, `Il a pose le mot ${reponse}\n`)

    return {main: mainActuel, plateau: plateauActuel}
}

//Jouer un mot de la main du joueur
function transformerMot(mainActuel,plateauActuel){
    let proceed = false
    let reponse

    let ligne = 999

    //Print le tableau actuel et la main actuel
    console.log("Votre plateau :")
    for (i=0; i < plateauActuel.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauActuel[i]}`)
    }
    console.log(`\nVotre main: ${mainActuel.join(" ")}`)

    //Check pour la validité de la ligne
    while (ligne > plateauActuel.length || ligne < 1){
        ligne = readlineSync.question("Quelle ligne? ")
    }
    let mot = plateauActuel[ligne-1]

    //Check si le joueur a bien les lettres du mot
    while(!proceed){
        proceed = true

        console.log(`\nVotre main: ${mainActuel.join(" ")}`)
        reponse = readlineSync.question(`Comment voulez vous transformer le mot: ${mot}? `)

        if (reponse.length < mot.length+1){
            console.log("Le mot doit avoir une taille strictement supérieur!")
            proceed = false
        }

        else{

            let tempMain = [...mainActuel,...mot.toUpperCase()]

            //Check si le joueur a les lettres pour le nouveau mot
            for(i=0; i<reponse.length; i++){
                let letter = reponse[i].toUpperCase()

                if(tempMain.includes(letter)){
                    let index = tempMain.indexOf(letter)
                    tempMain.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Tu n'a pas ces lettres!!")
                    break
                }
            }

            //Check si le joueur a mis les lettres de l'ancien mot dans le nouveau
            let tempReponse = [...reponse.toUpperCase()]
            for(i=0; i<mot.length; i++){
                let letter = mot[i].toUpperCase()

                if(tempReponse.includes(letter)){
                    let index = tempReponse.indexOf(letter)
                    tempReponse.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Il faut avoir les lettres de l'ancien mot!!")
                    break
                }
            }

        }
    }

    //Enleve les lettres choisis en creant une liste des lettres ajoutées
    let result = [...reponse.toUpperCase()].filter(item => ![...mot.toUpperCase()].includes(item));
    for(i=0; i<result.length; i++){
        let letter = result[i].toUpperCase()

        let index = mainActuel.indexOf(letter)
        mainActuel.splice(index,1)
    }

    //Ajoute le mot au plateau
    plateauActuel[ligne-1] = reponse

    //Piocher une lettre
    newLetter = piocherLettres(1,lettresDisponibles)
    mainActuel = [...mainActuel,...newLetter]

    //Afficher les changements
    console.log(`Vous avez changé ${mot} en ${reponse}`)

    console.log("Votre nouveau plateau :")
    for (i=0; i < plateauActuel.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauActuel[i]}`)
    }

    console.log(`Vous piochez une lettre, votre nouvelle main est: ${mainActuel.join(" ")}\n`)

    //Log l'action
    fs.appendFileSync(logFile, `Il a transforme le mot: ${mot} de la ligne n°${ligne} en ${reponse}\n`)

    return {main: mainActuel, plateau: plateauActuel}
}

//Jarnaqué l'adversaire
function jarnac(mainActuel,plateauActuel,plateauAdversaire){
    let proceed = false
    let reponse

    let ligne = 999

    //Print le tableau adversaire et la main actuel
    console.log("Plateau de l'adversaire :")
    for (i=0; i < plateauAdversaire.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauAdversaire[i]}`)
    }
    console.log(`\nVotre main: ${mainActuel.join(" ")}`)

    //Check pour la validité de la ligne
    while (ligne > plateauAdversaire.length || ligne < 1){
        ligne = readlineSync.question("Quelle ligne? ")
    }
    let mot = plateauAdversaire[ligne-1]

    //Check si le joueur a bien les lettres du mot
    while(!proceed){
        proceed = true

        console.log(`\nVotre main: ${mainActuel.join(" ")}`)
        reponse = readlineSync.question(`Comment voulez vous jarnaque le mot: ${mot}? `)

        if (reponse.length < mot.length+1){
            console.log("Le mot doit avoir une taille strictement supérieur!")
            proceed = false
        }

        else{

            let tempMain = [...mainActuel,...mot.toUpperCase()]

            //Check si le joueur a les lettres pour le nouveau mot
            for(i=0; i<reponse.length; i++){
                let letter = reponse[i].toUpperCase()

                if(tempMain.includes(letter)){
                    let index = tempMain.indexOf(letter)
                    tempMain.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Tu n'a pas ces lettres!!")
                    break
                }
            }

            //Check si le joueur a mis les lettres de l'ancien mot dans le nouveau
            let tempReponse = [...reponse.toUpperCase()]
            for(i=0; i<mot.length; i++){
                let letter = mot[i].toUpperCase()

                if(tempReponse.includes(letter)){
                    let index = tempReponse.indexOf(letter)
                    tempReponse.splice(index,1)
                }
                else {
                    proceed = false
                    console.log("Il faut avoir les lettres de l'ancien mot!!")
                    break
                }
            }

        }
    }

    //Enleve les lettres choisis en creant une liste des lettres ajoutées
    let result = [...reponse.toUpperCase()].filter(item => ![...mot.toUpperCase()].includes(item));
    for(i=0; i<result.length; i++){
        let letter = result[i].toUpperCase()

        let index = mainActuel.indexOf(letter)
        mainActuel.splice(index,1)
    }

    //Enleve mot plateau adversaire
    let index = plateauAdversaire.indexOf(mot)
    plateauAdversaire.splice(index,1)

    //Ajoute le mot au plateau
    plateauActuel.push(reponse)


    //Afficher les changements
    console.log(`Vous avez jarnaque le mot: ${mot} en ${reponse}`)

    console.log("Votre nouveau plateau :")
    for (i=0; i < plateauActuel.length; i++){
        console.log(`\tLigne ${i+1}: ${plateauActuel[i]}`)
    }

    console.log(`Vous piochez une lettre apres jarnac, votre nouvelle main est: ${mainActuel.join(" ")}\n`)

    //Log l'action
    fs.appendFileSync(logFile, `Il a jarnac le mot: ${mot} de la ligne n°${ligne} en ${reponse}\n`)

    return {main: mainActuel, plateau: plateauActuel, plateauadversaire: plateauAdversaire}
}

//Check la terminaison du jeu
function finPartie(plateauActuel){
    if(plateauActuel.length > 7){
        return true
    }
    else{
        return false
    }
}

//Calculer le score et fin de partie
function calculScore(plateauJoueur1,plateauJoueur2){
    let scoreJoueur1 = 0
    let scoreJoueur2 = 0

    for(i=0; i<plateauJoueur1.length; i++){
        scoreJoueur1 = scoreJoueur1 + plateauJoueur1[i].length * plateauJoueur1[i].length
    }

    for(i=0; i<plateauJoueur2.length; i++){
        scoreJoueur2 = scoreJoueur2 + plateauJoueur2[i].length * plateauJoueur2[i].length
    }

    console.log(`Le premier joueur a un score de : ${scoreJoueur1}`)
    console.log(`Le deuxieme joueur a un score de: ${scoreJoueur2}`)

    //Log l'action
    fs.appendFileSync(logFile, `========= Fin du jeu =========\n`)
    fs.appendFileSync(logFile, `Le premier joueur a un score de : ${scoreJoueur1}\n`)
    fs.appendFileSync(logFile, `Le deuxieme joueur a un score de: ${scoreJoueur2}\n`)

    if(scoreJoueur1 > scoreJoueur2){
        console.log("Le premier joueur a gagné!!!")
        fs.appendFileSync(logFile, `Le premier joueur a gagné\n`)
    }
    else if(scoreJoueur1 < scoreJoueur2){
        console.log("Le deuxieme joueur a gagné!!!")
        fs.appendFileSync(logFile, `Le deuxieme joueur a gagné\n`)
    }
    else{
        console.log("Incroyable!! C'est un match nul!")
        fs.appendFileSync(logFile, `C'est un match nul\n`)
    }

}

function gameLoop(){
    let gameRunning = true;
    let tour = 0;
    let premierTour = true
    let mainJoueur1 = piocherLettres(6,lettresDisponibles);
    let mainJoueur2 = piocherLettres(6,lettresDisponibles);
    let plateauJoueur1 = [];
    let plateauJoueur2 = [];

    //Empty le fichier
    fs.truncateSync(logFile)

    console.log("Bienvenue au jeu Jarnac!");

    while (gameRunning) {
        
        //Afficher l'état du jeu actuel
        affichage(mainJoueur1,mainJoueur2,plateauJoueur1,plateauJoueur2)


        //Set up du tour et du joueur actuel
        let jouerActuel = tour%2
        let mainActuel = []
        let plateauActuel = []
        if (jouerActuel === 0){
            mainActuel = mainJoueur1
            plateauActuel = plateauJoueur1
            plateauAdversaire = plateauJoueur2
            console.log("\n====================== Tour Joueur 1 ======================")
        }
        else {
            mainActuel = mainJoueur2
            plateauActuel = plateauJoueur2
            plateauAdversaire = plateauJoueur1
            console.log("\n====================== Tour Joueur 2 ======================")
        }
        fs.appendFileSync(logFile, `=======Tour du joueur ${jouerActuel+1}=======\n`)


        //Si ce n'est pas le premier tour on a droit à Jarnac et échanger des lettres
        if (tour > 0){
            premierTour = false
        }

        if (!premierTour){

            //Ask for Jarnac
            let reponse = ""
            while(reponse !== "oui" && reponse !== "non"){
                reponse = readlineSync.question("Voulez vous Jarnac votre adversaire? (oui/non)")
            }

            //Fonction Jarnac
            if(reponse === "oui"){

                if(plateauAdversaire.length === 0){
                    console.log("Le plateau de l'adversaire est vide!")
                }
                else{
                    holdresult = jarnac(mainActuel,plateauActuel,plateauAdversaire)
                    mainActuel = holdresult.main
                    plateauActuel = holdresult.plateau
                    plateauAdversaire = holdresult.plateauadversaire
                }
            }

            //Ask for exhange de lettres
            reponse = ""
            if (mainActuel.length < 3){
                //Le joueur n'a pas assez pour l'echange
                reponse = "non"
            }
            while(reponse !== "oui" && reponse !== "non"){
                reponse = readlineSync.question("Voulez vous echanger 3 lettres? (oui/non)")
            }

            //Echange de lettres sinon piocher une lettre
            if (reponse == "oui"){
                mainActuel = echangeLettres(mainActuel)
            }
            else {
                newLetters = piocherLettres(1,lettresDisponibles)
                mainActuel = [...mainActuel,...newLetters]
                console.log(`Vous piochez une lettre, votre nouvelle main est: ${mainActuel.join(" ")}`)
            }

        }

        //Tour du joueur
        let reponse = ""
        console.log("\n")
        while(reponse !== "passer"){
            reponse = readlineSync.question("Que voulez vous faire?(jouer, transformer, passer)")

            if(reponse === "jouer"){
                holdresult = jouerMot(mainActuel,plateauActuel)
                mainActuel = holdresult.main
                plateauActuel = holdresult.plateau
            }

            else if(reponse === "transformer"){
                if (plateauActuel.length === 0){
                    console.log("Votre plateau est vide!")
                }
                else{
                    holdresult = transformerMot(mainActuel,plateauActuel)
                    mainActuel = holdresult.main
                    plateauActuel = holdresult.plateau
                }

            }

            else {
                console.log("Cette commande n'existe pas!")
            }
        }

        fs.appendFileSync(logFile, `Il a passe son tour\n`)

        //Remet les tableaux aux jouers
        if (jouerActuel === 0){
            mainJoueur1 = mainActuel
            plateauJoueur1 = plateauActuel
            plateauJoueur2 = plateauAdversaire
        }
        else {
            mainJoueur2 = mainActuel
            plateauJoueur2 = plateauActuel
            plateauJoueur1 = plateauAdversaire
        }

        //Avancer d'un tour
        tour = tour+1

        //Check la fin de la partie
        if(finPartie(plateauActuel)){
            console.log("\n======================= Fin  du jeu =======================")
            calculScore(plateauJoueur1,plateauJoueur2)
            gameRunning = false

        }

    }
}


gameLoop()