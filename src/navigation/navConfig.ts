import {
  LayoutDashboard,
  TrendingDown,
  Crosshair,
  Briefcase,
  GitBranch,
  Building2,
  FileText,
  BrainCircuit,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Short title shown in the header breadcrumb */
  pageTitle: string;
}

/** Primary application navigation — labels match product IA */
export const PRIMARY_NAV: NavItem[] = [
  {
    to: '/executive',
    label: 'Overview',
    icon: LayoutDashboard,
    pageTitle: 'Overview',
  },
  {
    to: '/risk-exposure',
    label: 'Risk',
    icon: TrendingDown,
    pageTitle: 'Risk',
  },
  {
    to: '/threat-intelligence',
    label: 'Exposure',
    icon: Crosshair,
    pageTitle: 'Exposure',
  },
  {
    to: '/investment',
    label: 'Investments',
    icon: Briefcase,
    pageTitle: 'Investments',
  },
  {
    to: '/simulator',
    label: 'Scenarios',
    icon: GitBranch,
    pageTitle: 'Scenarios',
  },
  {
    to: '/assets',
    label: 'Assets',
    icon: Building2,
    pageTitle: 'Assets',
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: FileText,
    pageTitle: 'Reports',
  },
];

/** Secondary routes preserved; not in primary nav */
export const SECONDARY_NAV: NavItem[] = [
  {
    to: '/ai-models',
    label: 'Models',
    icon: BrainCircuit,
    pageTitle: 'Models',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    pageTitle: 'Settings',
  },
];

export function getPageTitle(pathname: string): string {
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV];
  const match = all.find(item => item.to === pathname);
  return match?.pageTitle ?? 'Overview';
}
