"use client";

import { useMemo, useState } from "react";
import {
  calculatePercentage,
  calculateEMI,
  calculateSIP,
  calculateCAGR,
  calculateGST,
  calculateAge,
  calculateDateDiff,
  convertUnit,
  getUnitsForCategory,
} from "@internet-utility/calculators";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";

const FINANCE_DISCLAIMER = "Results are for informational purposes only and do not constitute financial advice.";

export function CalculatorToolsPanel({ slug }: { slug: string }) {
  if (slug === "percentage-calculator") return <PercentageCalculator />;
  if (slug === "emi-calculator") return <EMICalculator />;
  if (slug === "sip-calculator") return <SIPCalculator />;
  if (slug === "cagr-calculator") return <CAGRCalculator />;
  if (slug === "gst-calculator") return <GSTCalculator />;
  if (slug === "age-calculator") return <AgeCalculator />;
  if (slug === "date-calculator") return <DateCalculator />;
  if (slug === "unit-converter") return <UnitConverter />;
  return null;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function PercentageCalculator() {
  const [value, setValue] = useState("200");
  const [percentage, setPercentage] = useState("15");
  const [mode, setMode] = useState<"of" | "change" | "difference">("of");
  const [value2, setValue2] = useState("150");

  const result = useMemo(() => {
    try {
      return calculatePercentage({
        value: parseFloat(value),
        percentage: parseFloat(percentage),
        mode,
        value2: mode === "difference" ? parseFloat(value2) : undefined,
      });
    } catch {
      return null;
    }
  }, [value, percentage, mode, value2]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Percentage</label>
          <Input type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} className="mt-1" />
        </div>
      </div>
      <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
        <option value="of">X% of value</option>
        <option value="change">Increase by X%</option>
        <option value="difference">Percentage difference</option>
      </Select>
      {mode === "difference" && (
        <div>
          <label className="text-sm font-medium">Second value</label>
          <Input type="number" value={value2} onChange={(e) => setValue2(e.target.value)} className="mt-1" />
        </div>
      )}
      {result && (
        <>
          <ResultCard label="Result" value={formatNumber(result.result)} />
          <p className="text-sm text-muted">{result.explanation}</p>
        </>
      )}
    </div>
  );
}

function EMICalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("240");
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => {
    try {
      return calculateEMI({
        principal: parseFloat(principal),
        annualRate: parseFloat(rate),
        tenureMonths: parseInt(tenure),
      });
    } catch {
      return null;
    }
  }, [principal, rate, tenure]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Loan Amount (₹)</label>
          <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Interest Rate (% p.a.)</label>
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Tenure (months)</label>
          <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="mt-1" />
        </div>
      </div>
      {result && (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultCard label="Monthly EMI" value={formatCurrency(result.emi)} />
            <ResultCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
            <ResultCard label="Total Payment" value={formatCurrency(result.totalPayment)} />
          </div>
          <Button variant="outline" onClick={() => setShowSchedule(!showSchedule)}>
            {showSchedule ? "Hide" : "Show"} Amortization Schedule
          </Button>
          {showSchedule && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-accent">
                  <tr>
                    <th className="px-3 py-2 text-left">Month</th>
                    <th className="px-3 py-2 text-right">EMI</th>
                    <th className="px-3 py-2 text-right">Principal</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-t border-border">
                      <td className="px-3 py-2">{row.month}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(row.emi)}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(row.principal)}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(row.interest)}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.schedule.length > 12 && (
                <p className="text-xs text-muted p-2">Showing first 12 of {result.schedule.length} months</p>
              )}
            </div>
          )}
          <p className="text-xs text-muted">{FINANCE_DISCLAIMER}</p>
        </>
      )}
    </div>
  );
}

function SIPCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    try {
      return calculateSIP({
        monthlyInvestment: parseFloat(monthly),
        annualRate: parseFloat(rate),
        tenureYears: parseFloat(years),
      });
    } catch {
      return null;
    }
  }, [monthly, rate, years]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Monthly Investment (₹)</label>
          <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Expected Return (% p.a.)</label>
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Duration (years)</label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1" />
        </div>
      </div>
      {result && (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultCard label="Total Invested" value={formatCurrency(result.totalInvested)} />
            <ResultCard label="Est. Returns" value={formatCurrency(result.estimatedReturns)} />
            <ResultCard label="Maturity Value" value={formatCurrency(result.maturityValue)} />
          </div>
          <p className="text-xs text-muted">{FINANCE_DISCLAIMER}</p>
        </>
      )}
    </div>
  );
}

