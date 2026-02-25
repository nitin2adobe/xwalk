/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block.
 * Base: accordion. Source: https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html
 * Container block: each item = 1 row with 2 cols [summary, text].
 * Accordion-item model (xwalk): summary (text), text (richtext).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  const cells = items.map((item) => {
    const titleEl = item.querySelector('.cmp-accordion__title');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const panel = item.querySelector('.cmp-accordion__panel');

    const summaryFrag = document.createDocumentFragment();
    summaryFrag.appendChild(document.createComment(' field:summary '));
    if (titleText) {
      summaryFrag.appendChild(document.createTextNode(titleText));
    }

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (panel) {
      const textDivs = Array.from(panel.querySelectorAll('.cmp-text'));
      if (textDivs.length > 0) {
        textDivs.forEach((div) => {
          while (div.firstChild) {
            textFrag.appendChild(div.firstChild);
          }
        });
      } else {
        while (panel.firstChild) {
          textFrag.appendChild(panel.firstChild);
        }
      }
    }

    return [summaryFrag, textFrag];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
