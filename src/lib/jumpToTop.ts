/**
 * Sends the page to the top immediately.
 *
 * index.css sets `scroll-behavior: smooth` on <html>, which turns every
 * scrollTo on the site into an animated scroll — including the ones meant to
 * reset the page between routes. Arriving on a new page then meant starting
 * wherever the last one was left, often the footer, and travelling up from
 * there. Worse, anything that measures scroll position while that is still
 * running measures a number that is about to change.
 *
 * Turning the behaviour off for the one frame it takes is more reliable than
 * `behavior: "instant"`, which is newer and not honoured everywhere.
 */
export function jumpToTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}
