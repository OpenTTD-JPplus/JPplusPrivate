import { createSwitchNew } from "./createSwitch";

// const testObject = {
//   variations: [
//     {
//       length: 5,
//       usedLength: [1, 4, 7],
//       options: [
//         ["0", "mot_gfx"],
//         ["3", "mot_2_gfx"],
//         ["7", "mot_2_gfx"],
//         ["default", "wag_gfx"],
//       ],
//     },
//     {
//       length: 8,
//       usedLength: [0],
//       options: [
//         ["1", "mot_gfx"],
//         ["4", "mot_2_gfx"],
//         ["5", "mot_2_gfx"],
//         ["default", "wag_gfx"],
//       ],
//     },
//   ],
// };

const createFormation = (variations: Array<any>, trainName: string) => {
  let formationString: string = "";

  variations.forEach((variation, i) => {
    const res = createSwitchNew(
      "SELF",
      `sw_${trainName}_panto_placer${variation.length == 1 ? "" : `_${i + 1}`}`,
      `position_in_vehid_chain % ${variation.length}`,
      variation.options,
    );
    formationString += res;
  });

  if (variations.length > 1) {
    const placerArr: Array<[number | string, number | string]> = [];
    variations.forEach((variation, formationId) => {
      variation.usedLength.forEach((usedLength: number) => {
        placerArr.push([
          usedLength === 0 ? "default" : usedLength,
          `sw_${trainName}_panto_placer_${formationId + 1}`,
        ]);
      });
    });
    formationString += createSwitchNew(
      "SELF",
      `sw_${trainName}_panto_placer`,
      "num_vehs_in_vehid_chain",
      placerArr,
    );
  }

  return formationString;
};

export { createFormation };

// console.log(createFormation(testObject.variations, "tokyu5050"));
