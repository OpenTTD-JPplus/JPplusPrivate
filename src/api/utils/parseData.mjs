import { readFileSync, writeFileSync } from "fs";
import { setItem } from "./setItem.mjs";

export function parseCompany(path) {
  const data = readFileSync(`${path}/data.json`);
  const parsed = JSON.parse(data);
  let result = "";
  parsed.forEach((train) => {
    result += setItem(train) + "\n";
  });
  writeFileSync(`${path}/items.pnml`, result);
}
