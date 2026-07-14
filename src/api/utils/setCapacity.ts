import { createSwitchNew } from "./createSwitch";

function symetricalCapacity(
  train: string,
  headCapacity: Array<number | string>,
  carCapacity: Array<Array<number | string>>,
  carCapacity_rev: Array<Array<number | string>>,
  length: number,
) {
  let res = "";
  const capacityRevPairs = carCapacity_rev.map((pair) => [pair[0], pair[1]]);
  capacityRevPairs[capacityRevPairs.length - 1][1] = `sw_${train}_car_capacity_def`;

  res += createSwitchNew(
    "SELF",
    `sw_${train}_car_capacity_def`,
    `position_in_vehid_chain % ${length}`,
    carCapacity.map((pair) => [pair[0], pair[1]]),
  );
  res += createSwitchNew(
    "SELF",
    `sw_${train}_car_capacity_rev`,
    `position_in_vehid_chain_from_end % ${length}`,
    capacityRevPairs.map((pair) => [pair[0], pair[1]]),
  );
  res += createSwitchNew("SELF", `sw_${train}_capacity_main`, `vehicle_type_id`, [
    [train, headCapacity[0]],
    ["default", `sw_${train}_car_capacity_def`],
  ]);
  return res;
}

export function setCapacity(
  train: string,
  carCapacity: Array<Array<number | string>> | Array<number | string>,
  headCapacity?: Array<number | string>,
  carCapacity_rev?: Array<Array<number | string>>,
  length?: number,
) {
  //handle single capacity
  if (!carCapacity_rev) {
    const capacity = carCapacity as Array<number | string>;
    return createSwitchNew("SELF", `sw_${train}_capacity_main`, "vehicle_type_id", [
      [train, capacity[0]],
      ["default", capacity[1]],
    ]);
  }

  return symetricalCapacity(
    train,
    headCapacity!,
    carCapacity as Array<Array<number | string>>,
    carCapacity_rev || [],
    length || 2,
  );
}

const testObject = {
  headCapacity: [140, 141],
  carCapacity: [
    [0, 159],
    ["default", 158],
  ],
  carCapacity_rev: [
    [0, 159],
    ["default", 158],
  ],
};

console.log(
  setCapacity(
    "twr71000",
    testObject.carCapacity,
    testObject.headCapacity,
    testObject.carCapacity_rev,
    4,
  ),
);

// const testObject2 = {
//   carCapacity: [140, 158],
// };

// console.log(setCapacity("twr71000", testObject2.carCapacity));
