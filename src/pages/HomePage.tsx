import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator, TrendingUp, Heart, Search, ArrowRight, Sparkles,
  QrCode, KeyRound, Image as ImageIcon, Link2, FileText, FileImage,
  ChevronDown, ShieldCheck, Wrench, FolderArchive, Files,
} from 'lucide-react';
import AdBanner from '../components/AdBanner';

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  path: string;
  bgColor: string;
  textColor: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  icon: typeof Calculator;
  gradient: string;
  bgColor: string;
  textColor: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    id: 'utility-calculators',
    name: 'Utility Calculators',
    description: 'Everyday calculators for age, health, and finance.',
    icon: Wrench,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    tools: [
      { id: 'age-calculator', title: 'Age Calculator', description: 'Calculate your exact age in years, months, and days. Find out how many days until your next birthday.', icon: Calculator, path: '/age-calculator', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
      { id: 'bmi-calculator', title: 'BMI Calculator', description: 'Calculate your Body Mass Index and understand your health metrics with personalized insights.', icon: Heart, path: '/bmi-calculator', bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
      { id: 'sip-calculator', title: 'SIP Calculator', description: 'Plan your investments with our SIP calculator. Estimate returns and build your wealth strategy.', icon: TrendingUp, path: '/sip-calculator', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    ],
  },
  {
    id: 'security-web-tools',
    name: 'Security & Web Tools',
    description: 'Generate QR codes, strong passwords, and short links.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    tools: [
      { id: 'qr-code-generator', title: 'QR Code Generator', description: 'Create high-quality QR codes from any URL or text. Customize colors and download as an image.', icon: QrCode, path: '/qr-code-generator', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
      { id: 'password-generator', title: 'Password Generator', description: 'Create strong, random passwords with customizable length and character types for better security.', icon: KeyRound, path: '/password-generator', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
      { id: 'url-shortener', title: 'URL Shortener', description: 'Turn long URLs into clean short links using TinyURL. Copy with one click or send directly to our QR Code Generator.', icon: Link2, path: '/url-shortener', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    description: 'Compress and convert images right in your browser.',
    icon: FolderArchive,
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    tools: [
      { id: 'image-compressor', title: 'Image Compressor', description: 'Compress and convert images between JPG, PNG, and WebP. All processing happens locally in your browser.', icon: ImageIcon, path: '/image-compressor', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
    ],
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Convert between PDF and image formats easily.',
    icon: Files,
    gradient: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    tools: [
      { id: 'pdf-to-jpeg', title: 'PDF to JPEG Converter', description: 'Convert PDF pages into high-quality JPEG images. Preview each page and download individually or all at once.', icon: FileImage, path: '/pdf-to-jpeg', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
      { id: 'jpeg-to-pdf', title: 'JPEG to PDF Converter', description: 'Combine multiple images into a single PDF document. Drag to reorder, choose page size, orientation, and margins.', icon: FileText, path: '/jpeg-to-pdf', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
    ],
  },
];

const allTools = categories.flatMap((c) => c.tools);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        tools: category.tools.filter(
          (tool) =>
            tool.title.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q)
        ),
      }))
      .filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
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
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner format="horizontal" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Explore by Category</h2>
          <p className="text-gray-600">
            {allTools.length} tools across {categories.length} categories — all free, no sign-up needed.
          </p>
        </div>

        <div className="space-y-5">
          {filteredCategories.map((category) => {
            const CatIcon = category.icon;
            const isExpanded = expandedCategories.has(category.id);
            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <CatIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{category.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.bgColor} ${category.textColor}`}>
                        {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} group-hover:text-gray-600`} />
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.tools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <Link key={tool.id} to={tool.path} className="group relative bg-gray-50 rounded-xl p-5 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                              <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 ${tool.textColor}`} />
                              </div>
                              <h4 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-primary-600 transition-colors">{tool.title}</h4>
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{tool.description}</p>
                              <div className="flex items-center gap-1.5 text-sm font-medium text-primary-600">
                                <span>Use Tool</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try adjusting your search.</p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner format="horizontal" />
      </section>

      <section className="bg-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Tooler?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple, fast, and accurate tools designed with you in mind.</p>
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
