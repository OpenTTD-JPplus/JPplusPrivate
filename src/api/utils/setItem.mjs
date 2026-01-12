function handleMetroBadgeExeptions(string) {
  let res = `, "line/`;
  if (string === "TOKYO_CHIYODA_BR") return `${res}TOKYO_CHIYODA"`;
  if (string === "TOKYO_TOZAI_TOYO") return "";
  if (string === "TOKYO_NAMBOKU_SAITAMA") return "";
  if (string === "OSAKA_MIDO_NAMBOKU") return `${res}OSAKA_MIDOSUJI"`;
  if (string === "OSAKA_MIDO_YOTSU") return `${res}OSAKA_MIDOSUJI"`;
  if (string === "OSAKA_KEIHANNA") return "";
  return `${res}${string}"`;
}

//TODO Possible capacity and power handlers from the data side

function handleRoutes(string) {
  if (string.includes("tk_gz")) return `ginza/`;
  if (string.includes("tk_as")) return `asakusa/`;
  if (string.includes("tk_ch")) return `chiyoda/`;
  if (string.includes("tk_hz")) return `hanzomon/`;
  if (string.includes("tk_hb")) return `hibiya/`;
  if (string.includes("tk_mn")) return `marunouchi/`;
  if (string.includes("tk_mt")) return `mita/`;
  if (string.includes("tk_od")) return `oedo/`;
  if (string.includes("tk_sj")) return `shinjuku/`;
  if (string.includes("tk_yk")) return `yurakucho_fukutoshin/`;
  if (string.includes("tk_nm_")) return `namboku/`;
  if (string.includes("tk_tz_")) return `tozai/`;
  if (string.includes("os_nm")) return `namboku_mido/`;
  if (string.includes("os_ch")) return `chuo/`;
  if (string.includes("kintetsu7000")) return `chuo/`;
  if (string.includes("os_hk")) return `hankyoto/`;
  if (string.includes("os_iz")) return `imazatosuji/`;
  if (string.includes("os_sn")) return `sennichimae/`;
  if (string.includes("os_tm")) return `tanimachi/`;
  if (string.includes("os_ts")) return `tsurumi/`;
  if (string.includes("os_yb")) return `yotsubashi/`;
  if (string.includes("ng_hg")) return `higashiyama/`;
  if (string.includes("ng_km")) return `kamiida/`;
  if (string.includes("ng_mj")) return `meijo/`;
  if (string.includes("ng_sk")) return `sakura/`;
  if (string.includes("ng_tm")) return `tsurumai/`;
  return "";
}

function handlePower(trainName, fixedPower, reusePowerFrom) {
  if (fixedPower) return `${fixedPower}*4*1342/1000`;

  return `sw_${reusePowerFrom ? reusePowerFrom : trainName}_power_main()*4*1342/1000`;
}

function handleCapacity(trainName, fixedCapacity, reuseCapacityFrom, boostCapacity) {
  let result = "";
  if (fixedCapacity) {
    result = `${fixedCapacity}*param_capacity_mod/3`;
  } else {
    result = `sw_${
      reuseCapacityFrom ? reuseCapacityFrom : trainName
    }_capacity_main()*param_capacity_mod/3`;
  }

  if (boostCapacity) result += "*boost_rapid_mod/2";
  return result;
}

function formatCurrentString(string) {
  const arr = string.split("_");

  if (string.includes("AC") && string.includes("DC")) {
    const hzNumeric = arr[2].replace(/hz/gm, "");
    return `string(STR_ACDC, ${arr[1]},${hzNumeric},1500)`;
  }
  if (string.includes("AC")) return `string(STR_AC, ${arr[1]},${arr[2]})`;

  return `string(STR_DC, ${arr[1]})`;
}

