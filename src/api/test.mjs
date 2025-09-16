import { readFileSync, writeFileSync } from "fs";
import { createTrain } from "./createTrain.mjs";

const testPath = "src/private/Kanto/TWR";
const testData = readFileSync("src/data/dataSchema.json");

const twr_70_000series = JSON.parse(testData).filter((prop) => prop.trainName == "test_train")[0];
writeFileSync(`src/api/test.pnml`, createTrain(twr_70_000series, testPath));
