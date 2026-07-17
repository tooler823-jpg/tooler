import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Calendar } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; totalMonths: number; totalWeeks: number; totalHours: number } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (birth > target) return;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

    setResult({ years, months, days, totalDays, totalMonths, totalWeeks, totalHours });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Calculator className="w-4 h-4" />
            <span>Utility Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Age Calculator</h1>
          <p className="text-gray-600">Calculate your exact age in years, months, and days.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-field pl-12" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age at Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="input-field pl-12" />
              </div>
            </div>
            <button onClick={calculateAge} disabled={!birthDate} className="btn-primary w-full disabled:bg-gray-300">
              Calculate Age
            </button>
          </div>

          {result && (
            <div className="mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">Your age is</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {result.years} years, {result.months} months, {result.days} days
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.totalMonths.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Months</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.totalWeeks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Weeks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.totalHours.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Hours</p>
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
