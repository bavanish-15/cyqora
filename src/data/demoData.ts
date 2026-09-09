import { ThreatVector, SecurityControl, EnterpriseAsset, ThreatIntelligenceItem, AttackNode } from '../types';

export const BASELINE_THREATS_DATA: ThreatVector[] = [
  {
    id: 't-1',
    name: 'Ransomware',
    probability: 0.187,
    financial_impact: 18200000,
    expected_annual_loss: 3403400,
    severity: 'CRITICAL',
    confidence: 89,
    primary_vulnerability: 'Insufficient MFA & Legacy SMB Exposure',
    recommended_control: 'MFA + Cryptographic Backup',
    percentage_share: 38.0
  },
  {
    id: 't-2',
    name: 'Data Breach',
    probability: 0.162,
    financial_impact: 15400000,
    expected_annual_loss: 2494800,
    severity: 'CRITICAL',
    confidence: 92,
    primary_vulnerability: 'Unencrypted Database S3 Exfiltration',
    recommended_control: 'CSPM + Database DLP & Zero Trust',
    percentage_share: 32.0
  },
  {
    id: 't-3',
    name: 'Account Compromise',
    probability: 0.245,
    financial_impact: 5300000,
    expected_annual_loss: 1298500,
    severity: 'HIGH',
    confidence: 86,
    primary_vulnerability: 'Session Hijacking & Single-Factor VPN',
    recommended_control: 'FIDO2 Phishing-Resistant MFA',
    percentage_share: 11.0
  },
  {
    id: 't-4',
    name: 'Service Disruption',
    probability: 0.095,
    financial_impact: 3850000,
    expected_annual_loss: 365750,
    severity: 'MODERATE',
    confidence: 84,
    primary_vulnerability: 'DDoS Transit Saturation & Single Cloud Region',
    recommended_control: 'Multi-Region Cloud WAF & Scrubbing',
    percentage_share: 8.0
  },
  {
    id: 't-5',
    name: 'Insider Threat',
    probability: 0.052,
    financial_impact: 2900000,
    expected_annual_loss: 150800,
    severity: 'MODERATE',
    confidence: 78,
    primary_vulnerability: 'Excessive Admin Privileges & Unmonitored Access',
    recommended_control: 'Privileged Access Management (PAM)',
    percentage_share: 6.0
  },
  {
    id: 't-6',
    name: 'Supply Chain Exploitation',
    probability: 0.071,
    financial_impact: 2550000,
    expected_annual_loss: 181050,
    severity: 'MODERATE',
    confidence: 81,
    primary_vulnerability: 'Third-Party Vendor Open Port / Compromised Package',
    recommended_control: 'Vendor Risk Screening & SBOM Audit',
    percentage_share: 5.0
  }
];

