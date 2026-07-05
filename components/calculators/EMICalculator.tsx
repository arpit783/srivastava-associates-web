"use client";

import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { Calculator, TrendingUp, BarChart2, Table2, Share2, Download } from "lucide-react";
import { formatINR, buildWhatsAppUrl } from "@/lib/utils";

const TABS = [
  { id: "basic", label: "EMI Calculator", icon: Calculator },
  { id: "eligibility", label: "Eligibility", icon: TrendingUp },
  { id: "comparison", label: "Comparison", icon: BarChart2 },
  { id: "amortization", label: "Amortization", icon: Table2 },
];

function calcEMI(principal: number, ratePercent: number, tenureMonths: number) {
  if (!principal || !ratePercent || !tenureMonths) return 0;
  const r = ratePercent / 12 / 100;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

function amortizationSchedule(principal: number, ratePercent: number, tenureMonths: number) {
  const r = ratePercent / 12 / 100;
  const emi = calcEMI(principal, ratePercent, tenureMonths);
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPayment = balance * r;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.max(0, Math.round(balance)),
    });
  }
  return schedule;
}

function yearlyAmortization(schedule: ReturnType<typeof amortizationSchedule>) {
  const years: Record<number, { year: number; principal: number; interest: number; balance: number }> = {};
  schedule.forEach((row) => {
    const year = Math.ceil(row.month / 12);
    if (!years[year]) years[year] = { year, principal: 0, interest: 0, balance: 0 };
    years[year].principal += row.principal;
    years[year].interest += row.interest;
    years[year].balance = row.balance;
  });
  return Object.values(years);
}

