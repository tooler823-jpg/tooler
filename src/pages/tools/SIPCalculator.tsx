import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, DollarSign, Target, ArrowLeft, PieChart } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

interface YearlyBreakdown {
  year: number;
  invested: number;
  returns: number;
  totalValue: number;
}

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculations = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    const totalInvested = monthlyInvestment * totalMonths;

    // Future Value of SIP: P × ({[1 + i]^n – 1} / i) × (1 + i)
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalReturns = futureValue - totalInvested;

    // Yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let cumulativeInvested = 0;
    let cumulativeValue = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const monthsInYear = 12;
      const yearStartInvested = cumulativeInvested;
      const yearStartValue = cumulativeValue;

      for (let month = 0; month < monthsInYear; month++) {
        cumulativeInvested += monthlyInvestment;
        cumulativeValue = (cumulativeValue + monthlyInvestment) * (1 + monthlyRate);
      }

      const yearInvested = cumulativeInvested - yearStartInvested;
      const yearReturns = cumulativeValue - yearStartValue - yearInvested;

      yearlyBreakdown.push({
        year,
        invested: cumulativeInvested,
        returns: yearReturns,
        totalValue: cumulativeValue,
      });
    }

    return {
      totalInvested,
      totalReturns,
      futureValue,
      yearlyBreakdown,
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Finance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            SIP Investment Calculator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Plan your wealth journey. Calculate returns on your Systematic Investment Plan and see how your money can grow.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Investment Details</h2>

            {/* Monthly Investment */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Monthly Investment</label>
                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="500000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹500</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Expected Return Rate (p.a.)</label>
                <span className="text-sm font-semibold text-emerald-600">{expectedReturn}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Time Period</label>
                <span className="text-sm font-semibold text-emerald-600">{timePeriod} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Year</span>
                <span>40 Years</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500 mb-3">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {[1000, 5000, 10000, 25000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyInvestment(preset)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      monthlyInvestment === preset
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Total Value */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 sm:p-8">
              <p className="text-emerald-200 text-sm mb-1">Estimated Total Value</p>
              <p className="text-4xl sm:text-5xl font-bold">
                {formatCurrency(calculations.futureValue)}
              </p>
            </div>

            {/* Breakdown */}
            <div className="p-6 sm:p-8">
              {/* Visual Breakdown */}
              <div className="mb-6">
                <div className="h-4 rounded-full bg-gray-200 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(calculations.totalInvested / calculations.futureValue) * 100}%` }}
                  />
                  <div
                    className="bg-emerald-300 h-full"
                    style={{ width: `${(calculations.totalReturns / calculations.futureValue) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-gray-600">Invested</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    <span className="text-gray-600">Returns</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Total Invested</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(calculations.totalInvested)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Estimated Returns</span>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatCurrency(calculations.totalReturns)}
                  </p>
                </div>
              </div>

              {/* Percentage Gain */}
              <div className="mt-6 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wealth Gain</p>
                    <p className="text-lg font-semibold text-emerald-700">
                      {((calculations.totalReturns / calculations.totalInvested) * 100).toFixed(1)}% Growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Breakdown Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Year-by-Year Breakdown</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calculations.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Year {row.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {formatCurrency(row.invested)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 text-right">
                      {formatCurrency(row.totalValue - row.invested)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(row.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Ad */}
        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
