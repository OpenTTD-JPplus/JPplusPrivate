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

//*Tobu
const tobuPath = "src/private/Kanto/tobu";
const tobuData = readFileSync("src/private/Kanto/tobu/tobu.json");
const tobu100 = JSON.parse(tobuData).filter((prop) => prop.trainName == "tobu100")[0];
writeFileSync(`src/private/generated/${tobu100.trainName}.pnml`, createTrain(tobu100, tobuPath));