function formatTrackType(string) {
  if (string.includes("GUIDE")) return "GUIDE";
  if (string.includes("LINIMO")) return "LINEAR";
  if (string.includes("METRO")) return "METRO";
  if (string.includes("AC") && string.includes("DC")) return "ACDC";
  if (string.includes("AC")) return "AC";
  return "DC";
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
    ${
      data.usage
        ? `string(STR_USAGE, ${
            data.usage.length > 1
              ? `string(STR_CONCAT_${data.usage.length}_OR, ${usage})`
              : `${usage}`
          }),`
        : ""
    }
    string(STR_OPERATOR, ${
      data.operator.length > 1
        ? `string(STR_CONCAT_${data.usage.length}, ${operator})`
        : `${operator}`
    })
    ${data.metroLine ? `,string(STR_LINES_USED, string(STR_${data.metroLine}))` : ""}
    );`;
}

export function setItem(data, path) {
  let str = "";
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
    boostCapacity = false,
    doors,
    current,
    threeCarsMin,
    variantGroup,
    variantSimple,
    fixedCapacity,
    fixedPower,
    length,
    metroLine,
    sounds,
    isDualHeaded = 1,
    customSpeedLogic,
    customCargoAge,
    customPath,
  } = data;

  const metroLinePrefix = handleRoutes(trainName);
  str += `#include "${metroLinePrefix}${
    customPath ? customPath : trainName
  }/${trainName}.pnml"\n\n`;

  const usage = data.usage?.map((el) => `string(STR_${el.toUpperCase()})`).toString();
  const operator = data.operator.map((el) => `string(STR_${el.toUpperCase()})`).toString();
  const power = handlePower(trainName, data.fixedPower, data.reusePowerFrom);
  const capacity = handleCapacity(
    trainName,
    data.fixedCapacity,
    data.reuseCapacityFrom,
    boostCapacity
  );

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
    dual_headed: ${isDualHeaded ? 1 : 0};
    ${variantGroup ? `variant_group: ${variantGroup};` : ""}
    cost_factor: ${costFactor};
    running_cost_factor: ${runningCost};
    speed: ${speed} km/h;
    track_type:${trackGauge===13721435?"[TR_1372_DC,TR_1435_DC]":`TR_${trackGauge}_${formatTrackType(current)}`}
     ;
    power: 1 kW;
    tractive_effort_coefficient:  0.2;
    weight: ${weight[0]} ton;
    badges: ["company/${data.operator[0].toLowerCase()}"${
    data.metroLine ? `${handleMetroBadgeExeptions(data.metroLine).toLowerCase()}` : ""
  }];
    ${length ? `length: ${length};` : ""}
  }
	graphics {
    ${data.isVariantGroupParent ? `name: sw_${trainName}_name;` : ""}
    ${variantSimple ? "" : `${data.variantGroup ? `name: sw_${variantGroup}_name;` : ""} `}
    additional_text:${formatDescString(data, usage, operator)}
    ${data.hasLiveryDesc ? `cargo_subtype_text: sw_${trainName}_lv_desc_main;` : ""}
    purchase: ${trainName}_purchase;
    cargo_capacity:${capacity};
    loading_speed:${
      doors.length <= 1 ? `param_loading_${doors}D` : `sw_${trainName}_loading_speed_main`
    };
    default:sw_${trainName}_lv;
    power:${power};
    ${
      fixedPower
        ? ""
        : `purchase_power: sw_${
            data.reusePowerFrom ? data.reusePowerFrom : trainName
          }_car_power_main()*4*1342/1000;`
    }
    ${customSpeedLogic ? `speed:sw_${trainName}_speed_main;` : ""}
    ${threeCarsMin ? "start_stop: sw_stop_start_3;" : ""}
    ${sounds ? `sound_effect: ${sounds};` : ""}
    ${
      customCargoAge
        ? `cargo_age_period: ${customCargoAge};`
        : data.usage?.at(0).length && data.usage[0].includes("limited_express")
        ? `cargo_age_period: ltd_express_cargo_age;`
        : ""
    }
    
  }
  livery_override(mu_car){
		cargo_subtype_text:${data.hasLiveryDesc ? `sw_${trainName}_lv_desc_main` : "sw_empty_desc"};
    loading_speed:${
      doors.length <= 1 ? `param_loading_${doors}D` : `sw_${trainName}_loading_speed_main`
    };
    cargo_capacity:${capacity};
    power:${power};
    default:sw_${trainName}_lv;
    weight: ${weight[1]};
    ${length ? `length: ${length};` : ""}
  }
}`;
  return str;
}
