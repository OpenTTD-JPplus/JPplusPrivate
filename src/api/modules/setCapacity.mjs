export function setCapacity(trainName, arr) {
  let str = "";
  arr.forEach(
    (option, index) =>
      (str += `switch(FEAT_TRAINS, SELF, sw_${trainName}_capacity${
        arr.length > 1 ? index + 1 : "_main"
      },vehicle_type_id){\n100..102: ${option[1]};\n${option[0]};\n}\n`)
  );

  return str;
}
