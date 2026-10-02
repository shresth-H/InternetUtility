import { describe, expect, it } from "vitest";
import {
  calculateAge,
  calculateCAGR,
  calculateDateDiff,
  calculateEMI,
  calculateGST,
  calculatePercentage,
  calculateSIP,
  convertUnit,
} from "../index";

describe("calculatePercentage", () => {
  it("calculates percentage of a value", () => {
    const result = calculatePercentage({ value: 200, percentage: 15, mode: "of" });
    expect(result.result).toBe(30);
  });

  it("calculates percentage change", () => {
    const result = calculatePercentage({
      value: 100,
      percentage: 0,
      mode: "difference",
      value2: 150,
    });
    expect(result.result).toBe(50);
  });
});

describe("calculateEMI", () => {
  it("calculates EMI for a loan", () => {
    const result = calculateEMI({
      principal: 1_000_000,
      annualRate: 8.5,
      tenureMonths: 240,
    });
    expect(result.emi).toBeGreaterThan(8000);
    expect(result.emi).toBeLessThan(9000);
    expect(result.schedule).toHaveLength(240);
  });
});

describe("calculateSIP", () => {
  it("calculates SIP maturity", () => {
    const result = calculateSIP({
      monthlyInvestment: 5000,
      annualRate: 12,
      tenureYears: 10,
    });
    expect(result.totalInvested).toBe(600_000);
    expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
  });
});

describe("calculateCAGR", () => {
  it("calculates CAGR", () => {
    const result = calculateCAGR({
      beginningValue: 100_000,
      endingValue: 200_000,
      years: 5,
    });
    expect(result.cagr).toBeCloseTo(14.87, 1);
  });
});

describe("calculateGST", () => {
  it("adds GST to exclusive amount", () => {
    const result = calculateGST({ amount: 1000, gstRate: 18, mode: "exclusive" });
    expect(result.gstAmount).toBe(180);
    expect(result.totalAmount).toBe(1180);
  });

  it("extracts GST from inclusive amount", () => {
    const result = calculateGST({ amount: 1180, gstRate: 18, mode: "inclusive" });
    expect(result.baseAmount).toBeCloseTo(1000, 0);
  });
});

describe("calculateAge", () => {
  it("calculates age", () => {
    const result = calculateAge({
      birthDate: "1990-01-15",
      referenceDate: "2024-01-15",
    });
    expect(result.years).toBe(34);
  });
});

describe("calculateDateDiff", () => {
  it("calculates difference between dates", () => {
    const result = calculateDateDiff({
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    });
    expect(result.days).toBe(30);
  });
});

describe("convertUnit", () => {
  it("converts kilometers to miles", () => {
    const result = convertUnit({
      value: 10,
      category: "length",
      fromUnit: "kilometer",
      toUnit: "mile",
    });
    expect(result.result).toBeCloseTo(6.2137, 2);
  });
});
