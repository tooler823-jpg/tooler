import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Upload,
  Download,
  Loader2,
  AlertCircle,
  X,
  GripVertical,
} from 'lucide-react';
import AdBanner from '../../components/AdBanner';

type UploadedImage = {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
};

type PageSize = 'a4' | 'letter';
type Orientation = 'portrait' | 'landscape';
type Margin = 'none' | 'small' | 'medium' | 'large';

const marginValues: Record<Margin, number> = {
  none: 0,
  small: 10,
  medium: 20,
  large: 30,
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function JPEGToPDF() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState<Margin>('small');
  const [dragId, setDragId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error(`${file.name} is not an image`));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: file.name,
            dataUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: file.size,
          });
        };
        img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setError('Please upload image files (JPEG, PNG, WebP, etc.)');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const loaded = await Promise.all(fileArray.map(loadImage));
      setImages((prev) => [...prev, ...loaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragId === null || dragId === id) return;
    setImages((prev) => {
      const fromIndex = prev.findIndex((img) => img.id === dragId);
      const toIndex = prev.findIndex((img) => img.id === id);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages;
    });
  };
  const handleDragEnd = () => setDragId(null);

  const generatePDF = async () => {
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { jsPDF } = await import('jspdf');
      const marginVal = marginValues[margin];
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: pageSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const availableWidth = pageWidth - marginVal * 2;
      const availableHeight = pageHeight - marginVal * 2;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (i > 0) pdf.addPage();

        const imgRatio = img.width / img.height;
        const availRatio = availableWidth / availableHeight;

        let renderWidth: number;
        let renderHeight: number;

        if (imgRatio > availRatio) {
          renderWidth = availableWidth;
          renderHeight = availableWidth / imgRatio;
        } else {
          renderHeight = availableHeight;
          renderWidth = availableHeight * imgRatio;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        const format = img.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        pdf.addImage(img.dataUrl, format, x, y, renderWidth, renderHeight, undefined, 'FAST');
      }

      pdf.save('converted.pdf');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <FileText className="w-4 h-4" />
            <span>Image Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            JPEG to PDF Converter
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Convert multiple images into a single PDF document. Drag to reorder pages, choose page size and margins. All processing happens in your browser.
          </p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-10 text-center cursor-pointer transition-all mb-6 ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop images here
          </h3>
          <p className="text-gray-600 mb-1">or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WebP — multiple files supported</p>
        </div>

        {/* Layout Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Layout Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <div className="flex gap-2">
                {(['a4', 'letter'] as PageSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize ${
                      pageSize === size
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'a4' ? 'A4' : 'Letter'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <div className="flex gap-2">
                {(['portrait', 'landscape'] as Orientation[]).map((orient) => (
                  <button
                    key={orient}
                    onClick={() => setOrientation(orient)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize ${
                      orientation === orient
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {orient}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margins</label>
              <div className="flex gap-1">
                {(['none', 'small', 'medium', 'large'] as Margin[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargin(m)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                      margin === m
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Images ({images.length})
              </h2>
              <button
                onClick={() => setImages([])}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Drag images to reorder. Page order is top-to-bottom, left-to-right.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(img.id)}
                  onDragOver={(e) => handleDragOver(e, img.id)}
                  onDragEnd={handleDragEnd}
                  className={`relative bg-gray-50 rounded-xl border-2 overflow-hidden group transition-all ${
                    dragId === img.id ? 'border-primary-500 opacity-50' : 'border-gray-200'
                  }`}
                >
                  <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="absolute top-2 right-2 z-10 cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{img.name}</p>
                    <p className="text-xs text-gray-400">{img.width}×{img.height} · {formatBytes(img.size)}</p>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-white/90 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {images.length > 0 && (
          <button
            onClick={generatePDF}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-4 px-6 rounded-xl transition-colors mb-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate PDF ({images.length} {images.length === 1 ? 'image' : 'images'})
              </>
            )}
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Add Images</h3>
                <p className="text-sm text-gray-600">Upload one or more images in any common format.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Reorder & Configure</h3>
                <p className="text-sm text-gray-600">Drag to reorder pages. Choose page size, orientation, and margins.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Generate PDF</h3>
                <p className="text-sm text-gray-600">Click Generate to download a single PDF with all images.</p>
              </div>
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
