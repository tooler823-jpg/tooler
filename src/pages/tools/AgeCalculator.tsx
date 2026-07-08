import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Calendar, Gift, Clock, ArrowLeft, ChevronDown } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthday: {
    days: number;
    date: Date;
  };
  dayOfBirth: string;
  zodiacSign: string;
}

const zodiacSigns = [
  { name: 'Capricorn', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', start: [2, 19], end: [3, 20] },
  { name: 'Aries', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', start: [6, 21], end: [7, 22] },
  { name: 'Leo', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getZodiacSign(month: number, day: number): string {
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return sign.name;
      }
    } else if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign.name;
    }
  }
  return 'Unknown';
}

function calculateAge(birthDate: Date): AgeResult {
  const today = new Date();
  const birth = new Date(birthDate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Calculate next birthday
  let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const dayOfBirth = dayNames[birth.getDay()];
  const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    nextBirthday: {
      days: daysUntilBirthday,
      date: nextBirthday,
    },
    dayOfBirth,
    zodiacSign,
  };
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    if (birth > new Date()) {
      alert('Birth date cannot be in the future');
      return;
    }

    const ageResult = calculateAge(birth);
    setResult(ageResult);
    setShowResults(true);
  };

  const handleReset = () => {
    setBirthDate('');
    setResult(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Calculator className="w-4 h-4" />
            <span>General</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Age Calculator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Find your exact age in years, months, and days. Discover interesting facts about your birth date.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 sm:p-8">
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Birth Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!birthDate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Calculate Age
                </button>
                {showResults && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {showResults && result && (
            <div className="border-t border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8">
              {/* Main Age Display */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 mb-2">Your Age</p>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                    <span className="text-4xl sm:text-5xl font-bold text-blue-600">{result.years}</span>
                    <p className="text-sm text-gray-600 mt-1">Years</p>
                  </div>
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                    <span className="text-4xl sm:text-5xl font-bold text-blue-600">{result.months}</span>
                    <p className="text-sm text-gray-600 mt-1">Months</p>
                  </div>
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
                    <span className="text-4xl sm:text-5xl font-bold text-blue-600">{result.days}</span>
                    <p className="text-sm text-gray-600 mt-1">Days</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{result.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Days</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{result.totalWeeks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Weeks</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{(result.totalHours / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">Total Hours</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Gift className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900">{result.nextBirthday.days}</p>
                  <p className="text-xs text-gray-500">Days to Birthday</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Born on</p>
                    <p className="font-medium text-gray-900">{result.dayOfBirth}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zodiac Sign</p>
                    <p className="font-medium text-gray-900">{result.zodiacSign}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Birthday</p>
                    <p className="font-medium text-gray-900">
                      {result.nextBirthday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Ad */}
        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
