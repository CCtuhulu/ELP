# ELP

## Projet Go: Filtre détection de contours
On load une image et on la transforme en noir et blanc puis en tableau 2d. On convolue ec tableau grâce aux filtres de Sobel et on retransforme le resultat en image.
Pour la configuration serveur/client, le client envoie l'image au serveur et attend en reponse l'image traité puis la sauvegarde dans un fichier. Le serveur lui attend les connexions et traite les images recues avant de les renvoyer.
Plus d'explications dans le fichier Go.
