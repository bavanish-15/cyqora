import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppSettings,
  SimulationParams,
  SimulationResult,
  OptimizationResult,
  RiskProfile
} from '../types';
import {
  fetchRiskProfile,
  optimizeBudget,
  simulateRisk,
  solveKnapsackLocal,
  simulateRiskLocal
} from '../services/api';
import { CONTROLS_CATALOG_DATA, BASELINE_THREATS_DATA } from '../data/demoData';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  budget: number;
  setBudget: (b: number) => void;
  optimizationResult: OptimizationResult;
  recalculateOptimization: (newBudget?: number) => Promise<void>;
  simParams: SimulationParams;
  setSimParams: (params: SimulationParams | ((prev: SimulationParams) => SimulationParams)) => void;
  simResult: SimulationResult;
  recalculateSimulation: (params?: SimulationParams) => Promise<void>;
  riskProfile: RiskProfile;
  refreshRiskProfile: () => Promise<void>;
  lastUpdated: string;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  isEngineBusy: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'INR',
  animations: true,
  compactMode: false,
  showConfidenceIntervals: true,
  showTechnicalMetrics: true,
  showFinancialMetrics: true,
  riskEngineModel: 'Hybrid',
  riskThreshold: 70,
  highRiskAlerts: true,
  budgetAlerts: true,
};

const DEFAULT_SIM_PARAMS: SimulationParams = {
  mfa_coverage: 65,
  edr_coverage: 72,
  segmentation: 40,
  backup_resilience: 55,
  soc_monitoring: 60,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage if available, defaulting to CYQORA minimal premium dark
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('cyqora_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [budget, setBudgetState] = useState(10000000); // 1.00 Cr
  const [simParams, setSimParamsState] = useState<SimulationParams>(DEFAULT_SIM_PARAMS);
  const [lastUpdated, setLastUpdated] = useState('Updated 2 min ago');
  const [isEngineBusy, setIsEngineBusy] = useState(false);

  // Initialize with deterministic math so there is zero flash of unstyled/empty content
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult>(() =>
    solveKnapsackLocal(CONTROLS_CATALOG_DATA, 10000000)
  );

  const [simResult, setSimResult] = useState<SimulationResult>(() =>
    simulateRiskLocal(DEFAULT_SIM_PARAMS)
  );

  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    total_exposure: 48200000,
    expected_annual_loss: 13600000,
    incident_probability: 0.187,
    confidence_interval: {
      lower: 34700000,
      upper: 69800000,
      p50: 48200000,
      confidence_level: 0.95,
    },
    protected_assets: 12,
    security_budget: 10000000,
    budget_utilization: 68,
    threats: BASELINE_THREATS_DATA,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'High Exposure Detected',
      message: 'Ransomware & Data Breach vectors account for 70% of total risk.',
      type: 'critical',
      timestamp: 'Just now',
    },
    {
      id: '2',
      title: 'Knapsack Optimizer Calibrated',
      message: 'Portfolio maximizes risk reduction at 2.31x ROI under ₹1.00 Cr limit.',
      type: 'success',
      timestamp: '2 min ago',
    }
  ]);

  // Apply theme class to document root
  useEffect(() => {
    try {
      localStorage.setItem('cyqora_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-midnight', 'theme-light', 'theme-high-contrast');
    root.classList.add(`theme-${settings.theme}`);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleSidebarCollapsed = () => setSidebarCollapsed(prev => !prev);

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const item: NotificationItem = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: 'Just now',
    };
    setNotifications(prev => [item, ...prev.slice(0, 7)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const setBudget = (newBudget: number) => {
    setBudgetState(newBudget);
    const quickRes = solveKnapsackLocal(CONTROLS_CATALOG_DATA, newBudget);
    setOptimizationResult(quickRes);
    recalculateOptimization(newBudget);
  };

  const recalculateOptimization = async (customBudget?: number) => {
    const targetBudget = customBudget !== undefined ? customBudget : budget;
    setIsEngineBusy(true);
    try {
      const res = await optimizeBudget(targetBudget);
      setOptimizationResult(res);
      setLastUpdated('Updated just now');
    } catch (e) {
      console.error('Optimization error:', e);
    } finally {
      setIsEngineBusy(false);
    }
  };

  const setSimParams = (
    valueOrUpdater: SimulationParams | ((prev: SimulationParams) => SimulationParams)
  ) => {
    setSimParamsState(prev => {
      const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
      // Recalculate simulation immediately for responsive sliders
      const quickRes = simulateRiskLocal(next);
      setSimResult(quickRes);
      return next;
    });
  };

  const recalculateSimulation = async (customParams?: SimulationParams) => {
    const params = customParams || simParams;
    const res = await simulateRisk(params);
    setSimResult(res);
    setLastUpdated('Updated just now');
  };

  const refreshRiskProfile = async () => {
    setIsEngineBusy(true);
    try {
      const res = await fetchRiskProfile();
      setRiskProfile(res);
      setLastUpdated('Updated just now');
      addNotification({
        title: 'Risk Profile Recalculated',
        message: 'Telemetry refreshed across 12 critical enterprise assets.',
        type: 'info',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEngineBusy(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        isSidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        isSidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebarCollapsed,
        budget,
        setBudget,
        optimizationResult,
        recalculateOptimization,
        simParams,
        setSimParams,
        simResult,
        recalculateSimulation,
        riskProfile,
        refreshRiskProfile,
        lastUpdated,
        notifications,
        dismissNotification,
        addNotification,
        isEngineBusy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
