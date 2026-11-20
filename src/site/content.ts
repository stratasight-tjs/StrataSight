/*
 * The words on the public site, in one place. The page renders them, and the build turns the same text into the
 * plain HTML, structured data, and llms.txt that search engines and answer engines read (see seo.ts), so what
 * crawlers see can never drift from what visitors see. The copy matches the platform's public pages word for word.
 */

export const HERO = {
  title: 'Value growth advisory for business owners',
  lede: 'StrataSight helps owners of privately held businesses understand what their company is worth and where they can improve profitability. We organize your records, assess what drives the value of your business, and meet with you regularly to review recommendations and track results.',
};

export const HEADINGS = {
  fit: 'Where we fit',
  fitTitle: 'Building business value before a sale',
  services: 'Business value, operations, and growth',
  screensEyebrow: 'Client workspace',
  screens: 'Business performance and open decisions',
  how: 'How we work with you',
  cta: 'Discuss your business with us',
  who: 'Who we work with',
  principles: 'Our approach to value growth',
  ourJob: 'Working with StrataSight',
  team: 'Our team',
  contact: 'Request an introductory call',
};

/** The short paragraph under each section heading. */
export const INTROS = {
  fit: 'An owner who expects to sell can start preparing years in advance. We focus on the parts of the business you can influence while you still run it.',
  services: 'Our work starts with an assessment of the company. Your priorities help determine whether we look more closely at current operations, opportunities for growth, or both.',
  screens:
    'Your workspace brings earnings, cash, and customer activity together with our recommendations. Between meetings, you can review a figure we discussed, revisit a decision, or see which records we need from you.',
  how: 'We begin with your goals and existing records. Regular meetings give us time to examine decisions as they come up and see how the business responds.',
  who: 'We advise owners of privately held businesses who want a clearer view of company value or a specific operating decision. A sale may be several years away.',
  about: [
    'A business owner may have a clear timeline for stepping away and still face practical questions about the company itself. Which work generates dependable earnings? Which customer relationships or decisions still depend on the owner?',
    'StrataSight brings financial analysis and operating records together to help answer those questions. We discuss our findings with you, recommend where to focus, and follow the decisions you make over time.',
  ],
  contact: "Tell us a little about your business and what you'd like to discuss. We'll reply to arrange a 30-minute call. There's no commitment.",
};

export const FOOTER = 'Value growth advisory for privately held businesses.';

export const LEGAL = {
  advisory:
    'StrataSight provides corporate-level strategic advisory only. Services do not constitute personal financial planning, investment advice, insurance, legal services, or certified appraisal. Opinions of value are advisory opinions, not certified valuations.',
  synthetic: 'Charts and figures on this site come from a synthetic dataset about a fictional company. They are not client results.',
};

export const FIT = [
  {
    stage: 'Today',
    title: "The business you've built",
    body: 'Your customers, team, and operating history provide the starting point. You know which parts of the company work well and which still take up too much of your time.',
  },
  {
    stage: 'During our engagement',
    title: 'Value growth advisory',
    body: 'We examine earnings, cash flow, and the way work gets done. Together, we choose which opportunities to pursue and review what changes.',
  },
  {
    stage: "When you're ready",
    title: 'Preparing for a transition',
    body: "You can share the financial history and operating information we've organized with the professionals you choose to advise on a sale.",
  },
];

// `spot` is the id links use to reach each service. It keeps the ids the earlier titles produced, so old links still land.
export const SERVICES = [
  {
    title: 'Strategic Value Assessments',
    spot: 'strategic-value-assessment',
    short: 'An advisory opinion of what the business is worth and the factors that influence the estimate.',
    body: [
      'We assess what your business is worth today and explain how we reached that opinion. The starting point is what the company earns, how consistently it earns it, and what a change of ownership might mean for those earnings.',
      'We review financial trends alongside the circumstances behind them. A large customer relationship, a one-time expense, or a responsibility only the owner can handle may change how we interpret the figures.',
      'We walk you through the estimate, its assumptions, and the factors worth addressing. At follow-up meetings, we review changes that could affect the estimate.',
    ],
    listTitle: 'What we review',
    included: [
      'An advisory opinion of enterprise value',
      'Comparable businesses or transactions where relevant data is available',
      'Factors supporting or limiting value',
      'Gaps in the available records',
      'Earnings adjustments and valuation multiples',
      'Customer concentration and reliance on the owner',
      'The estimate and its assumptions, discussed with you',
      'Changes since the previous assessment',
    ],
  },
  {
    title: 'Operational Efficiency Consulting',
    spot: 'operational-efficiency',
    short: 'A closer look at costs, margins, and where the business uses its time and resources.',
    body: [
      'We examine which work contributes most to profit, where costs have risen, and how quickly sales turn into cash. The detail available in your records helps determine where we can look more closely.',
      'We discuss the findings with you before recommending a change. A margin decline might reflect higher material costs, a different mix of jobs, or work that took longer than expected. Each points to a different decision.',
      'We recommend where to start, identify a measure to follow, and review the results with you as new figures come in.',
    ],
    listTitle: 'Areas we examine',
    included: [
      'Profitability by job, product, or service where records allow',
      'Direct costs and overhead',
      'How work moves through the business',
      'The effect of pricing and costs on margins',
      'Staffing, capacity, and output',
      'Opportunities to improve cash flow',
      'Priorities and next steps',
      'Results after a change',
    ],
  },
  {
    title: 'Strategic Growth Advisory',
    spot: 'strategic-growth-advisory',
    short: 'An assessment of growth opportunities and the people, capacity, and cash they would require.',
    body: [
      'We help you evaluate where to grow and what the business can support. We look at the customers you serve, the demand you see, and the capacity available to take on more work.',
      'Together, we examine what an opportunity would require in staffing, equipment, or working capital. We compare those requirements with the earnings you expect and make the assumptions clear.',
      'Once you choose a direction, we agree on milestones and review progress as demand, costs, and capacity change.',
    ],
    listTitle: 'Growth decisions we support',
    included: [
      'Which customer groups or markets to pursue',
      'How much revenue a growth opportunity could bring',
      'Ways to reach additional customers',
      'Staffing and capacity requirements',
      'Which opportunities to pursue first',
      'Expected costs and potential returns',
      'Milestones for the chosen plan',
      'Adjustments as results come in',
    ],
  },
];

