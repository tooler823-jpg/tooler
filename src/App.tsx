import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AgeCalculator from './pages/tools/AgeCalculator';
import SIPCalculator from './pages/tools/SIPCalculator';
import BMICalculator from './pages/tools/BMICalculator';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="age-calculator" element={<AgeCalculator />} />
          <Route path="sip-calculator" element={<SIPCalculator />} />
          <Route path="bmi-calculator" element={<BMICalculator />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
