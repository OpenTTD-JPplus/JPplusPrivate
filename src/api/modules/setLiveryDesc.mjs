// switch(FEAT_TRAINS, SELF, sw_tokyu5000_lv_desc, cargo_subtype){
//     0: string(LV_RANDOM);
//     1: string(LV_DATED,string(STR_LIVERY,string(LV_DEFAULT)),2002);
//     2: string(LV_DATED,string(STR_LIVERY,string(LV_tokyu5000_2)),2005);
//     3: string(LV_DATED,string(STR_LIVERY,string(LV_tokyu5000_3)),2017);
// }

export function setLiveryDesc(trainName, data) {
  let str = `switch(FEAT_TRAINS, SELF, sw_${trainName}_lv_desc, cargo_subtype){\n`;
  str += "0: string(LV_RANDOM);\n";
  data.liveries.forEach((livery, i) => {
    str += `${i + 1}:${livery.introYear ? "string(LV_DATED," : ""} ${livery.descString}${livery.introYear ? `,${livery.introYear})` : ""};\n`;
  });
  str += "\n}\n";
  return str;
}
