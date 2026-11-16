/**
 * Every move to a new page starts at its top. Instant rather than smooth, because a smooth scroll is
 * interrupted on phones when the new page's content arrives, leaving it part way down. Repeated after the
 * next frame for content that renders a moment later.
 */
export function scrollToTop() {
  const top = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  top();
  requestAnimationFrame(() => requestAnimationFrame(top));
}
