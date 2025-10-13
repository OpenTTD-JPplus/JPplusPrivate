import { readFileSync, writeFileSync } from "fs";
import { createTrain } from "../../api/createTrain.mjs";

//*TWR
const twrPath = "src/private/Kanto/TWR";
const twrData = readFileSync("src/private/Kanto/TWR/twr.json");

const twr_70_000series = JSON.parse(twrData).filter((prop) => prop.trainName == "twr_70_000series")[0];
writeFileSync(`src/private/generated/${twr_70_000series.trainName}.pnml`, createTrain(twr_70_000series, twrPath));

//*Tsukuba
const tsukubaPath = "src/private/Kanto/tsukuba";
const tsukubaData = readFileSync("src/private/Kanto/tsukuba/tsukuba.json");

const tsukuba_1000series = JSON.parse(tsukubaData).filter((prop) => prop.trainName == "tsukuba_1000series")[0];
writeFileSync(`src/private/generated/${tsukuba_1000series.trainName}.pnml`, createTrain(tsukuba_1000series, tsukubaPath));
const tsukuba_2000series = JSON.parse(tsukubaData).filter((prop) => prop.trainName == "tsukuba_2000series")[0];
writeFileSync(`src/private/generated/${tsukuba_2000series.trainName}.pnml`, createTrain(tsukuba_2000series, tsukubaPath));
const tsukuba_3000series = JSON.parse(tsukubaData).filter((prop) => prop.trainName == "tsukuba_3000series")[0];
writeFileSync(`src/private/generated/${tsukuba_3000series.trainName}.pnml`, createTrain(tsukuba_3000series, tsukubaPath));

//*Tokyu
const tokyuPath = "src/private/Kanto/tokyu";
const tokyuData = readFileSync("src/private/Kanto/tokyu/tokyu.json");
const tokyu3000 = JSON.parse(tokyuData).filter((prop) => prop.trainName == "tokyu3000")[0];
writeFileSync(`src/private/generated/${tokyu3000.trainName}.pnml`, createTrain(tokyu3000, tokyuPath));
const tokyu5000 = JSON.parse(tokyuData).filter((prop) => prop.trainName == "tokyu5000")[0];
writeFileSync(`src/private/generated/${tokyu5000.trainName}.pnml`, createTrain(tokyu5000, tokyuPath));

const y000 = JSON.parse(tokyuData).filter((prop) => prop.trainName == "y000")[0];
writeFileSync(`src/private/generated/${y000.trainName}.pnml`, createTrain(y000, tokyuPath));
const y500 = JSON.parse(tokyuData).filter((prop) => prop.trainName == "y500")[0];
writeFileSync(`src/private/generated/${y500.trainName}.pnml`, createTrain(y500, tokyuPath));

//*Tobu
const tobuPath = "src/private/Kanto/tobu";
const tobuData = readFileSync("src/private/Kanto/tobu/tobu.json");
const tobu100 = JSON.parse(tobuData).filter((prop) => prop.trainName == "tobu100")[0];
writeFileSync(`src/private/generated/${tobu100.trainName}.pnml`, createTrain(tobu100, tobuPath));