export default function EMICalculator() {
  const [activeTab, setActiveTab] = useState("basic");

  // Basic tab state
  const [principal, setPrincipal] = useState(2000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(240);

  // Eligibility tab state
  const [income, setIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [eligRate, setEligRate] = useState(8.5);
  const [eligTenure, setEligTenure] = useState(240);

  // Comparison tab state
  const [scenarios, setScenarios] = useState([
    { label: "Scenario A", principal: 2000000, rate: 8.5, tenure: 240 },
    { label: "Scenario B", principal: 2000000, rate: 9.0, tenure: 240 },
    { label: "Scenario C", principal: 2000000, rate: 9.5, tenure: 180 },
  ]);

  // Amortization view mode
  const [amorView, setAmorView] = useState<"monthly" | "yearly">("yearly");

  // Basic calculations
  const emi = useMemo(() => calcEMI(principal, rate, tenure), [principal, rate, tenure]);
  const totalAmount = useMemo(() => emi * tenure, [emi, tenure]);
  const totalInterest = useMemo(() => totalAmount - principal, [totalAmount, principal]);

  // Eligibility calculation (FOIR: Fixed Obligation to Income Ratio typically 40-50%)
  const foir = 0.45;
  const maxEmi = useMemo(() => income * foir - existingEmi, [income, existingEmi]);
  const maxLoan = useMemo(() => {
    if (maxEmi <= 0 || !eligRate || !eligTenure) return 0;
    const r = eligRate / 12 / 100;
    return maxEmi * ((Math.pow(1 + r, eligTenure) - 1) / (r * Math.pow(1 + r, eligTenure)));
  }, [maxEmi, eligRate, eligTenure]);

  // Amortization
  const schedule = useMemo(() => amortizationSchedule(principal, rate, tenure), [principal, rate, tenure]);
  const yearlyData = useMemo(() => yearlyAmortization(schedule), [schedule]);

  // Pie chart data
  const pieData = [
    { name: "Principal", value: principal },
    { name: "Interest", value: Math.round(totalInterest) },
  ];
  const COLORS = ["#0B1D3E", "#C9A227"];

  // Share EMI summary on WhatsApp
  function shareOnWhatsApp() {
    const msg =
      `📊 *EMI Calculation — Srivastava Associates*\n\n` +
      `Loan Amount: ${formatINR(principal)}\n` +
      `Interest Rate: ${rate}% p.a.\n` +
      `Tenure: ${tenure / 12} years (${tenure} months)\n\n` +
      `*Monthly EMI: ${formatINR(Math.round(emi))}*\n` +
      `Total Interest: ${formatINR(Math.round(totalInterest))}\n` +
      `Total Amount Payable: ${formatINR(Math.round(totalAmount))}\n\n` +
      `📞 For personalised advice: 8306445333\n— Srivastava Associates`;
    const base = "https://wa.me/918306445333";
    window.open(`${base}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function updateScenario(idx: number, field: string, value: string | number) {
    setScenarios((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === id
                ? "border-gold text-navy"
                : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* BASIC EMI TAB */}
      {activeTab === "basic" && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Loan Amount</label>
                <span className="font-bold text-navy">{formatINR(principal)}</span>
              </div>
              <input type="range" min={100000} max={10000000} step={50000} value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-gold" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹1L</span><span>₹1Cr</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Interest Rate (% p.a.)</label>
                <span className="font-bold text-navy">{rate}%</span>
              </div>
              <input type="range" min={6} max={24} step={0.1} value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-gold" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>6%</span><span>24%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Loan Tenure</label>
                <span className="font-bold text-navy">{tenure / 12} Years ({tenure} mo)</span>
              </div>
              <input type="range" min={12} max={360} step={12} value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-gold" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 Yr</span><span>30 Yr</span>
              </div>
            </div>

            {/* Manual inputs */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="label text-xs">Amount (₹)</label>
                <input type="number" className="input-field text-sm py-2" value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))} />
              </div>
              <div>
                <label className="label text-xs">Rate (%)</label>
                <input type="number" className="input-field text-sm py-2" step="0.1" value={rate}
                  onChange={(e) => setRate(Number(e.target.value))} />
              </div>
              <div>
                <label className="label text-xs">Months</label>
                <input type="number" className="input-field text-sm py-2" value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* EMI display */}
            <div className="bg-navy rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">Monthly EMI</p>
              <p className="text-4xl font-extrabold text-gold">{formatINR(Math.round(emi))}</p>
              <p className="text-gray-400 text-xs mt-1">per month for {tenure / 12} years</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Principal</p>
                <p className="font-bold text-navy">{formatINR(principal)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Total Interest</p>
                <p className="font-bold text-navy">{formatINR(Math.round(totalInterest))}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center col-span-2">
                <p className="text-xs text-gray-400 mb-1">Total Amount Payable</p>
                <p className="font-bold text-navy text-lg">{formatINR(Math.round(totalAmount))}</p>
              </div>
            </div>

            {/* Pie chart */}
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-xs">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
              ))}
            </div>

            <button onClick={shareOnWhatsApp} className="btn-primary w-full justify-center text-sm">
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* ELIGIBILITY TAB */}
      {activeTab === "eligibility" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Monthly Net Income</label>
                <span className="font-bold text-navy">{formatINR(income)}</span>
              </div>
              <input type="range" min={10000} max={500000} step={5000} value={income}
                onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Existing Monthly EMI Obligations</label>
                <span className="font-bold text-navy">{formatINR(existingEmi)}</span>
              </div>
              <input type="range" min={0} max={200000} step={1000} value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Expected Interest Rate</label>
                <span className="font-bold text-navy">{eligRate}%</span>
              </div>
              <input type="range" min={6} max={24} step={0.5} value={eligRate}
                onChange={(e) => setEligRate(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="label">Desired Tenure</label>
                <span className="font-bold text-navy">{eligTenure / 12} Years</span>
              </div>
              <input type="range" min={12} max={360} step={12} value={eligTenure}
                onChange={(e) => setEligTenure(Number(e.target.value))} className="w-full accent-gold" />
            </div>

            {/* Manual inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="label text-xs">Income (₹)</label>
                <input type="number" className="input-field text-sm py-2" value={income}
                  onChange={(e) => setIncome(Number(e.target.value))} />
              </div>
              <div>
                <label className="label text-xs">Existing EMI (₹)</label>
                <input type="number" className="input-field text-sm py-2" value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))} />
              </div>
              <div>
                <label className="label text-xs">Rate (%)</label>
                <input type="number" className="input-field text-sm py-2" step="0.5" value={eligRate}
                  onChange={(e) => setEligRate(Number(e.target.value))} />
              </div>
              <div>
                <label className="label text-xs">Tenure (Months)</label>
                <input type="number" className="input-field text-sm py-2" value={eligTenure}
                  onChange={(e) => setEligTenure(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-navy rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">Maximum Loan Eligibility</p>
              <p className="text-4xl font-extrabold text-gold">{formatINR(Math.round(maxLoan))}</p>
              <p className="text-gray-400 text-xs mt-1">based on 45% FOIR</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Monthly Income</p>
                <p className="font-bold text-navy">{formatINR(income)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Available for EMI</p>
                <p className="font-bold text-navy">{formatINR(Math.max(0, Math.round(maxEmi)))}</p>
              </div>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-gray-700">
              <strong className="text-navy">Note:</strong> This is an estimate based on 45% FOIR
              (Fixed Obligation to Income Ratio). Actual eligibility may vary by bank, CIBIL score,
              and loan type. Contact us for a precise assessment.
            </div>
            <a href="/apply" className="btn-primary w-full justify-center text-sm">
              Apply with this amount
            </a>
          </div>
        </div>
      )}

      {/* COMPARISON TAB */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {scenarios.map((s, idx) => {
              const scenEmi = Math.round(calcEMI(s.principal, s.rate, s.tenure));
              const scenTotal = scenEmi * s.tenure;
              const scenInterest = scenTotal - s.principal;
              return (
                <div key={idx} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-gold/40 transition-colors">
                  <input
                    className="font-bold text-navy mb-4 w-full border-0 outline-0 text-base"
                    value={s.label}
                    onChange={(e) => updateScenario(idx, "label", e.target.value)}
                  />
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400">Amount (₹)</label>
                      <input type="number" className="input-field py-1.5 text-sm" value={s.principal}
                        onChange={(e) => updateScenario(idx, "principal", Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Rate (%)</label>
                      <input type="number" step="0.1" className="input-field py-1.5 text-sm" value={s.rate}
                        onChange={(e) => updateScenario(idx, "rate", Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Tenure (months)</label>
                      <input type="number" className="input-field py-1.5 text-sm" value={s.tenure}
                        onChange={(e) => updateScenario(idx, "tenure", Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly EMI</span>
                      <span className="font-bold text-navy">{formatINR(scenEmi)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Interest</span>
                      <span className="font-medium text-gray-700">{formatINR(Math.round(scenInterest))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Payable</span>
                      <span className="font-medium text-gray-700">{formatINR(Math.round(scenTotal))}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar chart comparison */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-navy mb-4">EMI Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scenarios.map((s) => ({
                name: s.label,
                EMI: Math.round(calcEMI(s.principal, s.rate, s.tenure)),
                Interest: Math.round(calcEMI(s.principal, s.rate, s.tenure) * s.tenure - s.principal),
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => formatINR(Number(v))} />
                <Legend />
                <Bar dataKey="EMI" fill="#0B1D3E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interest" fill="#C9A227" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AMORTIZATION TAB */}
      {activeTab === "amortization" && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setAmorView("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amorView === "yearly" ? "bg-navy text-white" : "bg-gray-100 text-gray-600"}`}
              >Year-wise</button>
              <button
                onClick={() => setAmorView("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${amorView === "monthly" ? "bg-navy text-white" : "bg-gray-100 text-gray-600"}`}
              >Month-wise</button>
            </div>
            <button onClick={shareOnWhatsApp} className="btn-primary text-sm">
              <Share2 className="w-4 h-4" /> Share Summary
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-4 py-3">{amorView === "yearly" ? "Year" : "Month"}</th>
                  <th className="text-right px-4 py-3">Principal</th>
                  <th className="text-right px-4 py-3">Interest</th>
                  <th className="text-right px-4 py-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {(amorView === "yearly" ? yearlyData : schedule.slice(0, 60)).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2.5 font-medium text-navy">
                      {amorView === "yearly" ? `Year ${(row as any).year}` : `Month ${(row as any).month}`}
                    </td>
                    <td className="px-4 py-2.5 text-right text-green-700">{formatINR(row.principal)}</td>
                    <td className="px-4 py-2.5 text-right text-orange-600">{formatINR(row.interest)}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatINR(row.balance)}</td>
                  </tr>
                ))}
                {amorView === "monthly" && tenure > 60 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400 text-xs">
                      Showing first 60 months. Switch to Year-wise for full view.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gold/10 font-bold">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right text-green-700">{formatINR(principal)}</td>
                  <td className="px-4 py-3 text-right text-orange-600">{formatINR(Math.round(totalInterest))}</td>
                  <td className="px-4 py-3 text-right">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
