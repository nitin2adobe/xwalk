/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie cleanup.
 * Removes non-authorable content: header, footer, nav, cookie consent, breadcrumbs,
 * decorative separators.
 * Selectors from captured DOM of abbvie.com pages.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent overlay (found: #onetrust-consent-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
    ]);

    // Fix overflow issues if present
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'scroll';
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header/navigation (found: banner element, nav[aria-label="Primary"])
    WebImporter.DOMUtils.remove(element, [
      'banner',
      'header',
      'nav[aria-label="Primary"]',
      '.abbvie-breadcrumb',
      '.cmp-breadcrumb',
    ]);

    // Remove footer (found: button "Scroll to top of page", footer links, social media)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      'button[aria-label="Scroll to top of page"]',
    ]);

    // Remove decorative AEM separator components (contain <hr> elements that would
    // interfere with EDS section break detection). Section breaks are added by the
    // sections transformer instead.
    WebImporter.DOMUtils.remove(element, [
      '.separator',
    ]);

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean tracking/data attributes
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
    element.querySelectorAll('[data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-clickable');
    });
  }
}
