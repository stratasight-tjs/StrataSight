/*
 * The words on the public site, in one place. The page renders them, and the build turns the same text into the
 * plain HTML, structured data, and llms.txt that search engines and answer engines read (see seo.ts), so what
 * crawlers see can never drift from what visitors see.
 */

export const HERO = {
  title: 'Know what your company is worth. Then build on it.',
  lede: 'StrataSight is a business value advisory for privately held companies. We assess what your business is worth and why, set the strategy, and work with you over a period of years to improve operations and growth, so that when you sell, you sell from a position of strength.',
};

export const HEADINGS = {
  fit: 'Where we fit',
  services: 'Three disciplines, one aim: a more valuable company.',
  who: 'Who it is for',
  ourJob: 'We do the paperwork. You run the company.',
  how: 'How it works',
  questions: 'A buyer will study your company layer by layer. See it that way first.',
  platform: 'A sample of what a client sees',
  principles: 'Depth over decoration',
  team: 'Who is behind the analysis',
  contact: 'Start with a conversation.',
};

/** The short paragraph under each section heading. */
export const INTROS = {
  services: 'Think of the value creation plan a private equity firm would run, without anyone buying in. You keep the company and you make the decisions.',
  who: 'Owners of privately held businesses in any industry: services, manufacturing, distribution, healthcare, professional firms, technology, and more. The common thread is an owner who wants to make deliberate, well supported decisions about the company.',
  questions: 'Most owners know their business by feel and have rarely seen it the way a buyer would. These are the kinds of questions the work answers, shown here for a sample company.',
  how: 'Ongoing work, not a one-time report. The middle two steps repeat for as long as we work together.',
  platform: 'Each client gets a private workspace: a plain summary of how the business is doing, the history of the company in one consistent view, the recommendations we are working on, and notes from every meeting. Below is a sample built on a fictional landscaping company.',
  about: [
    'Most privately held businesses never get the depth of strategic analysis that institutional investors take for granted. The gap between what a company is worth and what it could be worth is usually operational. It builds up quietly through process gaps, cost structures that have not kept pace, and blind spots that accumulate over years.',
    'StrataSight exists to find that gap and work on it with you. We sit between your own financial planning and the eventual sale, and we start from your actual data.',
  ],
  team: 'StrataSight was formed by a team with complementary expertise in business strategy, quantitative analysis, and data infrastructure.',
  contact: 'Thirty minutes, no commitment. Tell us about your business and we will reply to arrange a call.',
};

export const LEGAL = {
  advisory:
    'StrataSight provides corporate-level strategic advisory only. Services do not constitute personal financial planning, investment advice, insurance, legal services, or certified appraisal. Opinions of value are advisory opinions, not certified valuations.',
  synthetic: 'Charts and figures on this site come from a synthetic dataset about a fictional company. They are not client results.',
};

export const FIT = [
  {
    stage: 'First',
    title: 'You build the business',
    body: 'Years of work, customers, and people. Most of what the company is worth is already there.',
  },
  {
    stage: 'Then, over a period of years',
    title: 'StrataSight builds its value',
    body: 'We assess what the company is worth and why, set the strategy, and improve operations and growth alongside you.',
  },
  {
    stage: 'When you are ready',
    title: 'An exit partner handles the sale',
    body: 'A specialist in exits takes a well documented company to market from the strongest position it can be in.',
  },
];

export const SERVICES = [
  {
    title: 'Strategic Value Assessment',
    short: 'What the company is worth today, and what moves that figure up or down.',
    body: [
      'Most owners carry a number in their head for what the business is worth. Without disciplined analysis behind it, that number is usually wrong, sometimes by a wide margin.',
      'The assessment gives you an evidence-based advisory opinion of what the company is worth today and a clear map of what is pushing that figure up or holding it back. We look at financial trends, market comparables, customer concentration, operational risk, management depth, and growth trajectory.',
      'It is a working document and it does not sit still. We return to it at our regular meetings as the business changes.',
    ],
    included: [
      'Enterprise value advisory opinion',
      'Comparable market benchmarking',
      'Value drivers identified and ranked',
      'Gap analysis and opportunity map',
      'Multiple analysis (EBITDA, SDE, revenue)',
      'Risk factor assessment',
      'Written report and walkthrough in person',
      'Revisited at regular meetings',
    ],
  },
  {
    title: 'Operational Efficiency',
    short: 'Where margin is leaking, ranked by what fixing it is worth.',
    body: [
      'Inefficiency rarely announces itself. It shows up as margins that slip a little each year, departments that are busy without producing more, and overhead that grows faster than output.',
      'Left alone, it compounds, and a buyer prices it in. We review your cost centers, workflows, and profitability measures in a structured way, using your own numbers.',
      'You get a ranked list of specific improvements with an estimate of what each could be worth, so you know where to start. Then we follow the results with you.',
    ],
    included: [
      'Profitability analysis by product or segment',
      'Cost structure review and benchmarking',
      'Workflow and resource allocation review',
      'Margin improvement modeling',
      'Productivity and output analysis',
      'Ranked recommendations with estimated impact',
      'Implementation sequencing guide',
      'Results tracked at later meetings',
    ],
  },
  {
    title: 'Strategic Growth Advisory',
    short: 'A growth plan built around your business, worked meeting by meeting.',
    body: [
      'Growth without a strategy is spending faster. We build the growth plan around your business model, your market, and what your operation can actually carry, not around a framework borrowed from another industry.',
      'The plan is prioritized, sequenced, and tied to milestones you can reach. It stays at the level of the business: corporate strategy, market position, and the ability to scale.',
      'We keep working it with you, meeting by meeting, and adjust as the results come in.',
    ],
    included: [
      'Market opportunity and competitive analysis',
      'Revenue growth modeling and scenario planning',
      'Customer and channel expansion strategy',
      'Operational scalability assessment',
      'Strategic initiative prioritization',
      'Return framing for major decisions',
      'Roadmap with clear milestones',
      'Progress reviewed at regular meetings',
    ],
  },
];

