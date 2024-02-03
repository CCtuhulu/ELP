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
        
    }
    return player;
}

module.exports = { create_player };
