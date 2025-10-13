import { setCapacity } from "./modules/setCapacity.mjs";
import { setHeadGfx } from "./modules/setHeadGfx.mjs";
import { setItem } from "./modules/setItem.mjs";
import { setLiveryDesc } from "./modules/setLiveryDesc.mjs";
import { setPanto } from "./modules/setPanto.mjs";
import { setPower } from "./modules/setPower.mjs";
import { setPurchaseSprite, setSprites } from "./modules/setSprites.mjs";

export function createTrain(data, path) {
  const hasPanto = data.options?.hasPanto || true;
  const customPuchaseSpriteLogic = data.options?.customPuchaseSpriteLogic || false;
  const customLoadingSpeed = data.options?.customLoadingSpeed || false;
  const customPowerLogic = data.options?.customPowerLogic || false;
  const customCapacityLogic = data.options?.customCapacityLogic || false;

  const { trainName } = data;
  let res =
    `${customPuchaseSpriteLogic ? customPuchaseSpriteLogic : setPurchaseSprite(trainName, path, `logo_${data.operator.toLowerCase()}`, [0, 50])}` +
    "\n" +
    setSprites(trainName, path, data.spriteSets) +
    "\n";

  //*Livery handling
  try {
    data.liveries.forEach((livery, i) => {
      res += `//*Livery ${i + 1} \n`;
      let liveryName = trainName;
      let spriteName = trainName;

      if (data.liveries.length > 1) {
        liveryName += "_" + (i + 1);
        spriteName += "_" + (i + 1);
        if (livery.spriteSet) spriteName = trainName + "_" + livery.spriteSet;
      }
      //*Custom GFX
      //Head gfx handling
      if (livery.customLogic?.customHeadLogic) {
        res += livery.customLogic.customHeadLogic + "\n";
      }

      //Motorcar handling
      if (livery.customLogic?.customMotorLogic) {
        res += livery.customLogic.customMotorLogic + "\n";
      }

      //Wagon handling
      if (livery.customLogic?.customWagLogic) {
        res += livery.customLogic.customWagLogic + "\n";
      }

      //*Panto handling
      if (hasPanto) {
        if (!livery.panto) {
          //copy data from the first panto placer, if no custom data is provided
          res += `${setPanto(liveryName, spriteName, data.liveries[0])}`;
        } else {
          res += `${setPanto(liveryName, spriteName, livery)}`;
        }
      }

      //*Sandwiched cars handling
      if (livery.customLogic?.customSandwichLogic) {
        res += livery.customLogic.customSandwichLogic + "\n";
      }

      //*Front-end cars handling
      res += setHeadGfx(liveryName, spriteName, livery.customLogic);
    });
  } catch (error) {
    console.error(error);
  }

  //*Livery selector handling
  try {
    if (data.options?.liveryLogic) {
      res += data.options.liveryLogic + "\n";
    }

    if (data.liveries.length > 1) {
      res += setLiveryDesc(trainName, data);
    }
  } catch (error) {
    console.error(error);
  }
  //*Post fixers custom logic
  res +=
    `${customLoadingSpeed ? customLoadingSpeed : ""}\n` +
    `${customCapacityLogic ? customCapacityLogic : setCapacity(trainName, data.capacity)}` +
    `${customPowerLogic ? customPowerLogic : setPower(trainName, data.power)}` +
    setItem(data);

  return res;
}
