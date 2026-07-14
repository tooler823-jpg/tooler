import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Copy, Check, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

const CHAR_SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

interface Options {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

function generatePassword(length: number, options: Options): string {
  let pool = '';
  const guaranteed: string[] = [];

  (Object.keys(CHAR_SETS) as (keyof Options)[]).forEach((key) => {
    if (options[key]) {
      pool += CHAR_SETS[key];
      const chars = CHAR_SETS[key];
      guaranteed.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  });

  if (!pool) return '';

  const remaining = length - guaranteed.length;
  const chars: string[] = [...guaranteed];
  for (let i = 0; i < Math.max(0, remaining); i++) {
    chars.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, length).join('');
}

function getStrength(password: string, options: Options): {
  label: string;
  score: number;
  color: string;
  barColor: string;
  bgColor: string;
} {
  if (!password) {
    return { label: 'None', score: 0, color: 'text-gray-400', barColor: 'bg-gray-200', bgColor: 'bg-gray-50' };
  }

  let poolSize = 0;
  if (options.upper) poolSize += 26;
  if (options.lower) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 25;

  const entropy = password.length * Math.log2(poolSize || 1);

  if (entropy < 40) {
    return { label: 'Weak', score: 1, color: 'text-rose-600', barColor: 'bg-rose-500', bgColor: 'bg-rose-50' };
  } else if (entropy < 60) {
    return { label: 'Fair', score: 2, color: 'text-amber-600', barColor: 'bg-amber-500', bgColor: 'bg-amber-50' };
  } else if (entropy < 80) {
    return { label: 'Strong', score: 3, color: 'text-emerald-600', barColor: 'bg-emerald-500', bgColor: 'bg-emerald-50' };
  }
  return { label: 'Very Strong', score: 4, color: 'text-emerald-700', barColor: 'bg-emerald-600', bgColor: 'bg-emerald-50' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<Options>({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const noOptionSelected = !options.upper && !options.lower && !options.numbers && !options.symbols;

  const handleGenerate = useCallback(() => {
    if (noOptionSelected) return;
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options, noOptionSelected]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  const handleToggle = (key: keyof Options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    setCopied(false);
  };

  const strength = useMemo(() => getStrength(password, options), [password, options]);

  const optionConfig: { key: keyof Options; label: string; sample: string }[] = [
    { key: 'upper', label: 'Uppercase (A-Z)', sample: 'ABC' },
    { key: 'lower', label: 'Lowercase (a-z)', sample: 'abc' },
    { key: 'numbers', label: 'Numbers (0-9)', sample: '012' },
    { key: 'symbols', label: 'Symbols (!@#$)', sample: '!@#' },
  ];

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
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <KeyRound className="w-4 h-4" />
            <span>Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Secure Password Generator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Create strong, random passwords to keep your accounts secure. Choose your length and character types, then copy with one click.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>

            {/* Length Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Password Length</label>
                <span className="text-sm font-semibold text-primary-600">{length} characters</span>
              </div>
              <input
                type="range"
                min="6"
                max="32"
                step="1"
                value={length}
                onChange={(e) => {
                  setLength(Number(e.target.value));
                  setCopied(false);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6</span>
                <span>32</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Character Types</p>
              <div className="space-y-2">
                {optionConfig.map((opt) => {
                  const checked = options[opt.key];
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleToggle(opt.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        checked
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            checked ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                      </div>
                      <span className={`text-xs font-mono ${checked ? 'text-primary-600' : 'text-gray-400'}`}>
                        {opt.sample}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={noOptionSelected}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Password
            </button>

            {noOptionSelected && (
              <p className="flex items-center gap-1.5 mt-3 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Select at least one character type.
              </p>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Password Display */}
            <div className={`p-6 sm:p-8 ${strength.bgColor} transition-colors duration-300`}>
              <p className="text-sm text-gray-600 mb-2">Generated Password</p>
              {password ? (
                <p className="font-mono text-xl sm:text-2xl font-bold text-gray-900 break-all leading-snug tracking-tight">
                  {password}
                </p>
              ) : (
                <p className="font-mono text-xl sm:text-2xl font-bold text-gray-300 break-all">
                  Click generate to create a password
                </p>
              )}
            </div>

            {/* Copy Button */}
            <div className="p-6 border-b border-gray-100">
              <button
                onClick={handleCopy}
                disabled={!password}
                className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-xl transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            {/* Strength Meter */}
            <div className="p-6 sm:p-8 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${strength.color}`} />
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                </div>
                <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
              </div>

              {/* Strength Bar */}
              <div className="flex gap-1.5 mb-6">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                      bar <= strength.score ? strength.barColor : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Length</p>
                  <p className="text-lg font-bold text-gray-900">{password ? length : 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Character Pool</p>
                  <p className="text-lg font-bold text-gray-900">
                    {password
                      ? (options.upper ? 26 : 0) +
                        (options.lower ? 26 : 0) +
                        (options.numbers ? 10 : 0) +
                        (options.symbols ? 25 : 0)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Password Security Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Use 16+ characters</h3>
                <p className="text-sm text-gray-600">Longer passwords are exponentially harder to crack.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Mix character types</h3>
                <p className="text-sm text-gray-600">Combine upper, lower, numbers, and symbols for maximum entropy.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Use a unique password</h3>
                <p className="text-sm text-gray-600">Never reuse passwords across multiple accounts.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Store in a password manager</h3>
                <p className="text-sm text-gray-600">Let a trusted manager remember them so you don't have to.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad */}
        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
