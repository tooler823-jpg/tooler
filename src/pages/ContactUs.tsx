import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, User, Send, Loader2, AlertCircle, CheckCircle2, MapPin, Clock } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { supabase } from '../lib/supabase';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name.trim() || !email.trim() || !message.trim()) { setError('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('contact_messages').insert({ name: name.trim(), email: email.trim(), message: message.trim() });
      if (insertError) throw insertError;
      setSuccess(true);
      setName(''); setEmail(''); setMessage('');
    } catch {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <Mail className="w-4 h-4" />
            <span>Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-lg mx-auto">Have a question, suggestion, or need help? Fill out the form below and we'll get back to you.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-3"><Mail className="w-5 h-5 text-primary-600" /></div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-600">support@tooler.app</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-primary-600" /></div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Response Time</h3>
              <p className="text-sm text-gray-600">Within 24–48 hours</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-3"><MapPin className="w-5 h-5 text-primary-600" /></div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Availability</h3>
              <p className="text-sm text-gray-600">Online tools, available 24/7 worldwide</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {success && (
                <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">Message sent successfully!</p>
                    <p className="text-sm text-emerald-700">Thank you for reaching out. We'll get back to you soon.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows={5} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : (<><Send className="w-5 h-5" />Submit</>)}
                </button>
              </form>
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
