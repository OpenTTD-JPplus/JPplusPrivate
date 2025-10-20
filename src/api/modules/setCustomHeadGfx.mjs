import { createSwitch } from "../utils/createSwitch.mjs";

function setHeadGfx(dataArr) {
  const { trainName, totalVariations, introYear, modernizationYear, spriteArray, switchCounter } = dataArr || null;
  //error handling
  if (introYear && modernizationYear) throw new Error("Intro and Modernization params can't be used at the same block!");

  const direction = spriteArray[0].includes("front") ? "front" : "end";
  let str = "";

  //handle default logic
  if (!spriteArray) return `gfx_${trainName}_${direction}`;

  //handle modernization
  if (modernizationYear) {
    str += createSwitch(
      "SELF",
      `sw_${trainName}_${direction}${totalVariations == 1 || totalVariations === switchCounter ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
      `${modernizationYear ? `current_year<${modernizationYear}` : ""}`,
      spriteArray
    );
  }

  //handle buildDate
  if (introYear) {
    str += createSwitch(
      "SELF",
      `sw_${trainName}_${direction}${totalVariations == 1 || totalVariations === switchCounter ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
      `${introYear ? `build_year<${introYear}` : ""}`,
      spriteArray
    );
  }
  return str;
}

export function setFrontEndGfx(data) {
  const trainName = data.trainName;
  let res = "";

  if (data.customFrontGfx) {
    let totalVariations = data.customFrontGfx.length || 0;
    let switchCounter = 1;
    data.customFrontGfx.forEach((variation) => {
      res += setHeadGfx(Object.assign({ trainName, switchCounter, totalVariations }, variation));
      switchCounter++;
    });
  }
  if (data.customEndGfx) {
    let totalVariations = data.customEndGfx.length || 0;
    let switchCounter = 1;
    data.customEndGfx.forEach((variation) => {
      res += setHeadGfx(Object.assign({ trainName, switchCounter, totalVariations }, variation));
      switchCounter++;
    });
  }
  console.log(res);
  return res;
}

setFrontEndGfx({
  trainName: "test",
  customFrontGfx: [{ introYear: 2007, spriteArray: ["test_front_1", "sw_test_front_ac"] }],
  customEndGfx: [
    { introYear: 2007, spriteArray: ["test_end_1", "sw_test_end_ac"] },
    { introYear: 2007, spriteArray: ["sw_test_end_1", "sw_test_end_4"] },
  ],
});
