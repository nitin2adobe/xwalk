/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote block.
 * Base: quote. Source: https://www.abbvie.com/science/our-people.html
 * Extracts quotation text and attribution from .cmp-quote structure.
 * Quote model (xwalk): quotation (richtext), attribution (richtext).
 *
 * Source DOM structure:
 *   .container.semi-transparent-layer
 *     .cmp-container
 *       img.cmp-container__bg-image (background - not part of quote model)
 *       .grid.cmp-grid-custom > .grid-container > .grid-row > .grid-cell
 *         .quote .cmp-quote
 *           .cmp-quote__text-author-wrapper
 *             p.cmp-quote__text (quote text with decorative icon span)
 *             .cmp-quote__author-block
 *               span.author-name
 *               span.author-title
 */
export default function parse(element, { document }) {
  // Extract quote text (found: p.cmp-quote__text inside .cmp-quote)
  const quoteTextEl = element.querySelector('.cmp-quote__text, .cmp-quote p');

  // Extract author info (found: .author-name, .author-title inside .cmp-quote__author-block)
  const authorName = element.querySelector('.author-name');
  const authorTitle = element.querySelector('.author-title');

  const cells = [];

  // Row 1: Quotation with field hint
  const quoteFrag = document.createDocumentFragment();
  quoteFrag.appendChild(document.createComment(' field:quotation '));
  if (quoteTextEl) {
    const p = document.createElement('p');
    // Get text content, stripping the decorative icon span
    p.textContent = quoteTextEl.textContent.trim();
    quoteFrag.appendChild(p);
  }
  cells.push([quoteFrag]);

  // Row 2: Attribution with field hint (author name + em-wrapped title)
  const attrFrag = document.createDocumentFragment();
  attrFrag.appendChild(document.createComment(' field:attribution '));
  if (authorName || authorTitle) {
    const p = document.createElement('p');
    if (authorName) {
      p.textContent = authorName.textContent.trim();
    }
    if (authorTitle) {
      const em = document.createElement('em');
      em.textContent = authorTitle.textContent.trim();
      p.appendChild(document.createElement('br'));
      p.appendChild(em);
    }
    attrFrag.appendChild(p);
  }
  cells.push([attrFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote', cells });
  element.replaceWith(block);
}