export const WHO = [
  'Owners considering a sale or transition in the next one to five years',
  'Owners who want to know what their company is actually worth, and why',
  'Companies whose margins are slipping or whose growth has stalled',
  'Owners who want to scale without giving up profitability',
  'Partners or co-owners who want a shared, documented view of the company',
  'Owners whose personal financial plan depends on what the business will one day sell for',
];

export const OUR_JOB = [
  ['Gather the records', 'Accounting exports, bank statements, invoices, payroll reports, job logs. Whatever exists, in whatever shape it is in.'],
  ['Digitize the paper', 'Filing cabinets and folders become organized, searchable records with a note of where each figure came from.'],
  ['Consolidate the picture', 'Several years of financial and operating history, brought into one consistent view of the company.'],
  ['Analyze value and performance', 'What the company is worth, what drives that, and how revenue, margins, costs, and cash move together.'],
  ['Prepare recommendations', 'Specific, practical options to consider, each tied to the numbers behind it.'],
  ['Keep it current', 'New months are added, checked, and reconciled as they close, so the picture never goes stale.'],
];

export const YOUR_JOB = [
  ['Share what you already have', 'No new software to learn and no forms to fill in every week.'],
  ['Meet with us regularly', 'We walk through what changed and what it means, in plain language.'],
  ['Make the decisions', 'It is your company. We bring the analysis. You decide what to do with it.'],
];

export const STEPS = [
  {
    title: 'A first conversation',
    body: 'Thirty minutes. We learn about the business, what you want from it, and when. You need no preparation, and we will tell you plainly whether we can help.',
  },
  {
    title: 'We collect what exists',
    body: 'The work starts with your records as they are today. We take in exports, statements, and paper, then organize and digitize them. Anything unclear is marked for review instead of guessed at.',
  },
  {
    title: 'We assess the value and what drives it',
    body: 'Your history goes into a consistent financial and operating model. From it we form an advisory opinion of what the company is worth today, and a ranked list of what raises or lowers that figure.',
  },
  {
    title: 'We meet regularly and work the plan',
    body: 'On a regular schedule we sit down to go through what the numbers show, what to improve in operations and growth, and what we would look at next. You ask questions until it makes sense.',
    recurring: true,
  },
  {
    title: 'We track what you decide',
    body: 'Each recommendation you take on is recorded along with the measures it was meant to move. At later meetings we look at what actually happened and update the picture of value.',
    recurring: true,
  },
  {
    title: 'An exit partner takes it to market',
    body: 'When you decide to sell, a partner who specializes in exits handles the sale. They start with a company whose history is documented and whose value is already understood.',
  },
];

export const PRINCIPLES = [
  ['Evidence only', 'Every recommendation rests on your own financial and operating data. Not gut feel, and not industry averages loosely applied.'],
  ['A defined scope', 'We work at the level of the business: value, operations, and growth. Personal finances, legal work, and the sale itself belong to other professionals.'],
  ['Built to be used', 'Ranked findings, specific next steps, and measures to check them against. We stay with the work through implementation.'],
  ['A person explains it', 'Software does the arithmetic. An advisor sits across the table, answers questions, and knows your business by name.'],
  ['We say what the numbers cannot tell us', 'Every figure carries its source and review status. When a record is incomplete or reconstructed, you will see that it is.'],
  ['No promises about price', 'Our view of value is an advisory opinion, not a certified valuation. We do not promise a sale price or a guaranteed increase.'],
];

// Role cards, not names. Facts come from each person's own background; nothing here claims client results,
// small-business advisory track records, or StrataSight titles. Other employers and firms are not named.
export const TEAM = [
  {
    name: 'Owner planning',
    role: 'Transition, retirement, and estate planning',
    bio: 'More than 20 years in financial services, starting in banking before moving into financial planning. Works with owners nearing retirement on retirement, estate, and legacy planning, and is used to coordinating with tax and legal professionals.',
    skills: ['Certified Business Exit Consultant', 'Estate and legacy planning', 'Finance degree'],
  },
  {
    name: 'Valuation and exit',
    role: 'Valuation, exit planning, and acquisitions',
    bio: 'An electrical engineering background and a CFA charter, with completed training in exit planning and in mergers and acquisitions. Has evaluated acquisition opportunities and supported integration after a purchase, and brings an analyst’s discipline to valuation and modeling.',
    skills: ['CFA charterholder', 'Certified Exit Planning Advisor', 'Certified M&A Advisor'],
  },
  {
    name: 'Platform and data',
    role: 'Software and analysis',
    bio: 'Builds and runs the platform StrataSight uses to organize business records and turn them into clear, checked figures. Brings a background in software engineering and data analysis, building backend services, real-time dashboards, and automated analysis tools.',
    skills: ['Software engineering', 'Data analysis'],
  },
];
