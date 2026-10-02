type UnitCategory = "length" | "weight" | "temperature";

const CONVERSIONS: Record<
  UnitCategory,
  Record<string, { toBase: (v: number) => number; fromBase: (v: number) => number }>
> = {
  length: {
    meter: { toBase: (v) => v, fromBase: (v) => v },
    kilometer: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    centimeter: { toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    millimeter: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    mile: { toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    yard: { toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    foot: { toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    inch: { toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  },
  weight: {
    kilogram: { toBase: (v) => v, fromBase: (v) => v },
    gram: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    milligram: { toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    pound: { toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    ounce: { toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  },
  temperature: {
    celsius: {
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    fahrenheit: {
      toBase: (v) => ((v - 32) * 5) / 9,
      fromBase: (v) => (v * 9) / 5 + 32,
    },
    kelvin: {
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    },
  },
};

export interface UnitConverterInput {
  value: number;
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
}

export interface UnitConverterResult {
  result: number;
  formula: string;
}

export function convertUnit(input: UnitConverterInput): UnitConverterResult {
  const { value, category, fromUnit, toUnit } = input;
  const units = CONVERSIONS[category];

  if (!units[fromUnit] || !units[toUnit]) {
    throw new Error("Invalid unit");
  }

  const baseValue = units[fromUnit].toBase(value);
  const result = units[toUnit].fromBase(baseValue);

  return {
    result,
    formula: `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`,
  };
}

export function getUnitsForCategory(category: UnitCategory): string[] {
  return Object.keys(CONVERSIONS[category]);
}

export type { UnitCategory };
