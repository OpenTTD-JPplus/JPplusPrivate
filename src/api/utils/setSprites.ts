export function setSpriteSet(
  train: string,
  path: string,
  template: string,
  is32bpp: boolean = true,
) {
  return `spriteset(${train},  ${is32bpp ? "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP" : ""}, "${path}"){ ${template} }\n`;
}

export function setGraphicStack(train: string, graphicStack: Array<any>) {
  const testGraphicStack = ["twr71000_wag_base", "twr71000_wag_base1", "twr71000_wag_base2"];
  return `GRAPHIC_STACK_${graphicStack.length + 1}(${train}, ${testGraphicStack.join(", ")}})\n`;
}

const testG = [["ac1", "panto"], ["ac1"]];

export function setPurchaseSprite(
  train: string,
  path: string,
  graphicStack: Array<any>,
  is32bpp: boolean = true,
  isDual: boolean = true,
) {
  let res = "";
  const length = graphicStack[0].length + graphicStack[1].length;
  res += `spriteset(${train}_purchase_c1,  ${is32bpp ? "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP" : ""}, "${path}"){ tmpl_purchase_1c${isDual ? "_dual" : ""} }\n`;
  res += `spriteset(${train}_purchase_c2,  ${is32bpp ? "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP" : ""}, "${path}"){ tmpl_purchase_2c${isDual ? "_dual" : ""} }\n`;
  res += `GRAPHIC_STACK_${length + 2}(${train}_purchase, ${train}_purchase_c1, ${graphicStack[0].join(", ")}, ${train}_purchase_c2, ${graphicStack[1].join(", ")})\n`;
  return res;
}

console.log(setGraphicStack("test", testG));
