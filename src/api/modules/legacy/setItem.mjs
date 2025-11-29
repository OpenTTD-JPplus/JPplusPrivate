function formatCurrentString(string) {
  const str = string.split("_");

  return `${str[0]},${str[1]},${str[2]}`;
}

function formatDescString(dataObj) {
  return `string(STR_TRAIN_DESC,
    string(STR_${dataObj.trackGauge}),
    string(STR_DENKI, string(STR_)),//TODO with createConcat 
    string(STR_LOAD_SPEED, string(STR_DOORS, ${dataObj.doors})),//TODO with createConcat 
    string(STR_FORMATION, string(STR_NUM_CARS_${dataObj.formations.length}, ${dataObj.formations})),
    string(STR_USAGE, string(STR_${dataObj.usage.toUpperCase()})),
    string(STR_OPERATOR, string(STR_${dataObj.operator.toUpperCase()})));`;
}

export function setItem(dataObj) {
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
    liveries,
    formations,
    capacity,
    doors,
    current,
    power,
    variantGroup,
    dualHeaded = 1,
  } = dataObj;

  const currentStringArr = formatCurrentString(current);

  return `
${dataObj.options?.variantHeader ? dataObj.options.variantHeader : ""}

item(FEAT_TRAINS, ${trainName}) {
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
    track_type: TR_${trackGauge}_${current
    .forEach((type) => {
      type.split("_")[0];
    })
    .join("_")};//TODO as a function
    power: 1 kW;
    weight: ${weight[0]} ton;
  }
	graphics {
    additional_text:${formatDescString(dataObj, currentStringArr)}
    ${liveries.length > 1 ? `cargo_subtype_text:sw_${trainName}_lv_desc_main;` : ""}
    purchase: gfx_${trainName}_purchase_main;
    // can_attach_wagon: sw_${trackGauge}_attach_vehid;
    ${formations[0] > 2 ? "start_stop: sw_stop_start_3;" : ""}
    cargo_capacity: sw_${trainName}_capacity_head_main()*param_capacity_mod/3;
    loading_speed:${doors.length > 1 ? doors : `sw_${trainName}_loading_speed_main`};
    default:sw_${trainName}_lv;
    power: sw_${trainName}_power_main()*4*1342/1000;
    purchase_power:${power}*4*1342/1000;
  }
  livery_override(mu_car){
		cargo_subtype_text:${liveries.length > 1 ? `cargo_subtype_text:sw_${trainName}_lv_desc_main;` : ""};
    loading_speed:${doors.length > 1 ? doors : `sw_${trainName}_loading_speed_main`};
    cargo_capacity: sw_${trainName}_capacity_wag_main()*param_capacity_mod/3${
    capacity[0].headCapacity < 50 ? "*boost_rapid_mod/2" : ""
  };
    power: sw_${trainName}_power_main()*4*1342/1000;
    default:sw_${trainName}_lv;
    weight: ${weight[1]};
  }
}`;
}