function CAGRCalculator() {
  const [begin, setBegin] = useState("100000");
  const [end, setEnd] = useState("200000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    try {
      return calculateCAGR({
        beginningValue: parseFloat(begin),
        endingValue: parseFloat(end),
        years: parseFloat(years),
      });
    } catch {
      return null;
    }
  }, [begin, end, years]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Beginning Value (₹)</label>
          <Input type="number" value={begin} onChange={(e) => setBegin(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Ending Value (₹)</label>
          <Input type="number" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Years</label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1" />
        </div>
      </div>
      {result && (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultCard label="CAGR" value={`${formatNumber(result.cagr)}%`} />
            <ResultCard label="Total Return" value={formatCurrency(result.totalReturn)} />
            <ResultCard label="Total Return %" value={`${formatNumber(result.totalReturnPercent)}%`} />
          </div>
          <p className="text-xs text-muted">{FINANCE_DISCLAIMER}</p>
        </>
      )}
    </div>
  );
}

function GSTCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  const result = useMemo(() => {
    try {
      return calculateGST({ amount: parseFloat(amount), gstRate: parseFloat(rate), mode });
    } catch {
      return null;
    }
  }, [amount, rate, mode]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Amount (₹)</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">GST Rate (%)</label>
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" />
        </div>
      </div>
      <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
        <option value="exclusive">Add GST (amount excludes GST)</option>
        <option value="inclusive">Remove GST (amount includes GST)</option>
      </Select>
      {result && (
        <div className="grid sm:grid-cols-3 gap-3">
          <ResultCard label="Base Amount" value={formatCurrency(result.baseAmount)} />
          <ResultCard label="GST Amount" value={formatCurrency(result.gstAmount)} />
          <ResultCard label="Total Amount" value={formatCurrency(result.totalAmount)} />
        </div>
      )}
    </div>
  );
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1990-01-15");

  const result = useMemo(() => {
    try {
      return calculateAge({ birthDate });
    } catch {
      return null;
    }
  }, [birthDate]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Date of Birth</label>
        <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1" />
      </div>
      {result && (
        <div className="grid sm:grid-cols-4 gap-3">
          <ResultCard label="Years" value={String(result.years)} />
          <ResultCard label="Months" value={String(result.months)} />
          <ResultCard label="Days" value={String(result.days)} />
          <ResultCard label="Total Days" value={String(result.totalDays)} />
        </div>
      )}
    </div>
  );
}

function DateCalculator() {
  const [start, setStart] = useState("2024-01-01");
  const [end, setEnd] = useState("2024-12-31");

  const result = useMemo(() => {
    try {
      return calculateDateDiff({ startDate: start, endDate: end });
    } catch {
      return null;
    }
  }, [start, end]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
        </div>
      </div>
      {result && (
        <div className="grid sm:grid-cols-3 gap-3">
          <ResultCard label="Days" value={String(result.days)} />
          <ResultCard label="Weeks" value={String(result.weeks)} />
          <ResultCard label="Business Days" value={String(result.businessDays)} />
        </div>
      )}
    </div>
  );
}

function UnitConverter() {
  const [category, setCategory] = useState<"length" | "weight" | "temperature">("length");
  const units = getUnitsForCategory(category);
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [toUnit, setToUnit] = useState(units[1] ?? units[0]);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    try {
      return convertUnit({
        value: parseFloat(value),
        category,
        fromUnit,
        toUnit,
      });
    } catch {
      return null;
    }
  }, [value, category, fromUnit, toUnit]);

  return (
    <div className="space-y-4">
      <Select
        value={category}
        onChange={(e) => {
          const cat = e.target.value as typeof category;
          setCategory(cat);
          const u = getUnitsForCategory(cat);
          setFromUnit(u[0]);
          setToUnit(u[1] ?? u[0]);
        }}
      >
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </Select>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">From</label>
          <Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="mt-1">
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">To</label>
          <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="mt-1">
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>
      </div>
      {result && <ResultCard label="Result" value={`${formatNumber(result.result, 4)} ${toUnit}`} />}
    </div>
  );
}
