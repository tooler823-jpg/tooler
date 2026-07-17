import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileImage, Download, Loader2, FileText } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function PDFToJPEG() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
    setImages([]);
    setPageCount(0);
    await convert(file);
  };

  const convert = async (file: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      const imgs: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport }).promise;
        imgs.push(canvas.toDataURL('image/jpeg', 0.9));
      }
      setImages(imgs);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (img: string, index: number) => {
    const a = document.createElement('a');
    a.href = img;
    a.download = `page-${index + 1}.jpg`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => downloadImage(img, i));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2 text-sm font-medium text-rose-700 mb-4">
            <FileImage className="w-4 h-4" />
            <span>PDF Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">PDF to JPEG Converter</h1>
          <p className="text-gray-600">Convert PDF pages into high-quality JPEG images.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{pdfFile ? pdfFile.name : 'Click to upload a PDF'}</p>
          </button>

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Converting {pageCount > 0 ? `(${pageCount} pages)...` : '...'}</span>
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{images.length} pages converted</p>
                <button onClick={downloadAll} className="btn-primary flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Page ${i + 1}`} className="w-full rounded-lg border border-gray-200" />
                    <button onClick={() => downloadImage(img, i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <Download className="w-6 h-6 text-white" />
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-1">Page {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
