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

export const MEETING_AGENDA = [
  'What changed since the last meeting',
  'Figures we are still checking',
  'Progress on open recommendations',
  'One opportunity to look at next',
  'Decisions and who owns them',
];

export const MEETING_PROMPTS = [
  'Which of these changes did you expect, and which are a surprise?',
  'Is the install backlog limited by crews, by materials, or by sales?',
  'What would you want to be different by the next time we meet?',
];
