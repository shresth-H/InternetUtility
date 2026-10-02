export interface EMIInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EMIScheduleRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: EMIScheduleRow[];
}

export function calculateEMI(input: EMIInput): EMIResult {
  const { principal, annualRate, tenureMonths } = input;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    const schedule: EMIScheduleRow[] = [];
    let balance = principal;
    for (let month = 1; month <= tenureMonths; month++) {
      balance -= emi;
      schedule.push({
        month,
        emi,
        principal: emi,
        interest: 0,
        balance: Math.max(0, balance),
      });
    }
    return {
      emi,
      totalPayment: principal,
      totalInterest: 0,
      schedule,
    };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const schedule: EMIScheduleRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    totalInterest += interest;
    schedule.push({
      month,
      emi,
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return {
    emi,
    totalPayment: emi * tenureMonths,
    totalInterest,
    schedule,
  };
}
