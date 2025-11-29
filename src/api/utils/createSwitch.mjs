export function createSwitch(type, name, property, optionObject = {}) {
  let res = "";
  for (const [key, value] of Object.entries(optionObject)) {
    res += `\t${key == 0 ? "default" : key}: ${value};\n`;
  }
  return `switch(FEAT_TRAINS, ${type}, ${name}, ${property}){\n${res}}\n`;
}
export function createSwitchNew(type, name, property, optionsPairs) {
  // [["0..5","test"],["6..7","mest"]]
  let res = "";
  optionsPairs.forEach((pair) => {
    res += `\t${pair[0]}: ${pair[1]};\n`;
  });
  return `switch(FEAT_TRAINS, ${type}, ${name}, ${property}){\n${res}}\n`;
}

// const test = createSwitch("SELF", "test", "yes>5", { 1: "one", 2: "two", default: "cool" });
// console.log(test);
