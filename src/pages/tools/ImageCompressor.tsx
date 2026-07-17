import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Upload, Download, Loader2 } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('compressed');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => setOriginalImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!originalImage) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setLoading(false); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setCompressedImage(ev.target?.result as string);
            setCompressedSize(blob.size);
          };
          reader.readAsDataURL(blob);
        }
        setLoading(false);
      }, `image/${format}`, quality);
    };
    img.onerror = () => setLoading(false);
    img.src = originalImage;
  };

  const download = () => {
    if (!compressedImage) return;
    const a = document.createElement('a');
    a.href = compressedImage;
    a.download = `${fileName}.${format}`;
    a.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const reduction = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 text-sm font-medium text-amber-700 mb-4">
            <ImageIcon className="w-4 h-4" />
            <span>Image Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Image Compressor</h1>
          <p className="text-gray-600">Compress and convert images between JPG, PNG, and WebP. All processing happens locally.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{originalImage ? 'Change image' : 'Click to upload an image'}</p>
          </button>

          {originalImage && (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-2">Original: {formatBytes(originalSize)}</p>
                <img src={originalImage} alt="Original" className="max-h-48 rounded-lg mx-auto" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png' | 'webp')} className="input-field bg-white">
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {Math.round(quality * 100)}%</label>
                <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
              </div>

              <button onClick={compress} disabled={loading} className="btn-primary w-full disabled:bg-gray-300 flex items-center justify-center gap-2">
                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Compressing...</>) : 'Compress Image'}
              </button>

              {compressedImage && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Compressed: {formatBytes(compressedSize)}</p>
                    <p className="text-sm font-semibold text-emerald-600">{reduction}% smaller</p>
                  </div>
                  <img src={compressedImage} alt="Compressed" className="max-h-48 rounded-lg mx-auto mb-4" />
                  <button onClick={download} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
