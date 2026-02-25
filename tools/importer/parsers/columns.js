/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html
 * Extracts multi-column layouts from .grid.cmp-grid-custom, filtering out spacer columns.
 * Columns blocks do NOT require field hints (xwalk exception per hinting.md Rule 4).
 *
 * Source DOM structure:
 *   .grid.cmp-grid-custom > .grid-container > .grid-row > .grid-cell[.grid-row__col-with-N]
 *   Spacer cells have no meaningful content (empty or only separators).
 */
export default function parse(element, { document }) {
  const gridCells = Array.from(element.querySelectorAll(':scope .grid-row > .grid-cell'));

  // Filter out spacer columns (cells with no meaningful content)
  const contentCells = gridCells.filter((cell) => {
    if (cell.querySelector('h1, h2, h3, h4, h5, h6, p, img, picture, a, ul, ol, table, video')) return true;
    if (cell.textContent.trim().length > 0) return true;
    return false;
  });

  if (contentCells.length === 0) return;

  // Build single row with all content columns
  const row = contentCells.map((cell) => {
    const frag = document.createDocumentFragment();
    while (cell.firstChild) {
      frag.appendChild(cell.firstChild);
    }
    return frag;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
