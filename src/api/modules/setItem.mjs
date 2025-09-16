function formatCurrentString(string) {
  const split = string.split("_");
  if (string.includes("ACDC")) {
    return `${split[0]},${split[1]},${split[2]},${split[3]}`;
  }
  if (string.includes("DC")) {
    return `${split[0]},${split[1]}`;
  }
  return `${split[0]},${split[1]},${split[2]}`;
}

function formatDescString(dataObj) {
  return `string(STR_TRAIN_DESC,
    string(STR_${dataObj.trackGauge}),
    string(STR_DENKI, string(STR_${formatCurrentString(dataObj.current)})),
    string(STR_LOAD_SPEED, string(STR_DOORS, ${dataObj.doors})),
    string(STR_FORMATION, string(STR_NUM_CARS_${dataObj.formations.length}, ${dataObj.formations})),
    string(STR_USAGE, string(STR_${dataObj.usage.toUpperCase()})),
    string(STR_OPERATOR, string(STR_${dataObj.operator})));`;
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
    dualHeaded = 1,
  } = dataObj;

  const currentStringArr = formatCurrentString(current);

  return `
item(FEAT_TRAINS, ${trainName}) {
  property {
    OVERRIDEN_TRAIN_DATA
    
    climates_available: param_disable_${groupType} == 0 ? ALL_CLIMATES : NO_CLIMATE;
    name: ${descName};
    introduction_date: date(${introductionDate});
    model_life: ${scrapYear == 0 ? "VEHICLE_NEVER_EXPIRES" : introductionDate.split(",")[0] - scrapYear - 5};
    vehicle_life: ${scrapYear == 0 ? "30" : introductionDate.split(",")[0] - scrapYear};
    reliability_decay: 10;
    dual_headed: ${dualHeaded};
    
    cost_factor: ${costFactor};
    running_cost_factor: ${runningCost};
    speed: ${speed} km/h;
    track_type: TR_${trackGauge}_${current.split("_")[0]};
    power: 1 kW;
    weight: ${weight[0]} ton;
  }
	graphics {
    additional_text:${formatDescString(dataObj, currentStringArr)}
    ${liveries.length > 1 ? `cargo_subtype_text:sw_${trainName}_lv_desc;` : ""}
    purchase: gfx_${trainName}_purchase;
    can_attach_wagon: sw_${trackGauge}_attach_vehid;
    ${formations[0] > 2 ? "start_stop: sw_stop_start_3;" : ""}
    purchase_power:sw_${trainName}_power_main()*4*1342/1000;
        
    SET_GRAPHICS_DOUBLE(sw_${trainName}_lv,
    sw_${trainName}_capacity_main()*param_capacity_mod/3,
    sw_${trainName}_power_main()*4*1342/1000,
    param_loading_${doors}D,//loading speed
    ${liveries.length > 1 ? `sw_${trainName}_lv_desc,` : "sw_empty_desc,"}
    mu_car_narrow,${weight[1]})
    }`;
}
