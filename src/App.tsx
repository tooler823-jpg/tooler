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
import PDFToJPEG from './pages/tools/PDFToJPEG';
import JPEGToPDF from './pages/tools/JPEGToPDF';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import { AuthProvider } from './lib/auth';

export default function App() {
  return (
    <AuthProvider>
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
            <Route path="pdf-to-jpeg" element={<PDFToJPEG />} />
            <Route path="jpeg-to-pdf" element={<JPEGToPDF />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="login" element={<Login />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