export const CONTROLS_CATALOG_DATA: SecurityControl[] = [
  {
    id: 'c-1',
    name: 'MFA Upgrade (Phishing-Resistant)',
    cost: 1800000,
    risk_reduction: 2800000,
    roi: 1.56,
    risk_reduction_pct: 20.4,
    priority: 'HIGH PRIORITY',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'Identity',
    description: 'Hardware-backed FIDO2 MFA eliminating credential stuffing and session hijacking.',
    threats: ['Account Compromise', 'Ransomware']
  },
  {
    id: 'c-2',
    name: 'Cryptographic Backup & Recovery',
    cost: 1600000,
    risk_reduction: 2000000,
    roi: 1.25,
    risk_reduction_pct: 14.6,
    priority: 'HIGH PRIORITY',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'Resilience',
    description: 'Immutable WORM snapshots with isolated vault for rapid ransomware disaster recovery.',
    threats: ['Ransomware']
  },
  {
    id: 'c-3',
    name: 'Security Awareness Program',
    cost: 800000,
    risk_reduction: 800000,
    roi: 1.00,
    risk_reduction_pct: 5.8,
    priority: 'RECOMMENDED',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'People',
    description: 'Continuous simulated phishing campaigns and human-layer risk telemetry.',
    threats: ['Account Compromise', 'Data Breach']
  },
  {
    id: 'c-4',
    name: 'Advanced Email Security',
    cost: 1200000,
    risk_reduction: 1000000,
    roi: 0.83,
    risk_reduction_pct: 7.3,
    priority: 'OPTIONAL',
    decision: 'BUDGET CONSTRAINED',
    selected: false,
    category: 'Perimeter',
    description: 'In-line AI email gateway blocking targeted executive impersonation and BEC.',
    threats: ['Account Compromise']
  },
  {
    id: 'c-5',
    name: 'Continuous Vulnerability Management',
    cost: 1600000,
    risk_reduction: 1200000,
    roi: 0.75,
    risk_reduction_pct: 8.8,
    priority: 'RECOMMENDED',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'Hygiene',
    description: 'Risk-based patch orchestration across external attack surface and cloud workloads.',
    threats: ['Supply Chain Exploitation', 'Data Breach']
  },
  {
    id: 'c-6',
    name: 'EDR Upgrade (Managed Detection & Response)',
    cost: 2400000,
    risk_reduction: 1600000,
    roi: 0.67,
    risk_reduction_pct: 11.7,
    priority: 'RECOMMENDED',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'Endpoint',
    description: '24/7 autonomous threat hunting with sub-15 minute mean time to contain (MTTC).',
    threats: ['Ransomware', 'Supply Chain Exploitation']
  },
  {
    id: 'c-7',
    name: 'Zero Trust Network Micro-Segmentation',
    cost: 1800000,
    risk_reduction: 1200000,
    roi: 0.67,
    risk_reduction_pct: 8.8,
    priority: 'RECOMMENDED',
    decision: 'RECOMMENDED',
    selected: true,
    category: 'Network',
    description: 'East-west policy enforcement preventing lateral movement into critical core assets.',
    threats: ['Data Breach', 'Ransomware']
  },
  {
    id: 'c-8',
    name: 'Privileged Access Management (PAM)',
    cost: 1400000,
    risk_reduction: 900000,
    roi: 0.64,
    risk_reduction_pct: 6.6,
    priority: 'OPTIONAL',
    decision: 'BUDGET CONSTRAINED',
    selected: false,
    category: 'Identity',
    description: 'Just-in-time credential vaulting with automated root rotation and session audit.',
    threats: ['Insider Threat', 'Account Compromise']
  },
  {
    id: 'c-9',
    name: 'Cloud Security Posture (CSPM)',
    cost: 1000000,
    risk_reduction: 600000,
    roi: 0.60,
    risk_reduction_pct: 4.4,
    priority: 'OPTIONAL',
    decision: 'BUDGET CONSTRAINED',
    selected: false,
    category: 'Cloud',
    description: 'Continuous compliance audit across AWS, Azure, and GCP workloads.',
    threats: ['Data Breach']
  },
  {
    id: 'c-10',
    name: 'DDoS Protection & Edge Scrubbing',
    cost: 800000,
    risk_reduction: 400000,
    roi: 0.50,
    risk_reduction_pct: 2.9,
    priority: 'OPTIONAL',
    decision: 'DEFER',
    selected: false,
    category: 'Perimeter',
    description: 'Multi-terabit edge scrubbing and automated layer 7 traffic mitigation.',
    threats: ['Service Disruption']
  }
];

