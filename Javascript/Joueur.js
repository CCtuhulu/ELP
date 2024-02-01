// joueur.js

const readline = require('readline');

function create_player(pid) {
    const player = {
        id: String(pid),
        carpet: [], // contient des mots
        letters: [], // contient des caractères
        disp_carpet: function () {
            let res = "      9  16 25 36 49 64 81\n";
            for (let word of this.carpet) {
                for (let letter of word) {
                    res += letter + "  ";
                }
                res += "\n";
            }
            console.log(res);
        },
        disp_letters: function () {
            let res = "Voici vos lettres à disposition : ";
            for (let letter of this.letters) {
                res += letter + " ";
            }
            console.log(res);
        },
        enter_word: function () {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            return new Promise(resolve => {
                rl.question("Entrez votre mot : ", (word) => {
                    rl.close();
                    resolve(word.toUpperCase());
                });
            });
        }
    };

    return player;
}

module.exports = { create_player };

