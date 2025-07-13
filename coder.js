const fs = require("fs");

function pantoPlacer(name, pantoArray, isReversed) {
    let string = "";

    for (let i = 0; i < pantoArray.length; i++) {
        //strings template
        const switchString = `switch(FEAT_TRAINS, SELF, sw_${name}_panto_placer_${
            i + 1
        },position_in_vehid_chain %${
            pantoArray[i][pantoArray[i].length - 1]
        }){\n`;
        const switchStringRev = `switch(FEAT_TRAINS, SELF, sw_${name}_panto_placer_${
            i + 1
        }_rev,position_in_vehid_chain_from_end %${
            pantoArray[i][pantoArray[i].length - 1]
        }){\n`;

        //panto logic
        string += `${isReversed ? switchStringRev : switchString}`;
        for (let j = 0; j < pantoArray[i].length - 1; j++) {
            if (j < pantoArray[i].length - 2) {
                const temp = pantoArray[i][j].split(" ");
                string += `\t${temp[0]}${name}_${temp[1]};\n`;
            }
        }
        string += `\t${name}_${pantoArray[i][pantoArray[i].length - 2]};\n\}\n`;
    }
    return string;
}

const test = [
    ["1:sw_ mot_gfx", "2: mot_rev", "3: mot_2", "4: mot", "5: mot", "wag", 7],
    // ["6: mot_rev", "7: mot_rev", "wag", 9],
];
const test2 = [
    ["1:sw_ mot_gfx", "2: mot_rev", "3: mot_2", "4: mot", "5: mot", "wag", 7],
    // ["6: mot_rev", "7: mot_rev", 9],
];
const testName = "tk_as_toei5000";

const file = pantoPlacer(testName, test, 0) + pantoPlacer(testName, test, 1);
// console.log(file);
fs.writeFileSync("test.pnml", file);
// pantoPlacer(testName, test2, 1);
