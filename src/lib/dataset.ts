import csvText from '../data/stratasight_demo_company_monthly.csv?raw';
import csvUrl from '../data/stratasight_demo_company_monthly.csv?url';
import { parseCsv } from './csv';
import type { MonthRecord } from './types';

/** Converts parsed CSV rows into typed month records. Throws on non-numeric values so bad data fails loudly. */
export function toRecords(rows: Record<string, string>[]): MonthRecord[] {
  return rows.map((r, index) => {
    const n = (key: string): number => {
      const value = Number(r[key]);
      if (!Number.isFinite(value)) {
        throw new Error(`Row ${index + 1} (${r.period}): "${key}" is not numeric: ${r[key]}`);
      }
      return value;
    };
    const [year, month] = r.period.split('-').map(Number);
    return {
      companyId: r.company_id,
      companyName: r.company_name,
      industry: r.industry,
      region: r.region,
      period: r.period,
      year,
      month,
      index,
      revenue: {
        maintenance: n('revenue_maintenance_usd'),
        installations: n('revenue_installations_usd'),
        cleanup: n('revenue_seasonal_cleanup_usd'),
        snow: n('revenue_snow_services_usd'),
      },
      totalRevenue: n('total_revenue_usd'),
      directCosts: {
        labor: n('direct_labor_cost_usd'),
        materials: n('materials_cost_usd'),
        subcontractors: n('subcontractor_cost_usd'),
        equipment: n('equipment_rental_cost_usd'),
      },
      totalDirectCost: n('total_direct_cost_usd'),
      grossProfit: n('gross_profit_usd'),
      opex: {
        adminPayroll: n('admin_payroll_usd'),
        ownerSalary: n('owner_salary_usd'),
        rent: n('rent_facilities_usd'),
        insurance: n('insurance_usd'),
        marketing: n('marketing_usd'),
        vehicles: n('vehicle_fuel_maintenance_usd'),
        software: n('software_office_usd'),
        utilities: n('utilities_usd'),
        misc: n('misc_operating_expense_usd'),
      },
      totalOpex: n('total_operating_expense_usd'),
      operatingProfit: n('operating_profit_usd'),
      interestExpense: n('interest_expense_usd'),
      pretaxResult: n('pretax_result_usd'),
      cashEnd: n('cash_balance_end_usd'),
      arEnd: n('accounts_receivable_end_usd'),
      apEnd: n('accounts_payable_end_usd'),
      backlogEnd: n('estimated_backlog_end_usd'),
      recurringContracts: n('active_recurring_contracts_count'),
      repeatCustomers: n('repeat_customers_served_count'),
      newCustomers: n('new_customers_served_count'),
      leads: n('new_leads_count'),
      estimatesIssued: n('estimates_issued_count'),
      estimatesAccepted: n('estimates_accepted_count'),
      jobsCompleted: n('jobs_completed_count'),
      jobsOnTime: n('jobs_completed_on_time_count'),
      hoursPaid: n('labor_hours_paid'),
      hoursBillable: n('labor_hours_billable'),
      crewFte: n('average_field_crew_fte'),
      ownerHoursPerWeek: n('owner_operational_hours_per_week'),
      topFiveRevenue: n('top_five_customer_revenue_usd'),
      recurringRevenue: n('recurring_contract_revenue_usd'),
      sourceType: r.data_source_type,
      reviewStatus: r.review_status,
      reviewNote: r.review_note,
    };
  });
}

/** The full demo series, parsed once at module load from the bundled CSV. */
export const RECORDS: MonthRecord[] = toRecords(parseCsv(csvText));

/** URL of the raw CSV as emitted by the build, for the "download the demo data" link. */
export const CSV_URL: string = csvUrl;

export const COMPANY = {
  id: RECORDS[0].companyId,
  name: RECORDS[0].companyName,
  /** Name without the "(DEMO)" suffix, for places where a separate demo badge is shown. */
  shortName: RECORDS[0].companyName.replace(/\s*\(DEMO\)\s*/i, ''),
  industry: RECORDS[0].industry,
  region: RECORDS[0].region,
  firstPeriod: RECORDS[0].period,
  lastPeriod: RECORDS[RECORDS.length - 1].period,
};
