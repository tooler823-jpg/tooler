import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Send, Loader2, AlertCircle, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const toolOptions = [
  'General / Website', 'Age Calculator', 'SIP Calculator', 'BMI Calculator',
  'QR Code Generator', 'Password Generator', 'Image Compressor', 'URL Shortener',
  'PDF to JPEG Converter', 'JPEG to PDF Converter',
];

export default function Feedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tool, setTool] = useState(toolOptions[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const displayRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!message.trim()) { setError('Please write your suggestion or feedback.'); return; }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('feedback').insert({
        rating, tool, message: message.trim(),
        name: name.trim() || null, email: email.trim() || null,
      });
      if (insertError) throw insertError;
      setShowThankYou(true);
      setRating(0); setHoverRating(0); setTool(toolOptions[0]); setName(''); setEmail(''); setMessage('');
    } catch {
      setError('Failed to submit feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <ThumbsUp className="w-4 h-4" />
            <span>Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Rate Our Tools</h1>
          <p className="text-gray-600 max-w-lg mx-auto">Your feedback helps us improve. Rate your experience and share your suggestions — we read every submission.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        {showThankYou && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-800">Thank you for your feedback!</h3>
              <p className="text-sm text-emerald-700">We appreciate you taking the time to share your thoughts.</p>
            </div>
            <button onClick={() => setShowThankYou(false)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Dismiss</button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1 transition-transform hover:scale-110" aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>
                    <Star className={`w-9 h-9 transition-colors ${star <= displayRating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-300'}`} />
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-gray-600">{displayRating > 0 ? `${displayRating} / 5` : 'Click to rate'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which tool are you rating?</label>
              <select value={tool} onChange={(e) => setTool(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 bg-white">
                {toolOptions.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-gray-400">(optional)</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-gray-400">(optional)</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Write your suggestions</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you think, what we can improve, or what new tools you'd like to see..." rows={5} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 resize-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-xl transition-colors">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : (<><Send className="w-5 h-5" />Send Feedback</>)}
            </button>
          </form>
        </div>

        {user && (<p className="text-center text-sm text-gray-500 mt-4">Signed in as {user.email}</p>)}

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
