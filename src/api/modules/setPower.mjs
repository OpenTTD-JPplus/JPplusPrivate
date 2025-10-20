// "introYear": 11,
// "powerPerMotor": 11,
// "headMotorCars": 11,
// "blockLength": 11,
// "positions": [11, 11],
// "liveryUsageIds": [11, 11]

import { createSwitch } from "../utils/createSwitch.mjs";

function setPowerVariant(data) {
  let str = "";
  const { trainName, introYear, headMotorCars, powerPerMotor, blockLength, positions, switchCounter, totalVariations } = data;

  const positionData = { default: 0 };

  for (const i in positions) {
    positionData[positions[i]] = powerPerMotor;
  }

  //handle default logic
  // if (!introYear) {
  //handle head power
  if (headMotorCars === 1) {
    str += createSwitch(
      "SELF",
      `sw_${trainName}_head_power${totalVariations == 1 ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
      `position_in_consist+1}`,
      { default: 0, 1: powerPerMotor }
    );
  }
  //handle car power

  str += createSwitch(
    "SELF",
    `sw_${trainName}_car_power${totalVariations == 1 ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
    `position_in_vehid_chain%${blockLength}-2`,
    positionData
  );
  // }

  let headPowerString = "";

  if (headMotorCars == 0) headPowerString = "0";
  if (headMotorCars === 1) headPowerString = `sw_${trainName}_head_power_main`;
  if (headMotorCars === 2) headPowerString = powerPerMotor;

  str += createSwitch(
    "SELF",
    `sw_${trainName}_power${totalVariations == 1 ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
    `vehicle_type_id == ${trainName}`,
    {
      1: headPowerString,
      default: `sw_${trainName}_car_power${totalVariations == 1 ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`}`,
    }
  );
  return str;
}

export function setPowerMain({ trainName, data }) {
  const totalVariations = data.length || 0;
  if (totalVariations > 1 && !data[0].introYear) throw new Error("Can't use 2 power variants without year data");

  let res = "";
  let dateArray = [];
  let switchCounter = 1;

  data.forEach((variation) => {
    res += setPowerVariant(Object.assign({ trainName, switchCounter, totalVariations }, variation));
    switchCounter++;
    if (variation.introYear) dateArray.push(variation.introYear);
  });

  const positionData = {};
  for (const i in dateArray) {
    positionData[dateArray[i]] = `sw_${trainName}_power_${i * 1 + 1}`;
  }
  if (dateArray.length > 1) {
    res += createSwitch("SELF", `sw_${trainName}_power_main`, "build_year", positionData);
  }
  console.log(res);
  return res;
}
setPowerMain({
  trainName: "test",
  data: [
    { introYear: "0..2005", headMotorCars: 0, powerPerMotor: 150, blockLength: 6, positions: [2, 5, 6] },
    { introYear: "2006..2020", headMotorCars: 0, powerPerMotor: 190, blockLength: 6, positions: [2, 4, 5, 6] },
    { introYear: "default", headMotorCars: 1, powerPerMotor: 250, blockLength: 7, positions: [5, 6] },
  ],
});
