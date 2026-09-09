export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'OPTIMIZED';

export interface ThreatVector {
  id: string;
  name: string;
  probability: number;
  financial_impact: number;
  expected_annual_loss: number;
  severity: SeverityLevel;
  confidence: number;
  primary_vulnerability: string;
  recommended_control: string;
  percentage_share: number;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  p50: number;
  confidence_level: number;
}

export interface RiskProfile {
  total_exposure: number;
  expected_annual_loss: number;
  incident_probability: number;
  confidence_interval: ConfidenceInterval;
  protected_assets: number;
  security_budget: number;
  budget_utilization: number;
  threats: ThreatVector[];
}

export interface SecurityControl {
  id: string;
  name: string;
  cost: number;
  risk_reduction: number;
  roi: number;
  risk_reduction_pct: number;
  priority: 'HIGH PRIORITY' | 'RECOMMENDED' | 'OPTIONAL' | 'DEFER' | 'LOW ROI' | 'BUDGET CONSTRAINED' | 'ALREADY COVERED';
  decision: string;
  selected: boolean;
  category: string;
  description: string;
  threats?: string[];
}

export interface OptimizationResult {
  budget: number;
  selected_controls: SecurityControl[];
  total_cost: number;
  total_risk_reduction: number;
  remaining_budget: number;
  residual_risk: number;
  roi: number;
  portfolio_efficiency: number;
  unselected_controls: SecurityControl[];
}

export interface SimulationParams {
  mfa_coverage: number;
  edr_coverage: number;
  segmentation: number;
  backup_resilience: number;
  soc_monitoring: number;
}

export interface SimulatedThreat {
  name: string;
  probability: number;
  financial_impact: number;
  expected_annual_loss: number;
  probability_reduction_pct: number;
  impact_reduction_pct: number;
}

export interface SimulationResult {
  baseline_exposure: number;
  simulated_exposure: number;
  baseline_eal: number;
  simulated_eal: number;
  risk_reduction_percentage: number;
  incident_probability: number;
  residual_risk: number;
  investment_requirement: number;
  risk_score: number;
  confidence: number;
  simulated_threats: SimulatedThreat[];
}

export interface EnterpriseAsset {
  id: string;
  name: string;
  unit: string;
  criticality: string;
  revenue_dependency: number;
  threat_exposure: string;
  control_score: number;
  financial_exposure: number;
  status: 'PROTECTED' | 'AT RISK' | 'MODERATE' | 'MONITORED';
  compliance: string;
}

export interface ThreatIntelligenceItem {
  id: string;
  title: string;
  activity: string;
  likelihood: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  targeted_assets: string;
  potential_impact: number;
  description: string;
  mitre_technique: string;
}

export interface AttackNode {
  id: string;
  label: string;
  stage: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  metric: string;
  description: string;
  mitigation: string;
}

export interface AppSettings {
  theme: 'dark' | 'midnight' | 'light' | 'high-contrast';
  currency: 'INR' | 'USD';
  displayMode?: 'CRORES' | 'LAKHS' | 'STANDARD';
  confidenceLevel?: number;
  regulatoryFramework?: string;
  autoRefresh?: boolean;
  animations: boolean;
  compactMode: boolean;
  showConfidenceIntervals: boolean;
  showTechnicalMetrics: boolean;
  showFinancialMetrics: boolean;
  riskEngineModel: 'Bayesian' | 'Fuzzy' | 'Hybrid';
  riskThreshold: number;
  highRiskAlerts: boolean;
  budgetAlerts: boolean;
}
