import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileImage,
  ArrowLeft,
  Upload,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import AdBanner from '../../components/AdBanner';

type PageImage = {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
};

export default function PDFToJPEG() {
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertPDF = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setPages([]);
    setFileName(file.name);

    try {
      const pdfjs = await import('pdfjs-dist');
      const workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const convertedPages: PageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context not available');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        } as Parameters<typeof page.render>[0]).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        convertedPages.push({
          pageNumber: i,
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(convertedPages);
    } catch {
      setError('Failed to process PDF. The file may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    convertPDF(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const downloadPage = (page: PageImage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    const baseName = fileName.replace(/\.pdf$/i, '') || 'page';
    link.download = `${baseName}_page_${page.pageNumber}.jpg`;
    link.click();
  };

  const downloadAll = () => {
    pages.forEach((page, index) => {
      setTimeout(() => downloadPage(page), index * 300);
    });
  };

  const handleReset = () => {
    setPages([]);
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <FileImage className="w-4 h-4" />
            <span>Image Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            PDF to JPEG Converter
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Upload a PDF and convert each page to a high-quality JPEG image. All processing happens directly in your browser.
          </p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {pages.length === 0 && !loading && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your PDF here
            </h3>
            <p className="text-gray-600 mb-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">PDF files only</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Converting PDF...</h3>
            <p className="text-gray-600">Extracting and converting pages to JPEG</p>
          </div>
        )}

        {pages.length > 0 && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">{fileName}</span>
                <span className="text-sm text-gray-500">({pages.length} {pages.length === 1 ? 'page' : 'pages'})</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={page.dataUrl}
                      alt={`Page ${page.pageNumber}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Page {page.pageNumber}
                    </span>
                    <button
                      onClick={() => downloadPage(page)}
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      JPG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Upload PDF</h3>
                <p className="text-sm text-gray-600">Drag and drop or browse to select a PDF file.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Preview Pages</h3>
                <p className="text-sm text-gray-600">Each page is converted and previewed as a JPEG image.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Download</h3>
                <p className="text-sm text-gray-600">Download individual pages or all at once as JPEG files.</p>
              </div>
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