export const ENTERPRISE_ASSETS_DATA: EnterpriseAsset[] = [
  {
    id: 'ast-1',
    name: 'Payment Gateway Core',
    unit: 'FinTech Operations',
    criticality: 'TIER 1 - MISSION CRITICAL',
    revenue_dependency: 360000000,
    threat_exposure: 'Ransomware, Account Hijack, API Exploit',
    control_score: 78,
    financial_exposure: 12400000,
    status: 'PROTECTED',
    compliance: 'PCI-DSS 4.0, RBI Cyber Security Framework'
  },
  {
    id: 'ast-2',
    name: 'Customer KYC & PII Vault',
    unit: 'Compliance & Security',
    criticality: 'TIER 1 - MISSION CRITICAL',
    revenue_dependency: 210000000,
    threat_exposure: 'Data Breach, Exfiltration, Insider Leak',
    control_score: 72,
    financial_exposure: 11800000,
    status: 'AT RISK',
    compliance: 'DPDP Act 2023, ISO 27001'
  },
  {
    id: 'ast-3',
    name: 'Enterprise ERP System',
    unit: 'Supply Chain & Billing',
    criticality: 'TIER 2 - HIGH',
    revenue_dependency: 145000000,
    threat_exposure: 'Ransomware, Service Disruption',
    control_score: 64,
    financial_exposure: 7400000,
    status: 'MODERATE',
    compliance: 'SOC 2 Type II'
  },
  {
    id: 'ast-4',
    name: 'Employee Identity Provider (Okta/AD)',
    unit: 'Enterprise IT',
    criticality: 'TIER 1 - MISSION CRITICAL',
    revenue_dependency: 90000000,
    threat_exposure: 'Credential Stuffing, MFA Bypass',
    control_score: 82,
    financial_exposure: 5300000,
    status: 'PROTECTED',
    compliance: 'CIS Benchmarks'
  },
  {
    id: 'ast-5',
    name: 'Production Kubernetes Clusters',
    unit: 'Cloud Engineering',
    criticality: 'TIER 1 - MISSION CRITICAL',
    revenue_dependency: 280000000,
    threat_exposure: 'Misconfiguration, Lateral Movement',
    control_score: 68,
    financial_exposure: 4200000,
    status: 'MONITORED',
    compliance: 'NIST CSF 2.0'
  },
  {
    id: 'ast-6',
    name: 'Corporate Email Infrastructure',
    unit: 'Corporate Operations',
    criticality: 'TIER 3 - MEDIUM',
    revenue_dependency: 40000000,
    threat_exposure: 'Phishing Ingress, BEC Fraud',
    control_score: 75,
    financial_exposure: 2800000,
    status: 'PROTECTED',
    compliance: 'DMARC, SPF, DKIM Strict'
  },
  {
    id: 'ast-7',
    name: 'Public Developer API Platform',
    unit: 'Platform Engineering',
    criticality: 'TIER 2 - HIGH',
    revenue_dependency: 85000000,
    threat_exposure: 'DDoS, API Abuse, Token Theft',
    control_score: 62,
    financial_exposure: 2300000,
    status: 'MODERATE',
    compliance: 'OWASP API Top 10'
  },
  {
    id: 'ast-8',
    name: 'Analytics & Snowflake Data Lake',
    unit: 'Business Intelligence',
    criticality: 'TIER 3 - MEDIUM',
    revenue_dependency: 55000000,
    threat_exposure: 'Data Exfiltration, Unchecked Sharing',
    control_score: 71,
    financial_exposure: 2000000,
    status: 'MONITORED',
    compliance: 'GDPR / DPDP'
  }
];

export const THREAT_INTELLIGENCE_ITEMS: ThreatIntelligenceItem[] = [
  {
    id: 'ti-1',
    title: 'Targeted LockBit 3.0 / BlackCat Variants',
    activity: 'High Reconnaissance Spike',
    likelihood: 'Critical (88%)',
    trend: 'UP',
    targeted_assets: 'Payment Gateway Core, ERP System, Off-site Backups',
    potential_impact: 18200000,
    description: 'Active double-extortion campaigns observed targeting Indian FinTech infrastructure via spear-phishing and compromised RDP/SMB ports.',
    mitre_technique: 'T1486 Data Encrypted for Impact'
  },
  {
    id: 'ti-2',
    title: 'Cloud Storage & S3 Exfiltration Campaigns',
    activity: 'Automated Bucket Enumeration',
    likelihood: 'High (76%)',
    trend: 'UP',
    targeted_assets: 'Customer KYC Vault, Snowflake Data Lake',
    potential_impact: 15400000,
    description: 'State-affiliated threat groups scanning public facing endpoints for exposed AWS STS tokens and unrotated IAM credentials.',
    mitre_technique: 'T1567 Exfiltration Over Web Service'
  },
  {
    id: 'ti-3',
    title: 'AiTM Phishing & Session Token Harvesting',
    activity: 'Adversary-in-the-Middle Proxies',
    likelihood: 'High (82%)',
    trend: 'STABLE',
    targeted_assets: 'Corporate Okta IdP, Executive Email Boxes',
    potential_impact: 5300000,
    description: 'EvilProxy and Modlishka toolkits bypassing legacy SMS/Push 2FA by intercepting authentication cookies in real-time.',
    mitre_technique: 'T1556 Modify Authentication Process'
  },
  {
    id: 'ti-4',
    title: 'Volumetric Layer 7 HTTP/2 Rapid Reset DDoS',
    activity: 'Botnet Transit Bursts',
    likelihood: 'Moderate (44%)',
    trend: 'DOWN',
    targeted_assets: 'Public Developer API, Customer Web Portal',
    potential_impact: 3850000,
    description: 'RST_STREAM frame floods designed to exhaust edge reverse proxies and induce latency in real-time transaction processing.',
    mitre_technique: 'T1498 Network Denial of Service'
  },
  {
    id: 'ti-5',
    title: 'Privileged Contractor Credential Abuse',
    activity: 'Anomalous Off-Hours SQL Queries',
    likelihood: 'Moderate (35%)',
    trend: 'STABLE',
    targeted_assets: 'Customer Database, Production Cluster',
    potential_impact: 2900000,
    description: 'Unauthorized batch export queries originating from remote third-party support accounts outside standard operational shift windows.',
    mitre_technique: 'T1078 Valid Accounts'
  },
  {
    id: 'ti-6',
    title: 'Upstream PyPI / npm Poisoning Exploitation',
    activity: 'Malicious Typosquatting in CI/CD',
    likelihood: 'Moderate (40%)',
    trend: 'UP',
    targeted_assets: 'Kubernetes Build Pipeline, Microservice Containers',
    potential_impact: 2550000,
    description: 'Dependency confusion packages introducing reverse shells into container base images during automated build steps.',
    mitre_technique: 'T1195 Supply Chain Compromise'
  }
];

