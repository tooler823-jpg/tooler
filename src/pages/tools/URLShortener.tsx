import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, ArrowLeft, Copy, Check, QrCode, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const isValidUrl = (url: string): boolean => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    try {
      const parsed = new URL(url);
      return Boolean(parsed.hostname);
    } catch {
      return false;
    }
  };

  const handleInputChange = (val: string) => {
    setLongUrl(val);
    setCopied(false);
    if (val.trim() && !isValidUrl(val.trim())) {
      setError('URL must start with http:// or https:// and be valid');
    } else {
      setError('');
    }
  };

  const handleShorten = async () => {
    const url = longUrl.trim();
    if (!url) {
      setError('Please enter a URL to shorten');
      return;
    }
    if (!isValidUrl(url)) {
      setError('URL must start with http:// or https:// and be valid');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`TinyURL returned status ${response.status}`);
      }
      const text = await response.text();
      if (!text || text.startsWith('Error')) {
        throw new Error(text || 'TinyURL returned an empty response');
      }
      setShortUrl(text.trim());
    } catch {
      setError('Failed to shorten URL. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const handleSendToQR = () => {
    if (!shortUrl) return;
    navigate('/qr-code-generator', { state: { presetUrl: shortUrl } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <Link2 className="w-4 h-4" />
            <span>Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            URL Shortener
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Turn long URLs into clean, shareable short links using the TinyURL API. Copy with one click or send directly to our QR Code Generator.
          </p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Shorten a URL</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Long URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={longUrl}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleShorten()}
                placeholder="https://example.com/very/long/url"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900"
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 mt-2 text-sm text-rose-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
            {!error && (
              <p className="mt-2 text-xs text-gray-500">
                URL must start with http:// or https://
              </p>
            )}
          </div>

          <button
            onClick={handleShorten}
            disabled={loading || !longUrl.trim() || !!error}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Shortening...
              </>
            ) : (
              <>
                <Link2 className="w-5 h-5" />
                Shorten URL
              </>
            )}
          </button>

          {shortUrl && (
            <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="text-sm font-medium text-primary-700 mb-2">Your shortened URL</p>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-primary-200 p-3">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-primary-700 font-medium hover:text-primary-800 truncate"
                >
                  {shortUrl}
                </a>
                <ExternalLink className="w-4 h-4 text-primary-500 flex-shrink-0" />
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleSendToQR}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-primary-300 hover:bg-primary-50 text-primary-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  Send to QR Code
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Paste URL</h3>
                <p className="text-sm text-gray-600">Enter a long URL that starts with http:// or https://.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Shorten</h3>
                <p className="text-sm text-gray-600">Click Shorten to get a clean TinyURL short link.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Copy or QR</h3>
                <p className="text-sm text-gray-600">Copy the link or send it to the QR Code Generator.</p>
              </div>
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
