export interface DateDiffInput {
  startDate: string;
  endDate: string;
}

export interface DateDiffResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  businessDays: number;
}

function countBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function calculateDateDiff(input: DateDiffInput): DateDiffResult {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date");
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round(Math.abs(end.getTime() - start.getTime()) / msPerDay);
  const [earlier, later] = start <= end ? [start, end] : [end, start];

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    days,
    weeks: Math.floor(days / 7),
    months: years * 12 + months,
    years,
    businessDays: countBusinessDays(earlier, later),
  };
}
