import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Download } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrUrl, setQrUrl] = useState('');

  const generate = () => {
    if (!text.trim()) return;
    const params = new URLSearchParams({
      data: text,
      size: `${size}x${size}`,
      color: fgColor.replace('#', ''),
      bgcolor: bgColor.replace('#', ''),
    });
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`);
  };

  const download = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-4">
            <QrCode className="w-4 h-4" />
            <span>Security & Web Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">QR Code Generator</h1>
          <p className="text-gray-600">Create high-quality QR codes from any URL or text.</p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text or URL</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="input-field resize-none" rows={3} placeholder="Enter URL or text..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size: {size}px</label>
                <input type="range" min={128} max={512} step={64} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
                </div>
              </div>
              <button onClick={generate} disabled={!text.trim()} className="btn-primary w-full disabled:bg-gray-300">Generate QR Code</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            {qrUrl ? (
              <>
                <img src={qrUrl} alt="QR Code" className="max-w-full rounded-lg" />
                <button onClick={download} className="btn-secondary mt-4 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode className="w-16 h-16 mx-auto mb-3" />
                <p>Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>

        <AdBanner format="horizontal" className="mt-8" />
      </div>
    </div>
  );
}
