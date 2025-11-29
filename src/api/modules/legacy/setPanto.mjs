import { createSwitch } from "../../utils/createSwitch.mjs";

//   return str;
// }
function pantoVariant(spriteName, customMotGfx, customWagGfx, obj, isReverse) {
  let testObj = {};
  const entries = Object.entries(obj);
  testObj = entries.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[0].split("_")[0] * 1 + 1]:
        cur[0].includes("_REV") && isReverse
          ? `${customMotGfx ? "sw" : "gfx"}_${spriteName}_${cur[1]}_rev`
          : `${customMotGfx ? "sw" : "gfx"}_${spriteName}_${cur[1]}`,
    }),
    {}
  );
  testObj.default = `${customWagGfx ? "sw" : "gfx"}_${spriteName}_wag`;
  return testObj;
}

export function setPanto(data) {
  let res = "";
  let dateArray = [];
  const variations = data.panto.variations;
  variations.forEach((vars) => {
    if (vars.introYear) dateArray.push(vars.introYear);
    vars.placement.forEach((PantoPlacement, i) => {
      res += createSwitch(
        "SELF",
        `sw_${data.spriteName}_pantoPlacer_${i + 1}_def`,
        `position_in_vehid_chain %${PantoPlacement.length} + 1`,
        pantoVariant(
          data.spriteName,
          data.customMotGfx || false,
          data.customWagGfx || false,
          PantoPlacement.positions,
          false
        )
      );
      res += createSwitch(
        "SELF",
        `sw_${data.spriteName}_pantoPlacer_${i + 1}_rev`,
        `position_in_vehid_chain_from_end %${PantoPlacement.length} + 1`,
        pantoVariant(
          data.spriteName,
          data.customMotGfx || false,
          data.customWagGfx || false,
          PantoPlacement.positions,
          false
        )
      );
      res += createSwitch(
        "PARENT",
        `sw_${data.spriteName}_pantoPlacer_${i + 1}_main`,
        `vehicle_is_reversed`,
        {
          0: `sw_${data.spriteName}_pantoPlacer_${i + 1}_def`,
          1: `sw_${data.spriteName}_pantoPlacer_${i + 1}_rev`,
        }
      );
    });
  });

  const positionData = {};
  for (const i in dateArray) {
    positionData[dateArray[i]] = `sw_${data.spriteName}_pantoPlacer_${i * 1 + 1}_main`;
  }
  if (dateArray.length > 1) {
    res += createSwitch(
      "SELF",
      `sw_${data.spriteName}_pantoPlacer_main`,
      "build_year",
      positionData
    );
  }
  console.log(res);
  return res;
}

// setPanto({
//   trainName: "Rin",
//   spriteName: "Len",
//   panto: {
//     variations: [
//       {
//         introYear: "0..1994",
//         placement: [
//           { length: 5, positions: { "0_REV": "mot", "2_REV": "mot" } },
//           { length: 3, positions: { 0: "mot" } },
//         ],
//         main: {
//           0: 0,
//           2: 1,
//           5: 1,
//         },
//       },
//       {
//         introYear: "default",
//         placement: [
//           { length: 5, positions: { "0_REV": "mot", "2_REV": "mot" } },
//           { length: 3, positions: { 0: "mot" } },
//         ],
//         main: {
//           0: 0,
//           2: "0|1", //TODO If | is detected -> create random switch
//           5: 1,
//         },
//       },
//     ],
//   },
// });
