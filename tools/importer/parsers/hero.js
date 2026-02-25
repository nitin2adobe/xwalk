/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html
 * Extracts background image from .cmp-container__bg-image.
 * Hero model (xwalk): image (reference), imageAlt (collapsed), text (richtext).
 * Block library: 1 col, 3 rows (name, image, text content).
 */
export default function parse(element, { document }) {
  // Extract background image (found: img.cmp-container__bg-image)
  const bgImage = element.querySelector('.cmp-container__bg-image, .cmp-image__image, img');

  const cells = [];

  // Row 1: Image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const img = document.createElement('img');
    img.src = bgImage.src || bgImage.getAttribute('src') || '';
    img.alt = bgImage.alt || bgImage.getAttribute('alt') || '';
    imgFrag.appendChild(img);
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content (empty on this page - hero is image-only)
  // Row must exist per xwalk requirements, no field hint for empty cells
  cells.push(['']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
