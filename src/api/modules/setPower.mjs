export function setPower(trainNameMain, dataArr) {
  let str = "";
  dataArr.forEach((block, i) => {
    const trainName = `${dataArr.length > 1 ? trainNameMain + (i + 1) : trainNameMain}`;
    //handle trailer power
    str += `switch(FEAT_TRAINS, SELF, sw_${trainName}_power_wag,position_in_vehid_chain %${block.repLength}){\n`;
    block.powerArr.forEach((car) => {
      str += `${car}:${block.motorPower};\n`;
    });
    str += `0;\n}\n`;
    //handle cab power
    str += `switch(FEAT_TRAINS, SELF, sw_${trainName}_`;
    if (block.headMotorCars) {
      str += `power_main,vehicle_type_id==${trainNameMain}){\n` + `1:${block.motorPower * block.headMotorCars};\nsw_${trainName}_power_wag;\n}\n`;
    } else {
      str += `power_main,vehicle_type_id){\n100..102:sw_${trainName}_power_wag;\nreturn 0;\n}\n`;
    }
  });

  return str;
}
export function handleCustomPower(trainName, switchTypes) {}
