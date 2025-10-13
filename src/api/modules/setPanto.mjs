function pantoVariant(trainName, spriteName, customMotGfx, object, isReversed = false) {
  let str = "";
  object.forEach((el) => {
    if (el[0].includes("REV") && isReversed) {
      str = str + `${el[0].split("_")[0]}:${customMotGfx ? "sw" : "gfx"}_${spriteName}_${el[1]}${isReversed ? "_rev" : ""};\n`;
    } else {
      str = str + `${el[0].split("_")[0]}:${customMotGfx ? "sw" : "gfx"}_${spriteName}_${el[1]};\n`;
    }
  });
  return str;
}

function pantoMain(trainName, positions) {
  let str = `switch(FEAT_TRAINS, SELF, sw_${trainName}_panto_placer_main, num_vehs_in_vehid_chain + 2){\n`;
  Object.entries(positions).forEach((position) => (str += `${position[0] == 0 ? "default" : position[0]}:sw_${trainName}_panto_placer_${position[1]}_main;\n`));
  str += "}\n";
  return str;
}
export function setPanto(trainName, spriteName, data) {
  const customWagGfx = data.customLogic?.customWagLogic || false;
  const customMotGfx = data.customLogic?.customMotorLogic || false;

  let res = "";

  const pantoPlacerString = `switch(FEAT_TRAINS, SELF, sw_${trainName}_panto_placer_`;
  const totalVariants = data.panto.placement.length;

  data.panto.placement.forEach(
    (option, i) =>
      (res =
        res +
        // Regular handler
        `${pantoPlacerString}${i},position_in_vehid_chain %${option.length}){\n` +
        `${pantoVariant(trainName, spriteName, customMotGfx, Object.entries(option.positions))}` +
        `${customWagGfx ? "sw_" : "gfx_"}${spriteName}_wag;\n}\n` +
        // Reversed handler
        `${pantoPlacerString}${i}_rev,position_in_vehid_chain_from_end %${option.length}){\n` +
        `${pantoVariant(trainName, spriteName, customMotGfx, Object.entries(option.positions), true)}` +
        `${customWagGfx ? "sw_" : "gfx_"}${spriteName}_wag;\n}\n` +
        //Controller Handler
        `switch(FEAT_TRAINS, PARENT, sw_${trainName}_panto_placer${
          totalVariants > 1 ? `_${i}` : ""
        }_main,vehicle_is_reversed){\n1: sw_${trainName}_panto_placer_${i}_rev;\nsw_${trainName}_panto_placer_${i};\n}\n`)
  );
  if (data.panto.customPantoPlacer) {
    res += data.panto.customPantoPlacer + "\n";
  }
  if (totalVariants > 1) {
    res += pantoMain(trainName, data.panto.main);
  }
  return res;
}
