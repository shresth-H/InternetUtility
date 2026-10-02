export interface PercentageInput {
  value: number;
  percentage: number;
  mode: "of" | "change" | "difference";
  value2?: number;
}

export interface PercentageResult {
  result: number;
  formula: string;
  explanation: string;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { value, percentage, mode, value2 } = input;

  switch (mode) {
    case "of": {
      const result = (value * percentage) / 100;
      return {
        result,
        formula: `${percentage}% of ${value} = ${result}`,
        explanation: `${percentage}% of ${value} equals ${result.toFixed(2)}.`,
      };
    }
    case "change": {
      const result = value + (value * percentage) / 100;
      return {
        result,
        formula: `${value} + ${percentage}% = ${result}`,
        explanation: `Increasing ${value} by ${percentage}% gives ${result.toFixed(2)}.`,
      };
    }
    case "difference": {
      if (value2 === undefined) throw new Error("value2 is required for difference mode");
      const diff = ((value2 - value) / value) * 100;
      return {
        result: diff,
        formula: `((${value2} - ${value}) / ${value}) × 100 = ${diff}%`,
        explanation: `The percentage change from ${value} to ${value2} is ${diff.toFixed(2)}%.`,
      };
    }
    default:
      throw new Error("Invalid mode");
  }
}
