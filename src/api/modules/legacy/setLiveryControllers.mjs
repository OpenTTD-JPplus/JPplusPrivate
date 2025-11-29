import { createSwitchNew } from "../../utils/createSwitch.mjs";

export function setLiveryControllers(data) {
  let str = "";
  let arr = [];
  let arrDesc = [];
  data.liveries.forEach((livery) => arr.push([livery.introYear, "sw_test_swt"]));
  data.liveries.forEach((livery, i) => arrDesc.push([i, livery.descString]));
  str += createSwitchNew("SELF", `sw_${data.trainName}_lv_main`, "build_year", arr);
  str += createSwitchNew("SELF", `sw_${data.trainName}_lv_desc_main`, "cargo_subtype", arrDesc);
  return str;
}
