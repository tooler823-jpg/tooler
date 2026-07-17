import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Link2, Copy, Check, Loader2, AlertCircle, QrCode } from 'lucide-react';
import AdBanner from '../../components/AdBanner';
import { useNavigate } from 'react-router-dom';

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const shorten = async () => {
    setError('');
    setShortUrl('');
    if (!longUrl.trim()) { setError('Please enter a URL.'); return; }
    if (!/^https?:\/\//.test(longUrl.trim())) { setError('URL must start with http:// or https://'); return; }

    setLoading(true);
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl.trim())}`);
      if (!res.ok) throw new Error('Failed to shorten URL');
      const text = await res.text();
      if (!text.startsWith('http')) throw new Error('Invalid response');
      setShortUrl(text);
    } catch {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToQR = () => {
    if (shortUrl) navigate('/qr-code-generator');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <Link2 className="w-4 h-4" />
            <span>Security & Web Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">URL Shortener</h1>
          <p className="text-gray-600">Turn long URLs into clean short links using TinyURL.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
              <input type="url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} className="input-field" placeholder="https://example.com/very/long/url..." />
            </div>
            <button onClick={shorten} disabled={loading} className="btn-primary w-full disabled:bg-gray-300 flex items-center justify-center gap-2">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Shortening...</>) : 'Shorten URL'}
            </button>
          </div>

          {shortUrl && (
            <div className="mt-6">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <span className="flex-1 font-mono text-sm text-gray-900 break-all">{shortUrl}</span>
                <button onClick={copy} className="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <button onClick={sendToQR} className="btn-secondary w-full mt-3 flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4" />
                Send to QR Code Generator
              </button>
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
