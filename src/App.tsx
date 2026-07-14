import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AgeCalculator from './pages/tools/AgeCalculator';
import SIPCalculator from './pages/tools/SIPCalculator';
import BMICalculator from './pages/tools/BMICalculator';
import QRCodeGenerator from './pages/tools/QRCodeGenerator';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import ImageCompressor from './pages/tools/ImageCompressor';
import URLShortener from './pages/tools/URLShortener';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="age-calculator" element={<AgeCalculator />} />
          <Route path="sip-calculator" element={<SIPCalculator />} />
          <Route path="bmi-calculator" element={<BMICalculator />} />
          <Route path="qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="image-compressor" element={<ImageCompressor />} />
          <Route path="url-shortener" element={<URLShortener />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
