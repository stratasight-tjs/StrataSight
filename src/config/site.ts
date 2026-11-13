/** Site-wide settings. */
export const SITE = {
  name: 'StrataSight',
  domain: 'stratasight.net',
  contactEmail: 'info@stratasight.net',
  /** Where the contact form's email fallback is addressed. Kept separate from the address shown on the page. */
  formRecipient: 'thomas.smith@stratasight.net',
  /**
   * Hosted form endpoint (Formspree), for example 'https://formspree.io/f/abcdwxyz'.
   * While this is empty the contact form opens the visitor's own mail app instead.
   */
  formEndpoint: '',
  /** Relative paths so the site works on the custom domain and on a GitHub project URL. */
  demoPath: 'demo/',
  homeFromDemo: '../',
};
