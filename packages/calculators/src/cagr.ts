export interface CAGRInput {
  beginningValue: number;
  endingValue: number;
  years: number;
}

export interface CAGRResult {
  cagr: number;
  totalReturn: number;
  totalReturnPercent: number;
}

export function calculateCAGR(input: CAGRInput): CAGRResult {
  const { beginningValue, endingValue, years } = input;

  if (beginningValue <= 0 || years <= 0) {
    throw new Error("Beginning value and years must be positive");
  }

  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  const totalReturn = endingValue - beginningValue;
  const totalReturnPercent = (totalReturn / beginningValue) * 100;

  return { cagr, totalReturn, totalReturnPercent };
}
