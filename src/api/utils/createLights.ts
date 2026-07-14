import { createSwitchNew } from "./createSwitch";
import { setSpriteSet } from "./setSprites";

export function setLightsForTrain(trainName: string, path: string) {
  let result = "";

  result += `${setSpriteSet(`${trainName}_lights_front`, `${path}/${trainName}_lights.png`, "tmpl_std_v3(0, 0)")}`;
  result += `${setSpriteSet(`${trainName}_lights_end`, `${path}/${trainName}_lights.png`, "tmpl_std_v3(0, 25)")}`;

  result += createSwitchNew(
    "SELF",
    `sw_${trainName}_lights`,
    "train_is_driving_backwards != vehicle_is_flipped",
    [
      ["1", `${trainName}_lights_end`],
      ["default", `${trainName}_lights_front`],
    ],
  );
  return result;
}
