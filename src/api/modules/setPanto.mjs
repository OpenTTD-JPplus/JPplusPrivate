function pantoVariant(trainName, object, isReversed = false) {
  let str = "";
  object.forEach((el) => {
    if (el[0].includes("REV") && isReversed) {
      str = str + `${el[0].split("_")[0]}:gfx_${trainName}_${el[1]}${isReversed ? "_rev" : ""};\n`;
    } else {
      str = str + `${el[0].split("_")[0]}:gfx_${trainName}_${el[1]};\n`;
    }
  });
  return str;
}

function pantoMain(trainName, positions) {
  let str = `switch(FEAT_TRAINS, SELF, sw_${trainName}_panto_placer_main, num_vehs_in_vehid_chain){\n`;
  Object.entries(positions).forEach((position) => (str += `${position[0] == 0 ? "default" : position[0]}:sw_${trainName}_panto_placer_${position[1]}_main;\n`));
  str += "}\n";
  return str;
}
export function setPanto(trainName, data, customWagGfx = false) {
  let res = "";

  // if (!data.placement) {
  //   //use index 0
  // }

  const pantoPlacerString = `switch(FEAT_TRAINS, SELF, sw_${trainName}_panto_placer_`;
  data.placement.forEach(
    (option, i) =>
      (res =
        res +
        // Regular handler
        `${pantoPlacerString}${i},position_in_vehid_chain %${option.length}){\n` +
        `${pantoVariant(trainName, Object.entries(option.positions))}` +
        `${customWagGfx ? "sw_" : "gfx_"}${trainName}_wag;\n}\n` +
        // Reversed handler
        `${pantoPlacerString}${i}_rev,position_in_vehid_chain_from_end %${option.length}){\n` +
        `${pantoVariant(trainName, Object.entries(option.positions), true)}` +
        `${customWagGfx ? "sw_" : "gfx_"}${trainName}_wag;\n}\n` +
        //Controller Handler
        `switch(FEAT_TRAINS, PARENT, sw_${trainName}_panto_placer_${i}_main,vehicle_is_reversed){\n1: sw_${trainName}_panto_placer_${i}_rev;\nsw_${trainName}_panto_placer_${i};\n}\n`)
  );
  res = res + pantoMain(trainName, data.main);
  return res;
}
