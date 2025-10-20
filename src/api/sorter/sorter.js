const fs = require("fs");

function sortByReference(targetArr, referenceObj, options = {}) {
  const resultArray = [];

  targetArr.forEach((targetObj) => {
    const {
      keepExtraKeys = true, // Keep keys not in reference
      extraKeysAt = "end", // 'start' or 'end'
      caseSensitive = true, // Case-sensitive key matching
    } = options;

    const referenceKeys = Object.keys(referenceObj);
    const targetKeys = Object.keys(targetObj);
    const sortedObj = {};

    // Helper function to normalize keys if case insensitive
    const normalizeKey = (key) => (caseSensitive ? key : key.toLowerCase());

    // Create a set of normalized reference keys for quick lookup
    const referenceKeySet = new Set(referenceKeys.map(normalizeKey));

    // Add keys in reference order first
    referenceKeys.forEach((refKey) => {
      // Find matching key in target object
      const matchingKey = targetKeys.find((targetKey) => normalizeKey(targetKey) === normalizeKey(refKey));

      if (matchingKey) {
        sortedObj[matchingKey] = targetObj[matchingKey];
      }
    });

    // Handle extra keys
    const extraKeys = targetKeys.filter((key) => !referenceKeySet.has(normalizeKey(key)));

    if (keepExtraKeys) {
      if (extraKeysAt === "start") {
        // Add extra keys at the beginning
        const tempObj = { ...sortedObj };
        Object.keys(sortedObj).forEach((key) => delete sortedObj[key]);

        extraKeys.forEach((key) => {
          sortedObj[key] = targetObj[key];
        });

        Object.keys(tempObj).forEach((key) => {
          sortedObj[key] = tempObj[key];
        });
      } else {
        // Add extra keys at the end (default)
        extraKeys.forEach((key) => {
          sortedObj[key] = targetObj[key];
        });
      }
    }
    resultArray.push(sortedObj);
  });
  return resultArray;
}

const sorting = JSON.parse(fs.readFileSync("src/api/sorter/sortObject.json"));
const sortOrder = JSON.parse(fs.readFileSync("src/api/sorter/sortOrder.json"));

const result = sortByReference(sorting, sortOrder);
fs.writeFileSync("src/api/sorter/sorted.json", JSON.stringify(result));
