import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Link2, ArrowLeft, Download, Type, AlertCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import AdBanner from '../../components/AdBanner';

type InputMode = 'url' | 'text';

export default function QRCodeGenerator() {
  const location = useLocation();
  const [mode, setMode] = useState<InputMode>('url');
  const [input, setInput] = useState('');

  useEffect(() => {
    const state = location.state as { presetUrl?: string } | null;
    if (state?.presetUrl) {
      setMode('url');
      setInput(state.presetUrl);
    }
  }, [location.state]);
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#0c4a6e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  const value = input.trim();

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleReset = () => {
    setInput('');
    setError('');
    setMode('url');
    setSize(256);
    setFgColor('#0c4a6e');
    setBgColor('#ffffff');
    setIncludeMargin(true);
  };

  const handleModeChange = (next: InputMode) => {
    setMode(next);
    setError('');
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    if (mode === 'url' && val.trim() && !isValidUrl(val.trim())) {
      setError('Please enter a valid URL (e.g. https://example.com)');
    } else {
      setError('');
    }
  };

  const sizeOptions = [128, 256, 384, 512];

  const colorPresets = [
    { fg: '#0c4a6e', bg: '#ffffff', label: 'Ocean' },
    { fg: '#047857', bg: '#ffffff', label: 'Forest' },
    { fg: '#b91c1c', bg: '#ffffff', label: 'Crimson' },
    { fg: '#b45309', bg: '#fffbeb', label: 'Amber' },
    { fg: '#1f2937', bg: '#ffffff', label: 'Slate' },
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
            <QrCode className="w-4 h-4" />
            <span>Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            QR Code Generator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Convert any URL or text into a high-quality QR code instantly. Customize colors and size, then download as a PNG image.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Content</h2>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => handleModeChange('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  mode === 'url'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Link2 className="w-4 h-4" />
                URL
              </button>
              <button
                onClick={() => handleModeChange('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  mode === 'text'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Type className="w-4 h-4" />
                Text
              </button>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'url' ? 'Enter URL' : 'Enter Text'}
              </label>
              {mode === 'url' ? (
                <div className="relative">
                  <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900"
                  />
                </div>
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type or paste any text here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 resize-none"
                />
              )}
              {error && (
                <p className="flex items-center gap-1.5 mt-2 text-sm text-rose-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              )}
              {!error && (
                <p className="mt-2 text-xs text-gray-500">
                  {value.length}/ 1000 characters
                </p>
              )}
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Size
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSize(option)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      size === option
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option}px
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => {
                  const active = fgColor === preset.fg && bgColor === preset.bg;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setFgColor(preset.fg);
                        setBgColor(preset.bg);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? 'ring-2 ring-primary-500 ring-offset-1'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: preset.bg }}
                    >
                      <span
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <span className="text-gray-700">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 text-sm text-gray-700 outline-none w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 text-sm text-gray-700 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Margin toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Quiet Zone Margin</p>
                <p className="text-xs text-gray-500 mt-0.5">Adds white border for scannability</p>
              </div>
              <button
                onClick={() => setIncludeMargin(!includeMargin)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  includeMargin ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle margin"
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    includeMargin ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 sm:p-8">
              <p className="text-primary-200 text-sm mb-1">Live Preview</p>
              <p className="text-lg font-semibold">
                {value ? 'Your QR Code is Ready' : 'Enter content to generate'}
              </p>
            </div>

            <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center">
              {value && !error ? (
                <>
                  <div
                    ref={canvasRef}
                    className="rounded-2xl p-4 shadow-sm border border-gray-100"
                    style={{ backgroundColor: bgColor }}
                  >
                    <QRCodeCanvas
                      value={value}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="H"
                      includeMargin={includeMargin}
                      marginSize={includeMargin ? 4 : 0}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center max-w-xs truncate">
                    Encoding: {value}
                  </p>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {error
                      ? 'Fix the error above to see your QR code'
                      : 'Your QR code preview will appear here'}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!value || !!error}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                {value && (
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
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Add Content</h3>
                <p className="text-sm text-gray-600">Paste a URL or type text you want to encode.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Customize</h3>
                <p className="text-sm text-gray-600">Pick a size and color scheme to match your brand.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Download</h3>
                <p className="text-sm text-gray-600">Save your QR code as a PNG and share it anywhere.</p>
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

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str.includes('://') ? str : `https://${str}`);
    return Boolean(url.protocol && url.hostname);
  } catch {
    return false;
  }
}
