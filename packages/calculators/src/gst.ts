export interface GSTInput {
  amount: number;
  gstRate: number;
  mode: "exclusive" | "inclusive";
}

export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateGST(input: GSTInput): GSTResult {
  const { amount, gstRate, mode } = input;
  const rate = gstRate / 100;

  if (mode === "exclusive") {
    const gstAmount = amount * rate;
    return {
      baseAmount: amount,
      gstAmount,
      totalAmount: amount + gstAmount,
    };
  }

  const baseAmount = amount / (1 + rate);
  const gstAmount = amount - baseAmount;
  return {
    baseAmount,
    gstAmount,
    totalAmount: amount,
  };
}
