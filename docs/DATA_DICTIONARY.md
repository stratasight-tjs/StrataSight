# StrataSight Synthetic Demo Data

File: `stratasight_demo_company_monthly.csv`

**THIS FILE IS ENTIRELY SYNTHETIC.** The business, numbers, customer indicators, source descriptions, and review notes are fabricated for frontend demonstration. This data should never be represented as actual client data, a certified financial statement, or evidence of StrataSight's prior performance.

- Company: Aster Ridge Property Services (DEMO), a fictional landscaping/property-maintenance company in the Greater Philadelphia region.
- One row per month, 46 months from 2023-01 through 2026-10.
- Currency: USD, whole-dollar rounded amounts except workforce FTE and owner weekly hours.
- Reporting period: `period` formatted `YYYY-MM`; 2026 data is **year to date through October**, NOT a complete 2026 year.
- One fictional tenant/company: `company_id = DEMO-001`.

## Financial model

- `revenue_*_usd`: four nonoverlapping service lines. `total_revenue_usd` is their sum.
- `direct_labor_cost_usd`, `materials_cost_usd`, `subcontractor_cost_usd`, `equipment_rental_cost_usd`: direct costs of work. `total_direct_cost_usd` equals their sum.
- `gross_profit_usd` = `total_revenue_usd - total_direct_cost_usd`.
- `admin_payroll_usd` through `misc_operating_expense_usd`: recurring operating expense categories; `owner_salary_usd` is an EXPENSE and should not be added to profit twice.
- `total_operating_expense_usd`: sum of named expense categories (includes owner salary).
- `operating_profit_usd` = `gross_profit_usd - total_operating_expense_usd`.
- `pretax_result_usd` = `operating_profit_usd - interest_expense_usd`.
- **This simplified dataset excludes taxes, depreciation, accounts for neither full GAAP accounting nor complete cash-flow reconciliation. DO NOT label any value EBITDA, net income after tax, SDE, normalized earnings, actual valuation, or owner's distributable cash without additional evidence and a precise definition.**
- `cash_balance_end_usd`, `accounts_receivable_end_usd`, `accounts_payable_end_usd`, and `estimated_backlog_end_usd` are simulated period-end snapshots. Do not sum them across months; show trends or period-end values.
- `recurring_contract_revenue_usd` is a subset of `revenue_maintenance_usd`; `top_five_customer_revenue_usd` is a subset of `total_revenue_usd`. Do not add either to total revenue.

## Operational fields

- `new_leads_count`, `estimates_issued_count`, `estimates_accepted_count`: a simple funnel. An estimates acceptance rate can be calculated as accepted / issued when issued > 0.
- `jobs_completed_count`, `jobs_completed_on_time_count`: on-time delivery ratio = on-time / completed.
- `labor_hours_paid`, `labor_hours_billable`: illustrative utilization = billable / paid. Average field crew FTE is not a headcount and should not be summed across months.
- `owner_operational_hours_per_week` is a monthly estimate; can be graphed as a proxy for owner dependence but is not an exit-readiness score.
- `active_recurring_contracts_count`, `new_customers_served_count`, `repeat_customers_served_count`: illustrative activity counts; do not confuse them with unique customer identifiers or historical retention cohort analysis.

## Data provenance and review UI

- `data_source_type`, `review_status`, `review_note` mimic a future source/verification workflow.
- Some rows are deliberately flagged `Review flagged` with explanatory notes. These flags are simulated to exercise a review queue, not real historical concerns.
- A real product should preserve exact uploaded file/document provenance, import batch IDs, per-figure verification, edits, approvers, access controls, and audit logs. This static CSV does not demonstrate those security features.

## Suggestions for demonstration

1. Revenue by month, growth by matching months across years, 2026 YTD vs 2025 YTD.
2. Service-line composition and seasonality (maintenance, installations, cleanup, snow).
3. Gross margin and operating profit trend with correct cost definitions.
4. Operating cost decomposition.
5. AR and cash snapshots, not misleading cumulative totals.
6. Lead-to-estimate-to-accepted funnel, labor utilization and on-time jobs.
7. Advisor quality-control queue for flagged months.
8. Optional client-facing simplified dashboard with plain-language explanations.
