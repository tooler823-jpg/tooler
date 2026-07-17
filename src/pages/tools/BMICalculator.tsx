import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;

    let bmi: number;
    if (unit === 'metric') {
      bmi = w / ((h / 100) * (h / 100));
    } else {
      bmi = (w / (h * h)) * 703;
    }
    bmi = Math.round(bmi * 10) / 10;

    let category = '';
    let color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600'; }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-emerald-600'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-amber-600'; }
    else { category = 'Obese'; color = 'text-rose-600'; }

    setResult({ bmi, category, color });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2 text-sm font-medium text-rose-700 mb-4">
            <Heart className="w-4 h-4" />
            <span>Utility Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">BMI Calculator</h1>
          <p className="text-gray-600">Calculate your Body Mass Index and understand your health metrics.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setUnit('metric')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Metric (cm/kg)</button>
            <button onClick={() => setUnit('imperial')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Imperial (in/lb)</button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" placeholder={unit === 'metric' ? '170' : '67'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input-field" placeholder={unit === 'metric' ? '70' : '154'} />
            </div>
            <button onClick={calculate} className="btn-primary w-full">Calculate BMI</button>
          </div>

          {result && (
            <div className="mt-8">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-1">Your BMI is</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">{result.bmi}</p>
                <p className={`text-lg font-semibold ${result.color}`}>{result.category}</p>
              </div>
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
