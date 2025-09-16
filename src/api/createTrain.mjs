import { setCapacity } from "./modules/setCapacity.mjs";
import { setHeadGfx } from "./modules/setHeadGfx.mjs";
import { setItem } from "./modules/setItem.mjs";
import { setPanto } from "./modules/setPanto.mjs";
import { setPower } from "./modules/setPower.mjs";
import { setPurchaseSprite, setSprites } from "./modules/setSprites.mjs";

export function createTrain(data, path) {
  const hasPanto = data.options?.hasPanto || true;
  const customPuchaseSpriteLogic = data.options?.customPuchaseSpriteLogic || false;
  const customSpriteLogic = data.options?.customSpriteLogic || false;
  const customPowerLogic = data.options?.customPowerLogic || false;
  const customCapacityLogic = data.options?.customCapacityLogic || false;

  const { trainName } = data;
  let res =
    `${customPuchaseSpriteLogic ? customPuchaseSpriteLogic : setPurchaseSprite(trainName, path, `logo_${data.operator.toLowerCase()}`, [0, 50])}` +
    setSprites(trainName, path, data.spriteSets);

  //*Livery handling
  try {
    data.liveries.forEach((livery, i) => {
      let liveryName = trainName;
      if (data.liveries.length > 1) liveryName += "_" + (i + 1);
      //Wagon handling
      if (livery.customLogic?.customWagLogic) {
        res += livery.customLogic.customWagLogic;
      }
      //Panto handling
      if (hasPanto) {
        if (!livery.panto) {
          console.log(data.liveries[0]);
          res += `${setPanto(liveryName, data.liveries[0].panto)}`;
        } else {
          res += `${setPanto(liveryName, livery.panto)}`;
        }
      }
      //Fake head handling
      if (livery.customLogic?.fakeHeadLogic) {
        res += livery.customLogic.fakeHeadLogic;
      }
      //front-end handling
      if (livery.customLogic?.customHeadLogic) {
        res += livery.customLogic.customHeadLogic;
      }
      res += setHeadGfx(liveryName, Boolean(livery.customLogic?.customHeadLogic));
    });
  } catch (error) {
    console.error(error);
  }
  try {
  } catch (error) {
    //Livery handling
    if (data.options?.liveryLogic) {
      res += data.liveryLogic;
    }
    console.error(error);
  }
  res +=
    `${customCapacityLogic ? customCapacityLogic : setCapacity(trainName, data.capacity)}` +
    `${customPowerLogic ? customPowerLogic : setPower(trainName, data.power)}` +
    setItem(data);

  return res;
}