export const WHO = [
  'Owners preparing for a future sale or transition',
  'Owners seeking an informed estimate of business value',
  'Companies facing narrower margins or slower growth',
  'Owners weighing the cost of taking on more work',
  'Co-owners who need a common basis for decisions',
  'Owners preparing the company to run with less day-to-day involvement from them',
];

export const OUR_JOB = [
  ['Collect the records', 'We gather relevant accounting exports, bank statements, invoices, payroll reports, and job records.'],
  [
    'Work with paper records',
    'We use relevant paper records in the assessment. If substantial scanning or data entry is needed, we’ll agree on the scope and cost with you before we begin.',
  ],
  ['Assemble the business history', 'We bring records from different periods and sources into a consistent view of the company.'],
  ['Assess performance and value', 'We examine earnings, cash flow, and operating trends to understand what influences business value.'],
  ['Prepare recommendations', 'We identify options, explain the reasoning, and bring the decisions to you for discussion.'],
  ['Update the analysis', 'We incorporate new records as they become available and review material changes with you.'],
];

export const YOUR_JOB = [
  ['Share existing records', 'Share the records you already have and let us know if any are only available on paper.'],
  ['Meet with us regularly', "Tell us what's happening in the business and help us interpret changes in the numbers."],
  ['Choose the next steps', 'Decide which recommendations fit your priorities and what you want to put into practice.'],
];

// `tag` is the small caption on the steps that repeat.
export const STEPS: { title: string; body: string; tag?: string }[] = [
  { title: 'Introductory call', body: "In a 30-minute conversation, we discuss your business, your priorities, and whether our services fit. There's nothing to prepare." },
  {
    title: 'Records collection',
    body: 'We start with the statements, spreadsheets, and invoices you already use. If relevant information is only on paper, we’ll identify what we need and discuss how to handle it.',
  },
  {
    title: 'Initial assessment',
    body: "We review the company's financial history and operations, develop an advisory opinion of value, and explain the assumptions behind it.",
  },
  {
    title: 'Review and recommendations',
    body: "We sit down with you to discuss what the figures show, hear what's changed in the business, and agree on the next decision that needs attention.",
    tag: 'At each meeting',
  },
  { title: 'Follow-up on decisions', body: 'We record the actions you choose and review the relevant measures as new information comes in.', tag: 'Between meetings' },
  {
    title: 'Preparation for a future sale',
    body: 'If you decide to pursue a sale, we review the business history and outstanding questions with you so you can brief your chosen exit advisor.',
  },
];

export const PRINCIPLES = [
  ['Company records', 'We start with the books and operating records you already use. Your knowledge of the business helps explain changes in the figures.'],
  ['Business-level advice', 'Our engagements cover company value, operations, and growth. Personal financial planning and transaction services fall outside that scope.'],
  ['Practical recommendations', 'We explain what we suggest changing, why it deserves attention, and how we can assess the result.'],
  ['Regular advisor meetings', 'You meet with the people reviewing your business. Meetings give you time to question an assumption, explain a change, or weigh a decision.'],
  ['Clear assumptions', 'We distinguish documented figures from estimates and identify missing information that could affect a conclusion.'],
  [
    'An advisory opinion of value',
    'Our assessment reflects the records, assumptions, and market information available at the time. It is a non-certified opinion of value. An eventual sale price depends on the transaction.',
  ],
];

// Names, credentials, and bios as each person approved them. Nothing here claims client results or names another firm.
export const TEAM = [
  {
    name: 'Kevin Gianfortune, CBEC, AIF',
    role: 'Business Exit Planning',
    bio: 'Kevin is a Certified Business Exit Consultant with more than 20 years in financial services. He founded a financial planning practice and has worked with business owners preparing for retirement. At StrataSight, he helps owners identify which responsibilities they’ll need to hand over and what the business needs to operate when they step away.',
    skills: ['Owner transition', 'Management succession', 'Exit readiness'],
  },
  {
    name: 'James Owens, CFA, CEPA, CM&AA',
    role: 'Strategic Value Advisory',
    bio: 'James leads StrataSight’s assessments of business value and profitability. His experience evaluating acquisition opportunities and helping integrate businesses after purchase gives him insight into what a buyer looks for and what it takes to run a company after ownership changes. He works with owners to understand what drives earnings and which improvements deserve attention.',
    skills: ['Business valuation', 'Profitability analysis', 'Acquisition evaluation'],
  },
  {
    name: 'Tom Smith',
    role: 'Data & Business Intelligence',
    bio: 'Tom built the StrataSight platform and brings professional experience in software engineering and business data analysis. His work spans backend systems, real-time dashboards, and tools that automate reporting. At StrataSight, he brings financial and operating records together so owners can trace the figures behind a recommendation and see what changes after they act on it.',
    skills: ['Platform development', 'Data analysis', 'Reporting automation'],
  },
];
