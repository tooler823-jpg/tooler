import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Download, Loader2, X, GripVertical } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

type ImageItem = { id: string; dataUrl: string; name: string };

export default function JPEGToPDF() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState(10);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, { id: crypto.randomUUID(), dataUrl: ev.target?.result as string, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setImages(next);
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setLoading(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const pageSizes: Record<string, [number, number]> = { a4: [210, 297], letter: [216, 279] };
      let pdf: InstanceType<typeof jsPDF>;

      for (let i = 0; i < images.length; i++) {
        const img = await loadImage(images[i].dataUrl);
        let w: number, h: number;

        if (pageSize === 'fit') {
          w = img.width * 0.264583;
          h = img.height * 0.264583;
        } else {
          const [pw, ph] = pageSizes[pageSize];
          const isLandscape = orientation === 'landscape';
          const pageW = isLandscape ? Math.max(pw, ph) : Math.min(pw, ph);
          const pageH = isLandscape ? Math.min(pw, ph) : Math.max(pw, ph);
          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;
          const ratio = Math.min(availW / img.width, availH / img.height);
          w = img.width * ratio;
          h = img.height * ratio;
          const x = (pageW - w) / 2;
          const y = (pageH - h) / 2;

          if (i === 0) {
            pdf = new jsPDF({ orientation, unit: 'mm', format: pageSize });
            pdf.addImage(images[i].dataUrl, 'JPEG', x, y, w, h);
          } else {
            pdf!.addPage(pageSize, orientation);
            pdf!.addImage(images[i].dataUrl, 'JPEG', x, y, w, h);
          }
          continue;
        }

        if (i === 0) {
          pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'mm', format: [w, h] });
          pdf.addImage(images[i].dataUrl, 'JPEG', 0, 0, w, h);
        } else {
          pdf!.addPage([w, h], w > h ? 'landscape' : 'portrait');
          pdf!.addImage(images[i].dataUrl, 'JPEG', 0, 0, w, h);
        }
      }

      pdf!.save('converted.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
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
            <FileText className="w-4 h-4" />
            <span>PDF Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">JPEG to PDF Converter</h1>
          <p className="text-gray-600">Combine multiple images into a single PDF document.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Click to upload images</p>
          </button>

          {images.length > 0 && (
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                {images.map((img, i) => (
                  <div key={img.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3" draggable onDragStart={() => { dragIndex.current = i; }} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragIndex.current !== null) moveImage(dragIndex.current, i); dragIndex.current = null; }}>
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                    <img src={img.dataUrl} alt={img.name} className="w-12 h-12 object-cover rounded" />
                    <span className="flex-1 text-sm text-gray-700 truncate">{i + 1}. {img.name}</span>
                    <button onClick={() => removeImage(img.id)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-rose-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Page Size</label>
                  <select value={pageSize} onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')} className="input-field bg-white text-sm py-2">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="fit">Fit Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Orientation</label>
                  <select value={orientation} onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')} className="input-field bg-white text-sm py-2" disabled={pageSize === 'fit'}>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Margin: {margin}mm</label>
                  <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full mt-2" disabled={pageSize === 'fit'} />
                </div>
              </div>

              <button onClick={generatePDF} disabled={loading || images.length === 0} className="btn-primary w-full disabled:bg-gray-300 flex items-center justify-center gap-2">
                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Generating PDF...</>) : (<><Download className="w-5 h-5" />Generate PDF</>)}
              </button>
            </div>
          )}
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
