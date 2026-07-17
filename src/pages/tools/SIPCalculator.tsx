import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('25000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<{ invested: number; returns: number; total: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(annualReturn) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!P || !r || !n) return;

    const total = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const returns = total - invested;
    setResult({ invested, returns, total });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Utility Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">SIP Calculator</h1>
          <p className="text-gray-600">Plan your investments and estimate your returns.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment (Rs)</label>
              <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="input-field" placeholder="25000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
              <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="input-field" placeholder="12" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="input-field pl-12" placeholder="10" />
              </div>
            </div>
            <button onClick={calculate} className="btn-primary w-full">Calculate Returns</button>
          </div>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-1">Total Maturity Value</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(result.total)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(result.invested)}</p>
                  <p className="text-xs text-gray-500">Invested Amount</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-emerald-700">{formatCurrency(result.returns)}</p>
                  <p className="text-xs text-emerald-600">Estimated Returns</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
