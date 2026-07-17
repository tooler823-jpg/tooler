import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Copy, Check, RefreshCw } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return;

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password.length >= 16 ? { label: 'Strong', color: 'text-emerald-600' } : password.length >= 10 ? { label: 'Medium', color: 'text-amber-600' } : { label: 'Weak', color: 'text-rose-600' };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <KeyRound className="w-4 h-4" />
            <span>Security & Web Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Password Generator</h1>
          <p className="text-gray-600">Create strong, random passwords for better security.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-gray-50 rounded-xl p-4 font-mono text-lg break-all border border-gray-200">
              {password}
            </div>
            <button onClick={copy} className="p-3 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors" title="Copy">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button onClick={generate} className="p-3 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors" title="Regenerate">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Strength:</span>
            <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length: {length}</label>
              <input type="range" min={4} max={32} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Symbols (!@#$)</span>
              </label>
            </div>
            <button onClick={generate} className="btn-primary w-full">Generate New Password</button>
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
