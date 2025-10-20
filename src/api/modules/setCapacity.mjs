import { createSwitch } from "../utils/createSwitch.mjs";

function setCapacityVariant(trainName, data, totalVariations, switchCounter) {
  let str = "";

  const suffix = `${
    totalVariations == 1 ? "_main" : `${switchCounter ? `_${switchCounter}` : ""}`
  }`;

  //handle head capacity
  if (data.headCapacityArr.length > 1) {
    str += createSwitch(
      "SELF",
      `sw_${trainName}_head_capacity${suffix}`,
      `position_in_consist+1}`,
      { default: data.headCapacityArr[1], 1: data.headCapacityArr[0] }
    );
  }

  //handle car capacity
  if (data.wagCapacityArr.length > 1) {
    if (!data.wagCapacityReverseArr) {
      const capacityData = {};
      for (const i in data.wagCapacityArr) {
        capacityData[i] = data.wagCapacityArr[i];
      }

      str += createSwitch(
        "SELF",
        `sw_${trainName}_car_capacity${suffix}`,
        `position_in_vehid_chain%${data.blockLength}-2`,
        capacityData
      );
    }
  }

  //handle double trouble
  if (data.wagCapacityReverseArr) {
    const capacityData = { default: `sw_${trainName}_car_capacity${suffix}_rev` };
    const capacityDataRev = {};
    for (const i in data.wagCapacityArr) {
      if (i > 0) capacityData[i] = data.wagCapacityArr[i];
    }
    for (const i in data.wagCapacityReverseArr) {
      capacityDataRev[i] = data.wagCapacityReverseArr[i];
    }

    str += createSwitch(
      "SELF",
      `sw_${trainName}_car_capacity${suffix}_rev`,
      `position_in_vehid_chain_from_end%${data.blockLength}`,
      capacityDataRev
    );
    str += createSwitch(
      "SELF",
      `sw_${trainName}_car_capacity${suffix}`,
      `position_in_vehid_chain%${data.blockLength}`,
      capacityData
    );
  }

  //handle main
  str += createSwitch(
    "SELF",
    `sw_${trainName}_capacity${suffix}`,
    `vehicle_type_id == ${trainName}`,
    {
      1: `${
        data.headCapacityArr.length > 1
          ? `sw_${trainName}_head_capacity${suffix}`
          : data.headCapacityArr[0]
      }`,
      default: `${
        data.headCapacityArr.length > 1
          ? `sw_${trainName}_car_capacity${suffix}`
          : data.wagCapacityArr[0]
      }`,
    }
  );
  return str;
}

export function setCapacityMain(trainName, data) {
  const totalVariations = data.length;
  let res = "";
  let switchCounter = 1;
  let dateArray = [];

  //create variants
  data.forEach((props) => {
    res += setCapacityVariant(trainName, props, totalVariations, switchCounter);
    switchCounter++;
    if (props.introYear) dateArray.push(props.introYear);
  });
  //handle modernizations
  if (dateArray.length > 0) {
    const positionData = {};
    for (const i in dateArray) {
      positionData[dateArray[i]] = `sw_${trainName}_capacity_${i * 1 + 1}`;
    }

    res += createSwitch(
      "SELF",
      `sw_${trainName}_capacity_main${data.liveryUsageIds ? "_timed" : ""}`,
      "build_year",
      positionData
    );
  }

  console.log(res);
  return res;
}

setCapacityMain("Rin", [
  {
    introYear: "0..1999",
    headCapacityArr: [150, 151],
    wagCapacityArr: [160, 162, 163],
    wagCapacityReverseArr: [160, 162, 163],
    blockLength: 5,
    liveryUsageIds: 0,
    switchCounter: 0,
    totalVariations: 0,
  },
  {
    introYear: "default",
    headCapacityArr: [150],
    wagCapacityArr: [160],
    blockLength: 5,
    liveryUsageIds: 0,
    switchCounter: 0,
    totalVariations: 0,
  },
]);
