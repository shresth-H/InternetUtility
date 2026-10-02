export interface SIPInput {
  monthlyInvestment: number;
  annualRate: number;
  tenureYears: number;
}

export interface SIPResult {
  totalInvested: number;
  estimatedReturns: number;
  maturityValue: number;
}

export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyInvestment, annualRate, tenureYears } = input;
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  const totalInvested = monthlyInvestment * months;

  if (monthlyRate === 0) {
    return {
      totalInvested,
      estimatedReturns: 0,
      maturityValue: totalInvested,
    };
  }

  const maturityValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);

  return {
    totalInvested,
    estimatedReturns: maturityValue - totalInvested,
    maturityValue,
  };
}
