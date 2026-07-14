import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Heart, Search, ArrowRight, Sparkles, QrCode, KeyRound, Image as ImageIcon, Link2 } from 'lucide-react';
import AdBanner from '../components/AdBanner';

const tools = [
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days. Find out how many days until your next birthday.',
    icon: Calculator,
    path: '/age-calculator',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    category: 'General',
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Plan your investments with our SIP calculator. Estimate returns and build your wealth strategy.',
    icon: TrendingUp,
    path: '/sip-calculator',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    category: 'Finance',
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and understand your health metrics with personalized insights.',
    icon: Heart,
    path: '/bmi-calculator',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    category: 'Health',
  },
  {
    id: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create high-quality QR codes from any URL or text. Customize colors and download as an image.',
    icon: QrCode,
    path: '/qr-code-generator',
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
    category: 'Utility',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Create strong, random passwords with customizable length and character types for better security.',
    icon: KeyRound,
    path: '/password-generator',
    color: 'from-primary-500 to-primary-700',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
    category: 'Security',
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress and convert images between JPG, PNG, and WebP. All processing happens locally in your browser.',
    icon: ImageIcon,
    path: '/image-compressor',
    color: 'from-primary-500 to-primary-700',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
    category: 'Image Tools',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Turn long, messy links into clean short URLs stored locally in your browser. Copy and share with one click.',
    icon: Link2,
    path: '/url-shortener',
    color: 'from-primary-500 to-primary-700',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600',
    category: 'Utility',
  },
];

const categories = [
  { name: 'All', count: 3 },
  { name: 'General', count: 1 },
  { name: 'Finance', count: 1 },
  { name: 'Health', count: 1 },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Free Online Tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Your All-in-One
              <br />
              <span className="text-primary-200">Micro-Tool Hub</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10">
              Quick, accurate, and free calculators for your everyday needs. No sign-up required.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-base sm:text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gray-50" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </div>
      </section>

      {/* Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner format="horizontal" />
      </section>

      {/* Categories and Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.name
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${tool.textColor}`} />
                </div>

                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 ${tool.bgColor} ${tool.textColor} rounded-full text-xs font-medium mb-3`}>
                  {tool.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                  <span>Use Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}
      </section>

      {/* Middle Ad Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner format="horizontal" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tooler?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and accurate tools designed with you in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free</h3>
              <p className="text-gray-600">All tools are completely free to use, forever. No hidden charges or subscriptions.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Results</h3>
              <p className="text-gray-600">Our calculators are built with precision algorithms for reliable results every time.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Friendly</h3>
              <p className="text-gray-600">Clean, intuitive interfaces that make calculations quick and effortless.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
