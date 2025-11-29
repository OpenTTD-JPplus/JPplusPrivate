import { setPowerMain } from "../modules/setPower.mjs";
import { setCapacityMain } from "../modules/setCapacity.mjs";

function formatCurrentString(string) {
  let res = "";
  switch (string) {
    case "DC_1500":
      res = "string(STR_DC, 1500)";
      break;
    case "AC_20000_50hz":
      res = "string(STR_AC, 20, 50)";
      break;
    case "AC_20000_60hz":
      res = "string(STR_AC, 20, 60)";
      break;
    case "AC_250000":
      res = "string(STR_AC, 25, 50)";
      break;
    case "AC_20_50hz_DC":
      res = "string(STR_ACDC, 20, 50, 1500)";
      break;
    case "AC_20_60hz_DC":
      res = "string(STR_ACDC, 20, 60, 1500)";
      break;
    case "AC_25_50hz_DC":
      res = "string(STR_ACDC, 25, 60, 1500)";
      break;
    default:
      res = "string(STR_DC, 1500)";
      break;
  }
  return res;
}
function formatTrackType(string) {
  let res = "";
  switch (string) {
    case "DC_1500":
      res = "DC";
      break;
    case "AC_20000_50hz":
      res = "AC";
      break;
    case "AC_20000_60hz":
      res = "AC";
      break;
    case "AC_250000":
      res = "AC";
      break;
    case "AC_20_50hz_DC":
      res = "ACDC";
      break;
    case "AC_20_60hz_DC":
      res = "ACDC";
      break;
    case "AC_25_50hz_DC":
      res = "ACDC";
      break;
    default:
      res = "ACDC";
      break;
  }
  return res;
}

function formatDescString(data, usage, operator) {
  return `string(STR_TRAIN_DESC,
    string(STR_${data.trackGauge}),
    string(STR_DENKI, ${formatCurrentString(data.current)}),
    string(STR_LOAD_SPEED, ${
      data.doors.length > 1
        ? `string(STR_DOORS_REFIT, ${data.doors[0]},${data.doors[1]}`
        : `string(STR_DOORS, ${data.doors}`
    })),
    string(STR_FORMATION, string(STR_NUM_CARS_${
      data.formations.length
    }, ${data.formations.toString()})),
    string(STR_USAGE, ${
      data.usage.length > 1 ? `string(STR_CONCAT_${data.usage.length}_OR, ${usage})` : `${usage}`
    }),
    string(STR_OPERATOR, ${
      data.operator.length > 1
        ? `string(STR_CONCAT_${data.usage.length}, ${operator})`
        : `${operator}`
    }));`;
}

export function setItem(data) {
  let str = "";
  // str += setPowerMain({ trainName: data.trainName, data: data.power });
  // str += setCapacityMain(data.trainName, data.capacity);

  const {
    descName,
    trainName,
    groupType,
    introductionDate,
    scrapYear,
    costFactor,
    runningCost,
    speed,
    trackGauge,
    weight,
    formations,
    capacity,
    doors,
    current,
    power,
    variantGroup,
    dualHeaded = 1,
  } = data;
  const usage = data.usage.map((el) => `string(STR_${el.toUpperCase()})`).toString();
  const operator = data.operator.map((el) => `string(STR_${el.toUpperCase()})`).toString();

  str += `item(FEAT_TRAINS, ${trainName}) {
  property {
    OVERRIDEN_TRAIN_DATA
    
    climates_available: param_disable_${groupType} == 0 ? ALL_CLIMATES : NO_CLIMATE;
    name: ${descName};
    introduction_date: date(${introductionDate});
    model_life: ${
      scrapYear == 0 ? "VEHICLE_NEVER_EXPIRES" : scrapYear - introductionDate.split(",")[0] + 5
    };
    vehicle_life: ${scrapYear == 0 ? "30" : scrapYear - introductionDate.split(",")[0]};
    dual_headed: ${dualHeaded};
    ${variantGroup ? `variant_group: ${variantGroup};` : ""}
    
    cost_factor: ${costFactor};
    running_cost_factor: ${runningCost};
    speed: ${speed} km/h;
    track_type: TR_${trackGauge}_${formatTrackType(current)};
    power: 1 kW;
    tractive_effort_coefficient:  0.2;
    weight: ${weight[0]} ton;
  }
	graphics {
    ${data.isVariantGroupParent ? `name: sw_${trainName}_name;` : ""}
    ${data.variantGroup ? `name: sw_${variantGroup}_name;` : ""}
    additional_text:${formatDescString(data, usage, operator)}
    ${data.hasLiveryDesc ? `cargo_subtype_text: sw_${trainName}_lv_desc_main;` : ""}
    purchase: gfx_${trainName}_purchase_main;
    cargo_capacity: sw_${trainName}_capacity_main()*param_capacity_mod/3;
    loading_speed:${
      doors.length <= 1 ? `param_loading_${doors}D` : `sw_${trainName}_loading_speed_main`
    };
    default:sw_${trainName}_lv;
    power: sw_${data.reusePowerFrom ? data.reusePowerFrom : trainName}_power_main()*4*1342/1000;
    purchase_power: sw_${
      data.reusePowerFrom ? data.reusePowerFrom : trainName
    }_car_power_main()*4*1342/1000;
  }
  livery_override(mu_car){
		cargo_subtype_text:${data.hasLiveryDesc ? `sw_${trainName}_lv_desc_main` : "sw_empty_desc"};
    loading_speed:${
      doors.length <= 1 ? `param_loading_${doors}D` : `sw_${trainName}_loading_speed_main`
    };
    cargo_capacity: sw_${trainName}_capacity_main()*param_capacity_mod/3${
    capacity && "*boost_rapid_mod/2"
  };
    power: sw_${data.reusePowerFrom ? data.reusePowerFrom : trainName}_power_main()*4*1342/1000;
    default:sw_${trainName}_lv;
    weight: ${weight[1]};
    ${data.length ? `length: ${data.length}` : ""}
  }
}`;
  return str;
}
