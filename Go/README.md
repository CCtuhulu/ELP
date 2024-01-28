# Fichiers Explications

LocalFilterNotGoroutined.go: A ne pas ouvrir sous peine de dégâts irréversibles au cerveau, je l'ai mis ici juste pour faire les comparaisons de vitesses de traitements des images et j'avais la flemme de maintenir le code.
LocalFilterGoroutined.go: Traitement d'image en local avec goroutines, toutes les fonctions sont TRES bien commentées.

serveur.go: le code de LocalFilterGoroutined.go est séparé entre ce fichier et client.go avec l'ajout du handleClient
client.go: Code client qu'il faut exécuter après celui du serveur

# Comment faire fonctionner?

Les librairies utilisées font parties des librairies standards de Go et ne nécessitent donc pas d'installation à part normalement.
go build <nomdufichier> -> crée un fichier .exe à éxecuter
./<nomdufichier.exe> <nom_d'une_image du fichier_Images_Folder_sans son extensions> -> compile le code et le lance
Attention: le serveur ne nécessite pas d'arguments

Si l'utilisateur souhaite de traiter ses propres images, il doit les mettre dans le "Images Folder". Toutes les images après traitement doivent se trouver dans le fichier "Edge Filtered Images'.
