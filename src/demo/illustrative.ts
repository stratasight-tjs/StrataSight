/**
 * ILLUSTRATIVE CONTENT.
 *
 * Everything in this file is written by hand to show how the platform would be used.
 * None of it is derived from the CSV, and none of it is real advice, a real document,
 * or a real client record. The views label it "Illustrative" wherever it appears.
 * Figures shown next to this content are always computed separately from the data.
 */

export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  /** Which computed measure the view tracks alongside it. Resolved in views/Recommendations.tsx. */
  measure: 'recurringShare' | 'ownerHours' | 'utilization' | 'receivables' | 'winterResult' | 'topFiveShare';
  defaultStatus: 'proposed' | 'in-progress' | 'done';
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'recurring',
    title: 'Move more maintenance customers onto recurring contracts',
    rationale: 'Contracted work is easier to schedule and gives the business a steadier base under the seasonal swings.',
    measure: 'recurringShare',
    defaultStatus: 'in-progress',
  },
  {
    id: 'owner-hours',
    title: 'Hand day-to-day scheduling and dispatch to a crew lead',
    rationale: 'A business that runs without the owner in every decision is easier to manage today and easier to hand over later.',
    measure: 'ownerHours',
    defaultStatus: 'in-progress',
  },
  {
    id: 'utilization',
    title: 'Tighten crew scheduling to raise billable time',
    rationale: 'Paid hours that are not billed are the largest controllable cost in a labor business.',
    measure: 'utilization',
    defaultStatus: 'in-progress',
  },
  {
    id: 'collections',
    title: 'Invoice at job completion and follow up at 15 days',
    rationale: 'Receivables climb every summer. Faster invoicing shortens the gap between doing the work and being paid.',
    measure: 'receivables',
    defaultStatus: 'proposed',
  },
  {
    id: 'winter',
    title: 'Plan winter work to narrow the December to February loss',
    rationale: 'Fixed costs continue through the slow season. Snow contracts and prepaid spring work are two options to weigh.',
    measure: 'winterResult',
    defaultStatus: 'proposed',
  },
  {
    id: 'concentration',
    title: 'Keep any five customers from carrying too much of the revenue',
    rationale: 'Heavy reliance on a few customers is a risk the owner carries now and a question a buyer would ask.',
    measure: 'topFiveShare',
    defaultStatus: 'done',
  },
];

export interface IntakeDocument {
  name: string;
  detail: string;
  status: 'reconciled' | 'digitized' | 'received' | 'requested';
}

export const INTAKE_DOCUMENTS: IntakeDocument[] = [
  { name: 'Accounting system export', detail: 'Profit and loss by month, chart of accounts', status: 'reconciled' },
  { name: 'Bank statements', detail: 'Operating account, all months on record', status: 'reconciled' },
  { name: 'Payroll reports', detail: 'Field and office payroll by pay period', status: 'reconciled' },
  { name: 'Job log and schedules', detail: 'Completed jobs, promised dates, crew hours', status: 'digitized' },
  { name: 'Estimates and proposals', detail: 'Issued and accepted estimates', status: 'digitized' },
  { name: 'Paper invoices and receipts', detail: 'Boxes from before the accounting system', status: 'received' },
  { name: 'Recurring service contracts', detail: 'Signed maintenance and snow agreements', status: 'received' },
  { name: 'Equipment and vehicle list', detail: 'Owned and leased equipment with purchase dates', status: 'requested' },
  { name: 'Insurance policies', detail: 'Current liability and vehicle coverage', status: 'requested' },
];

export const INTAKE_STAGES = [
  { title: 'Kickoff conversation', detail: 'Goals, concerns, and how the owner prefers to work.' },
  { title: 'Records gathered', detail: 'Exports, statements, and paper collected from the business.' },
  { title: 'Paper digitized', detail: 'Scanned, keyed, and linked to the month it belongs to.' },
  { title: 'Figures reconciled', detail: 'Totals tied out, unclear entries flagged for review.' },
  { title: 'Baseline model built', detail: 'History loaded into the standard financial and operating model.' },
  { title: 'First advisory meeting', detail: 'Walk through the baseline with the owner.' },
];

/** Position of the fictional client in the intake sequence above (0-based index of the last completed stage). */
export const INTAKE_COMPLETED_THROUGH = 5;

export const MEETING_AGENDA = [
  'What changed since the last meeting',
  'Items the review queue raised',
  'Progress on open recommendations',
  'One opportunity to look at next',
  'Decisions and who owns them',
];

export const MEETING_PROMPTS = [
  'Which of these changes did you expect, and which are a surprise?',
  'Is the install backlog limited by crews, by materials, or by sales?',
  'What would you want to be different by the next time we meet?',
];

export const EXIT_NOT_IN_DATASET = [
  'Tax returns and depreciation schedules',
  'Balance sheet detail beyond cash, receivables, and payables',
  'Signed customer contracts and renewal terms',
  'Equipment list with condition and ownership',
  'Employee roster, roles, and tenure',
  'Licenses, permits, and insurance certificates',
];
