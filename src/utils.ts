import type { NutritionDataPer } from "./off-v2.js";

export function isPrimitiveValue(
  value: unknown,
): value is string | number | boolean {
  if (value === undefined || value === null) {
    return false;
  }
  const valType = typeof value;
  return valType === "string" || valType === "number" || valType === "boolean";
}

export function getNutritionDataPer(
  nutriments: Record<string, unknown>,
): NutritionDataPer | undefined {
  let nutritionDataPer: NutritionDataPer | undefined;
  for (const [key, value] of Object.entries(nutriments)) {
    if (!isPrimitiveValue(value)) continue;

    if (key.endsWith("_100g")) {
      return "100g";
    }
    if (key.endsWith("_serving")) {
      nutritionDataPer = "serving";
    }
  }
  return nutritionDataPer;
}

export function processNutrimentEntry(
  key: string,
  value: string | number | boolean,
  nutritionDataPer: NutritionDataPer | undefined,
  params: Record<string, string>,
): void {
  const strVal = String(value);

  if (key.endsWith("_100g") && nutritionDataPer === "100g") {
    const nid = key.slice(0, -5);
    params[`nutriment_${nid}`] = strVal;
  } else if (key.endsWith("_serving") && nutritionDataPer === "serving") {
    const nid = key.slice(0, -8);
    params[`nutriment_${nid}`] = strVal;
  } else if (key.endsWith("_unit")) {
    const nid = key.slice(0, -5);
    params[`nutriment_${nid}_unit`] = strVal;
  } else if (key.endsWith("_modifier")) {
    const nid = key.slice(0, -9);
    params[`nutriment_${nid}_modifier`] = strVal;
  }
}

export function buildNutritionParams(
  nutriments: Record<string, unknown>,
): Record<string, string> {
  const params: Record<string, string> = {};

  const nutritionDataPer = getNutritionDataPer(nutriments);
  if (nutritionDataPer) {
    params["nutrition_data_per"] = nutritionDataPer;
  }

  for (const [key, value] of Object.entries(nutriments)) {
    if (isPrimitiveValue(value)) {
      processNutrimentEntry(key, value, nutritionDataPer, params);
    }
  }

  return params;
}
