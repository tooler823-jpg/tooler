import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, Ruler, ArrowLeft, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryDescription: string;
  idealWeightRange: {
    min: number;
    max: number;
  };
  healthRisk: string;
  color: string;
  bgColor: string;
}

function calculateBMI(weight: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let category: BMICategory;
  let categoryLabel: string;
  let categoryDescription: string;
  let healthRisk: string;
  let color: string;
  let bgColor: string;

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = 'Underweight';
    categoryDescription = 'Your BMI indicates you may be underweight for your height.';
    healthRisk = 'Increased risk of nutritional deficiency, osteoporosis, and weakened immune system.';
    color = 'text-blue-600';
    bgColor = 'bg-blue-50';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'normal';
    categoryLabel = 'Normal Weight';
    categoryDescription = 'Congratulations! Your BMI indicates a healthy weight for your height.';
    healthRisk = 'Lowest risk of developing weight-related health conditions.';
    color = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'overweight';
    categoryLabel = 'Overweight';
    categoryDescription = 'Your BMI indicates you may be overweight for your height.';
    healthRisk = 'Increased risk of heart disease, high blood pressure, and type 2 diabetes.';
    color = 'text-amber-600';
    bgColor = 'bg-amber-50';
  } else {
    category = 'obese';
    categoryLabel = 'Obese';
    categoryDescription = 'Your BMI indicates obesity. Consider consulting a healthcare professional.';
    healthRisk = 'High risk of heart disease, stroke, type 2 diabetes, and certain cancers.';
    color = 'text-rose-600';
    bgColor = 'bg-rose-50';
  }

  // Calculate ideal weight range (BMI 18.5-24.9)
  const idealWeightMin = 18.5 * (heightM * heightM);
  const idealWeightMax = 24.9 * (heightM * heightM);

  return {
    bmi,
    category,
    categoryLabel,
    categoryDescription,
    idealWeightRange: {
      min: Math.round(idealWeightMin * 10) / 10,
      max: Math.round(idealWeightMax * 10) / 10,
    },
    healthRisk,
    color,
    bgColor,
  };
}

export default function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => calculateBMI(weight, height), [weight, height]);

  const bmiScale = [
    { range: '<18.5', label: 'Underweight', color: 'bg-blue-500', start: 0, end: 18.5 },
    { range: '18.5-24.9', label: 'Normal', color: 'bg-emerald-500', start: 18.5, end: 25 },
    { range: '25-29.9', label: 'Overweight', color: 'bg-amber-500', start: 25, end: 30 },
    { range: '≥30', label: 'Obese', color: 'bg-rose-500', start: 30, end: 40 },
  ];

  const getMarkerPosition = (bmi: number) => {
    const minBMI = 15;
    const maxBMI = 40;
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
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
          <div className="inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2 text-sm font-medium text-rose-700 mb-4">
            <Heart className="w-4 h-4" />
            <span>Health</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            BMI Health Calculator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Calculate your Body Mass Index and understand your health status. Get personalized insights for a healthier lifestyle.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Enter Your Details</h2>

            {/* Weight */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  Weight (kg)
                </label>
                <span className="text-sm font-semibold text-rose-600">{weight} kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="0.5"
                value={weight}
                onChange={(e) => {
                  setWeight(Number(e.target.value));
                  setShowResults(true);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>

            {/* Height */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  Height (cm)
                </label>
                <span className="text-sm font-semibold text-rose-600">{height} cm</span>
              </div>
              <input
                type="range"
                min="120"
                max="250"
                step="1"
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  setShowResults(true);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>120 cm</span>
                <span>250 cm</span>
              </div>
            </div>

            {/* Height Quick Values */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500 mb-3">Quick Height Presets</p>
              <div className="flex flex-wrap gap-2">
                {[150, 160, 165, 170, 175, 180, 185, 190].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setHeight(preset);
                      setShowResults(true);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      height === preset
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset} cm
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* BMI Display */}
            <div className={`${result.bgColor} p-6 sm:p-8 text-center`}>
              <p className="text-sm text-gray-600 mb-1">Your BMI</p>
              <p className={`text-5xl sm:text-6xl font-bold ${result.color}`}>
                {result.bmi.toFixed(1)}
              </p>
              <p className={`text-lg font-semibold mt-2 ${result.color}`}>
                {result.categoryLabel}
              </p>
            </div>

            {/* BMI Scale */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <div className="h-3 rounded-full overflow-hidden flex">
                  {bmiScale.map((segment, index) => (
                    <div
                      key={index}
                      className={`${segment.color} flex-1`}
                    />
                  ))}
                </div>
                {showResults && (
                  <div
                    className="absolute top-0 w-1 h-3 bg-gray-900 rounded-full transform -translate-x-1/2 transition-all duration-300"
                    style={{ left: `${getMarkerPosition(result.bmi)}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            {/* Category Details */}
            <div className="p-6 sm:p-8">
              {/* Status Icon */}
              <div className="flex items-start gap-3 mb-6">
                {result.category === 'normal' ? (
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                ) : result.category === 'underweight' ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{result.categoryDescription}</p>
                  <p className="text-sm text-gray-600 mt-1">{result.healthRisk}</p>
                </div>
              </div>

              {/* Ideal Weight Range */}
              <div className={`rounded-xl p-4 ${result.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className={`w-4 h-4 ${result.color}`} />
                  <span className="text-sm font-medium text-gray-700">Ideal Weight Range for Your Height</span>
                </div>
                <p className={`text-lg font-bold ${result.color}`}>
                  {result.idealWeightRange.min} kg - {result.idealWeightRange.max} kg
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on BMI range 18.5 - 24.9
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BMI Categories Reference Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">BMI Categories Reference</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className={result.category === 'underweight' ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Underweight</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Below 18.5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nutritional deficiency risk</td>
                </tr>
                <tr className={result.category === 'normal' ? 'bg-emerald-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Normal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">18.5 - 24.9</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">Lowest health risk</td>
                </tr>
                <tr className={result.category === 'overweight' ? 'bg-amber-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Overweight</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">25 - 29.9</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">Moderate risk</td>
                </tr>
                <tr className={result.category === 'obese' ? 'bg-rose-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Obese</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">30 and above</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600">High risk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Medical Disclaimer</p>
              <p className="text-sm text-amber-700 mt-1">
                BMI is a general indicator and may not account for muscle mass, bone density, age, and other factors.
                Consult a healthcare professional for personalized health advice.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Ad */}
        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
