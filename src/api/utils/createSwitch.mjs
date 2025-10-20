export function createSwitch(type, name, property, optionObject = {}) {
  let res = "";
  for (const [key, value] of Object.entries(optionObject)) {
    res += `\t${key == 0 ? "default" : key}: ${value};\n`;
  }
  return `switch(FEAT_TRAINS, ${type}, ${name}, ${property}){\n${res}}\n`;
}

// const test = createSwitch("SELF", "test", "yes>5", { 1: "one", 2: "two", default: "cool" });
// console.log(test);
