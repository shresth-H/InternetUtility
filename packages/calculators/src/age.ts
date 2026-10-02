export interface AgeInput {
  birthDate: string;
  referenceDate?: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: string;
}

export function calculateAge(input: AgeInput): AgeResult {
  const birth = new Date(input.birthDate);
  const reference = input.referenceDate ? new Date(input.referenceDate) : new Date();

  if (isNaN(birth.getTime()) || isNaN(reference.getTime())) {
    throw new Error("Invalid date");
  }
  if (birth > reference) {
    throw new Error("Birth date cannot be in the future");
  }

  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  let days = reference.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor(
    (reference.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
  );

  const nextBirthday = new Date(reference);
  nextBirthday.setMonth(birth.getMonth(), birth.getDate());
  if (nextBirthday <= reference) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthday: nextBirthday.toISOString().split("T")[0],
  };
}
