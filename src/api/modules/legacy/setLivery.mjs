import { setFrontEndGfx } from "./setCustomHeadGfx.mjs";
import { setLiveryControllers } from "./setLiveryControllers.mjs";
import { setPanto } from "./setPanto.mjs";

export function setLivery(data) {
  let str = "";
  let arr = [];
  const liveries = data.liveries;
  const lvQuantity = liveries.length;
  liveries.forEach((livery, i) => {
    const liveryName = data.trainName + (i + 1) * 1;
    arr.push([livery.introYear, livery.liveryName]);
    str +=
      livery.customFrontGfx &&
      setFrontEndGfx({
        trainName: data.trainName,
        liveryName: liveryName,
        ...livery,
      });
    str +=
      livery.customEndGfx &&
      setFrontEndGfx({
        trainName: data.trainName,
        liveryName: liveryName,
        ...livery,
      });
    str += livery.customMotGfx && setFrontEndGfx(data);
    str += livery.customWagGfx && setFrontEndGfx(data);

    // str += setPanto({
    //   trainName: data.trainName,
    //   spriteName: data.trainName + (i + 1),
    //   ...livery,
    // });
  });
  if (!data.customLiveryController) {
    str += setLiveryControllers({
      trainName: data.trainName,
      // liveryName: liveryName,
      liveries: data.liveries,
    });
  }
  console.log(str);
}

setLivery({
  trainName: "test_train",
  liveries: [
    {
      descString: "string(LV_NAME)",
      introYear: "0..1999", //if not set, use as a default
      useSpriteSet: 0,
      setPurchase: true,

      //panto and fake head handler
      panto: {
        variations: [
          {
            introYear: 1995,
            placement: [
              { length: 5, positions: { "0_REV": "mot", "2_REV": "mot" } },
              { length: 3, positions: { 0: "mot" } },
            ],
            main: {
              0: 0,
              2: "0|1", //If | is detected -> create random switch
              5: 1,
            },
          },
        ],
      },

      customFrontGfx: [
        {
          introYear: 1995,
          useSpriteSet: 1,
          spriteArray: ["_front_1", "_front_2"], //If length == 1, set front/end fixer based on this value
        },
      ],
      customEndGfx: [
        {
          introYear: 1995,
          useSpriteSet: 1,
          spriteArray: ["_end_1", "_end_2"], //If length == 1, set front/end fixer based on this value
        },
      ],
      customMotData: [
        {
          modernizationYear: 2007,
          useSpriteSet: 1,
          isMirrored: true,
          mirrorBlock: 2, //y500 as example
          spriteArray: ["_mot_1", "_mot_2"],
        },
      ],
      customWagData: [
        {
          introYear: 1996,
          modernizationYear: 2007,
          useSpriteSet: 1,
          isMirrored: true,
          mirrorBlock: 2,

          insertAtPosition: [4, 5],
          loadSpeedChange: 6,
          spriteArray: ["_wag_1", "_wag_2"],
        },
      ],
    },
    {
      descString: "string(LV_NAME2)",
      introYear: "1999", //if not set, use as a default
      useSpriteSet: 0,
      setPurchase: true,

      //panto and fake head handler
      panto: {
        variations: [
          {
            introYear: 1995,
            placement: [
              { length: 5, positions: { "0_REV": "mot", "2_REV": "mot" } },
              { length: 3, positions: { 0: "mot" } },
            ],
            main: {
              0: 0,
              2: "0|1", //If | is detected -> create random switch
              5: 1,
            },
          },
        ],
      },
    },
  ],
});
