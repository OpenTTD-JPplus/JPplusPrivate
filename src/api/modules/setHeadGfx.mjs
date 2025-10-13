export function setHeadGfx(trainName, spriteName, params) {
  const customHeadLogic = params?.customHeadLogic || false;
  const customSandwichLogic = params?.customSandwichLogic || false;

  return `switch(FEAT_TRAINS, SELF, sw_${trainName}_head_gfx_main,position_in_consist>0){\n1: ${customHeadLogic ? "sw_" : "gfx_"}${spriteName}_end;\n${
    customHeadLogic ? "sw_" : "gfx_"
  }${spriteName}_front;\n}\nswitch(FEAT_TRAINS, SELF, sw_${trainName}_lv,vehicle_type_id){\n100..102:sw_${trainName}_${
    customSandwichLogic ? "sandwich" : "panto_placer"
  }_main;\nsw_${trainName}_head_gfx_main;\n}\n
  `;
}