export const ATTACK_CHAIN_NODES: AttackNode[] = [
  {
    id: 'ac-1',
    label: 'External Threat Activity',
    stage: 'Reconnaissance & Weaponization',
    riskLevel: 'HIGH',
    metric: '14,200 Scans/hr',
    description: 'Autonomous adversary probes targeting perimeter gateways and employee social channels.',
    mitigation: 'Threat Intelligence Feeds & Edge Rate Limiting'
  },
  {
    id: 'ac-2',
    label: 'Spear Phishing Vector',
    stage: 'Initial Access',
    riskLevel: 'CRITICAL',
    metric: 'P = 65%',
    description: 'Deceptive executive emails carrying macro-enabled payloads or fake login portals.',
    mitigation: 'AI Email Gateway & DMARC Strict Policies'
  },
  {
    id: 'ac-3',
    label: 'Credential Theft',
    stage: 'Execution',
    riskLevel: 'CRITICAL',
    metric: 'P = 58%',
    description: 'Adversary gains employee password or steals cached browser session token.',
    mitigation: 'Phishing-Resistant FIDO2 Hardware Tokens'
  },
  {
    id: 'ac-4',
    label: 'MFA Failure / Bypass',
    stage: 'Credential Access',
    riskLevel: 'CRITICAL',
    metric: 'P = 42%',
    description: 'Attacker leverages MFA fatigue push spamming or AiTM proxy cookies.',
    mitigation: 'Contextual Access Control & Number Matching'
  },
  {
    id: 'ac-5',
    label: 'Privilege Escalation',
    stage: 'Privilege Escalation',
    riskLevel: 'HIGH',
    metric: 'P = 50%',
    description: 'Exploitation of local misconfigurations to elevate from standard user to Domain/Cluster Admin.',
    mitigation: 'PAM Just-in-Time Vault & Least Privilege Audits'
  },
  {
    id: 'ac-6',
    label: 'Lateral Movement',
    stage: 'Lateral Spread',
    riskLevel: 'HIGH',
    metric: 'P = 64%',
    description: 'Propagation across flat subnet networks to reach payment databases and backup servers.',
    mitigation: 'Zero Trust Micro-Segmentation & Host Firewalls'
  },
  {
    id: 'ac-7',
    label: 'Business Disruption / Encrypt',
    stage: 'Impact',
    riskLevel: 'CRITICAL',
    metric: 'P = 62%',
    description: 'Mass encryption of core databases and destruction of primary backups.',
    mitigation: 'Air-Gapped Immutable Backups & Fast EDR Killswitches'
  },
  {
    id: 'ac-8',
    label: 'Financial Loss Realization',
    stage: 'Financial Impact',
    riskLevel: 'CRITICAL',
    metric: '₹4.82 Cr Exposure',
    description: 'Incident response, forensic audit, regulatory penalties under DPDP, and business interruption.',
    mitigation: 'Cyber Insurance & Portfolio Risk Optimization'
  }
];
