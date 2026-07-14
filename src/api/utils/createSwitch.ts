export function createSwitchNew(
  type: string,
  name: string,
  property: string,
  optionsPairs: Array<[number | string, number | string]>,
) {
  // [["0..5","test"],["6..7","mest"]]
  let res = "";
  optionsPairs.forEach((pair) => {
    res += `\t${pair[0]}: ${pair[1]};\n`;
  });
  return `switch(FEAT_TRAINS, ${type}, ${name}, ${property}){\n${res}}\n`;
}


