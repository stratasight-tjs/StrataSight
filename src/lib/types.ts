/** One month of the demo company, typed from the CSV. Field names drop the `_usd` and `_count` suffixes. */
export interface MonthRecord {
  companyId: string;
  companyName: string;
  industry: string;
  region: string;
  /** YYYY-MM */
  period: string;
  year: number;
  /** 1 to 12 */
  month: number;
  /** Position in the full series, 0-based. */
  index: number;

  revenue: Record<ServiceLine, number>;
  totalRevenue: number;

  directCosts: Record<DirectCost, number>;
  totalDirectCost: number;
  grossProfit: number;

  opex: Record<OpexCategory, number>;
  totalOpex: number;
  operatingProfit: number;
  interestExpense: number;
  pretaxResult: number;

  /** Period-end snapshots. Never sum these across months. */
  cashEnd: number;
  arEnd: number;
  apEnd: number;
  backlogEnd: number;

  recurringContracts: number;
  repeatCustomers: number;
  newCustomers: number;
  leads: number;
  estimatesIssued: number;
  estimatesAccepted: number;
  jobsCompleted: number;
  jobsOnTime: number;
  hoursPaid: number;
  hoursBillable: number;
  crewFte: number;
  ownerHoursPerWeek: number;

  /** Subset of total revenue. */
  topFiveRevenue: number;
  /** Subset of maintenance revenue. */
  recurringRevenue: number;

  sourceType: string;
  reviewStatus: string;
  reviewNote: string;
}

export const SERVICE_LINES = ['maintenance', 'installations', 'cleanup', 'snow'] as const;
export type ServiceLine = (typeof SERVICE_LINES)[number];

export const SERVICE_LINE_LABEL: Record<ServiceLine, string> = {
  maintenance: 'Maintenance',
  installations: 'Installations',
  cleanup: 'Seasonal cleanup',
  snow: 'Snow services',
};

export const DIRECT_COSTS = ['labor', 'materials', 'subcontractors', 'equipment'] as const;
export type DirectCost = (typeof DIRECT_COSTS)[number];

export const DIRECT_COST_LABEL: Record<DirectCost, string> = {
  labor: 'Direct labor',
  materials: 'Materials',
  subcontractors: 'Subcontractors',
  equipment: 'Equipment rental',
};

export const OPEX_CATEGORIES = [
  'adminPayroll',
  'ownerSalary',
  'rent',
  'insurance',
  'marketing',
  'vehicles',
  'software',
  'utilities',
  'misc',
] as const;
export type OpexCategory = (typeof OPEX_CATEGORIES)[number];

export const OPEX_LABEL: Record<OpexCategory, string> = {
  adminPayroll: 'Admin payroll',
  ownerSalary: 'Owner salary',
  rent: 'Rent and facilities',
  insurance: 'Insurance',
  marketing: 'Marketing',
  vehicles: 'Vehicles, fuel, maintenance',
  software: 'Software and office',
  utilities: 'Utilities',
  misc: 'Miscellaneous',
};
