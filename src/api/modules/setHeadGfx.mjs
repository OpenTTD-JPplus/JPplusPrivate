export function setHeadGfx(trainName, customHeadGfx) {
  return `switch(FEAT_TRAINS, SELF, sw_${trainName}_head_gfx_main,position_in_consist-position_in_vehid_chain>0){\n1: ${
    customHeadGfx ? "sw_" : "gfx_"
  }${trainName}_end;\n${
    customHeadGfx ? "sw_" : "gfx_"
  }${trainName}_front;\n}\nswitch(FEAT_TRAINS, SELF, sw_${trainName}_lv,vehicle_type_id){\n100..102:sw_${trainName}_panto_placer_main;\nsw_${trainName}_head_gfx_main;\n}\n
  `;
}
