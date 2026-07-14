import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  ArrowLeft,
  Copy,
  Check,
  Scissors,
  AlertCircle,
  ExternalLink,
  Trash2,
  Clock,
  History,
} from 'lucide-react';
import AdBanner from '../../components/AdBanner';

const SHORT_DOMAIN = 'tooler.app';
const STORAGE_KEY = 'tooler_shortened_links';
const ID_LENGTH = 6;

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
}

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateShortCode(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += BASE62[bytes[i] % 62];
  }
  return code;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str.includes('://') ? str : `https://${str}`);
    return Boolean(url.protocol && url.hostname);
  } catch {
    return false;
  }
}

function normalizeUrl(str: string): string {
  return str.includes('://') ? str : `https://${str}`;
}

function loadLinks(): ShortenedLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveLinks(links: ShortenedLink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function URLShortener() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLinks(loadLinks());
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleShorten = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a URL to shorten.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Please enter a valid URL (e.g. https://example.com/very/long/path)');
      return;
    }

    const normalized = normalizeUrl(trimmed);
    let code = generateShortCode(ID_LENGTH);
    const existing = new Set(links.map((l) => l.shortCode));
    while (existing.has(code)) code = generateShortCode(ID_LENGTH);

    const newLink: ShortenedLink = {
      id: `${Date.now()}-${code}`,
      originalUrl: normalized,
      shortCode: code,
      createdAt: Date.now(),
    };

    const updated = [newLink, ...links].slice(0, 50);
    setLinks(updated);
    saveLinks(updated);
    setInput('');
    setError('');
  }, [input, links]);

  const handleCopy = useCallback((shortCode: string) => {
    const shortUrl = `${SHORT_DOMAIN}/${shortCode}`;
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        setCopiedId(shortCode);
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = shortUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedId(shortCode);
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopiedId(null), 2000);
      });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const updated = links.filter((l) => l.id !== id);
      setLinks(updated);
      saveLinks(updated);
    },
    [links]
  );

  const handleClearAll = useCallback(() => {
    setLinks([]);
    saveLinks([]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleShorten();
  };

  const latest = links[0];

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
            <Link2 className="w-4 h-4" />
            <span>Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            URL Shortener
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Turn long, messy links into clean short URLs. Everything is stored locally in your browser — no account or server required.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        {/* Shortener Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Shorten a Link</h2>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Paste your long URL here..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900"
              />
            </div>
            <button
              onClick={handleShorten}
              disabled={!input.trim()}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-colors whitespace-nowrap"
            >
              <Scissors className="w-5 h-5" />
              Shorten
            </button>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 mt-3 text-sm text-rose-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* Latest Result */}
          {latest && (
            <div className="mt-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8">
              <p className="text-primary-200 text-sm mb-2">Your shortened link</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <p className="font-mono text-lg sm:text-xl font-bold text-white break-all">
                    {SHORT_DOMAIN}/{latest.shortCode}
                  </p>
                  <p className="text-xs text-primary-200 mt-1 truncate">
                    &rarr; {latest.originalUrl}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(latest.shortCode)}
                  className={`flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-xl transition-all whitespace-nowrap ${
                    copiedId === latest.shortCode
                      ? 'bg-accent-500 text-white'
                      : 'bg-white text-primary-700 hover:bg-gray-100'
                  }`}
                >
                  {copiedId === latest.shortCode ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {links.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">History</h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                  {links.length}
                </span>
              </div>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:px-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Short link */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-sm font-semibold text-gray-900 truncate">
                        {SHORT_DOMAIN}/{link.shortCode}
                      </p>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 transition-colors flex-shrink-0"
                        title="Open original URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {link.originalUrl}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(link.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(link.shortCode)}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedId === link.shortCode
                          ? 'bg-accent-100 text-accent-600'
                          : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'
                      }`}
                      title="Copy short link"
                    >
                      {copiedId === link.shortCode ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State History */}
        {links.length === 0 && !latest && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No shortened links yet</h3>
            <p className="text-sm text-gray-500">
              Paste a URL above and hit Shorten to get started.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Paste a URL</h3>
                <p className="text-sm text-gray-600">Enter any long web address you want to shorten.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Shorten It</h3>
                <p className="text-sm text-gray-600">A unique 6-character short code is generated using secure random values.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Copy &amp; Share</h3>
                <p className="text-sm text-gray-600">Copy the short link with one click and share it anywhere.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Client-Side Demo</p>
                <p className="text-sm text-amber-700 mt-1">
                  This tool generates short codes locally using <code className="text-xs bg-amber-100 px-1.5 py-0.5 rounded">crypto.getRandomValues</code> and stores your history in your browser. Short links are not resolvable outside this app — it's a front-end demonstration of the shortening flow.
                </p>
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
