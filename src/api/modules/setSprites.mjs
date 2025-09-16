export function setPurchaseSprite(trainName, path, logo, offsets, length = 8, isSingle = 0, is8bpp = 0) {
  const fullPath = `${path}/${trainName}/${trainName}.png`;

  return (
    `spriteset(gfx_${trainName}_purchase_c1, ${
      is8bpp ? "" : "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP,"
    }"${fullPath}"){ tmpl_purchase_1c_dual(0, ${offsets[0]}) }\n` +
    `spriteset(gfx_${trainName}_purchase_c2, ${
      is8bpp ? "" : "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP,"
    }"${fullPath}"){ tmpl_purchase_2c_dual(0, ${offsets[0]}) }\n` +
    `GRAPHIC_STACK_3(gfx_${trainName}_purchase, ${logo}, gfx_${trainName}_purchase_c1, gfx_${trainName}_purchase_c2)\n`
  );
}

export function setSprites(trainName, path, spriteSets, is8bpp = false) {
  const fullPath = `${path}/${trainName}/${trainName}.png`;
  let str = "";

  spriteSets.forEach((spriteGroup, i) => {
    spriteGroup.forEach((sprite) => {
      str += `spriteset(gfx_${trainName}${spriteSets.length > 1 ? `_${i + 1}` : ""}_${sprite[0]}, ${
        is8bpp ? "" : "ZOOM_LEVEL_NORMAL, BIT_DEPTH_32BPP, "
      }"${fullPath}${spriteSets.length > 1 ? `_${i + 1}` : ""}"){ ${sprite[1]} }\n`;
    });
  });
  return str;
}
