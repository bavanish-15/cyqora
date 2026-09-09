import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { ExecutiveCockpit } from './pages/ExecutiveCockpit';
import { RiskExposure } from './pages/RiskExposure';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { InvestmentOptimizer } from './pages/InvestmentOptimizer';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { AIModels } from './pages/AIModels';
import { Assets } from './pages/Assets';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/executive" replace />} />
            <Route path="/executive" element={<ExecutiveCockpit />} />
            <Route path="/risk-exposure" element={<RiskExposure />} />
            <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
            <Route path="/investment" element={<InvestmentOptimizer />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/ai-models" element={<AIModels />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/executive" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
