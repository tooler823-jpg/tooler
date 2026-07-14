import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  FileImage,
  X,
} from 'lucide-react';
import AdBanner from '../../components/AdBanner';

type OutputFormat = 'jpeg' | 'png' | 'webp';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formatOptions: { value: OutputFormat; label: string; mime: string }[] = [
  { value: 'jpeg', label: 'JPG', mime: 'image/jpeg' },
  { value: 'png', label: 'PNG', mime: 'image/png' },
  { value: 'webp', label: 'WebP', mime: 'image/webp' },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [processedUrl, setProcessedUrl] = useState('');
  const [processedSize, setProcessedSize] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const qualityDisabled = format === 'png';

  const loadFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOriginalUrl(url);
      };
      img.onerror = () => setError('Failed to load image. Please try another file.');
      img.src = url;
    };
    reader.onerror = () => setError('Failed to read file. Please try again.');
    reader.readAsDataURL(file);

    setOriginalFile(file);
    setOriginalSize(file.size);
    setError('');
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setOriginalSize(0);
    setProcessedUrl('');
    setProcessedSize(0);
    setProcessedBlob(null);
    setError('');
    setQuality(80);
    setFormat('jpeg');
    imgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!processedBlob || !originalFile) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const baseName = originalFile.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(processedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}-optimized.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Re-process image whenever inputs change
  useEffect(() => {
    if (!imgRef.current) return;

    setIsProcessing(true);
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // JPG doesn't support transparency — fill white background first
    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mime = formatOptions.find((f) => f.value === format)!.mime;
    const qualityArg = qualityDisabled ? undefined : quality / 100;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setIsProcessing(false);
          return;
        }
        setProcessedBlob(blob);
        setProcessedSize(blob.size);
        setProcessedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setIsProcessing(false);
      },
      mime,
      qualityArg
    );
  }, [originalUrl, quality, format, qualityDisabled]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [processedUrl]);

  const savings = originalSize > 0 ? originalSize - processedSize : 0;
  const savingsPercent = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : '0';
  const isSmaller = savings > 0;
  const hasResult = processedBlob !== null && originalFile !== null;

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
            <ImageIcon className="w-4 h-4" />
            <span>Image Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Image Compressor &amp; Converter
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Compress and convert images right in your browser. No uploads, no servers — your files never leave your device.
          </p>
        </div>

        {/* Ad Banner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input / Settings Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>

            {/* Upload Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {originalFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileImage className="w-8 h-8 text-primary-600 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{originalFile.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(originalSize)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag &amp; drop or click to browse
                    </p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, and WebP</p>
                  </>
                )}
              </div>
              {error && (
                <p className="flex items-center gap-1.5 mt-2 text-sm text-rose-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              )}
            </div>

            {/* Output Format */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert To</label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer pr-10"
                >
                  {formatOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Quality</label>
                <span
                  className={`text-sm font-semibold ${
                    qualityDisabled ? 'text-gray-400' : 'text-primary-600'
                  }`}
                >
                  {qualityDisabled ? 'Lossless' : `${quality}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={qualityDisabled}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
              {qualityDisabled && (
                <p className="text-xs text-gray-400 mt-2">
                  PNG is a lossless format — quality adjustment doesn't apply.
                </p>
              )}
            </div>

            {/* Reset Button */}
            {originalFile && (
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reset
              </button>
            )}
          </div>

          {/* Preview & Results Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Status Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 sm:p-8">
              <p className="text-primary-200 text-sm mb-1">Optimized Output</p>
              <p className="text-lg font-semibold">
                {hasResult
                  ? isProcessing
                    ? 'Processing...'
                    : 'Ready to download'
                  : 'Upload an image to begin'}
              </p>
            </div>

            {/* Preview */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center">
              {processedUrl && hasResult ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-xs bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center justify-center mb-4">
                    <img
                      src={processedUrl}
                      alt="Optimized preview"
                      className="max-w-full max-h-64 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {imgRef.current?.naturalWidth} × {imgRef.current?.naturalHeight}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Format</p>
                      <p className="text-sm font-semibold text-gray-900 uppercase">
                        {format === 'jpeg' ? 'JPG' : format}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Your optimized image preview will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Size Comparison */}
            {hasResult && (
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-sm font-bold text-gray-900">{formatBytes(originalSize)}</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-primary-600 mb-1">Optimized</p>
                    <p className="text-sm font-bold text-primary-700">{formatBytes(processedSize)}</p>
                  </div>
                  <div
                    className={`rounded-xl p-3 text-center ${
                      isSmaller ? 'bg-emerald-50' : 'bg-amber-50'
                    }`}
                  >
                    <p
                      className={`text-xs mb-1 flex items-center justify-center gap-1 ${
                        isSmaller ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {isSmaller ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      Savings
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        isSmaller ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isSmaller ? '-' : '+'}{Math.abs(Number(savingsPercent))}%
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Optimized Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Upload an Image</h3>
                <p className="text-sm text-gray-600">Drag &amp; drop or browse for a JPG, PNG, or WebP file.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Adjust Settings</h3>
                <p className="text-sm text-gray-600">Pick an output format and quality level to balance size and clarity.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Download</h3>
                <p className="text-sm text-gray-600">See the size difference instantly, then download your optimized image.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800">100% Private &amp; Local</p>
                <p className="text-sm text-emerald-700 mt-1">
                  All processing happens in your browser using the Canvas API. Your images are never uploaded to any server.
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
