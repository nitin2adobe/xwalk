/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html
 * Container block: each card = 1 row with 2 cols [image, text].
 * Card model (xwalk): image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll('.cardpagestory'));

  const cells = cardEls.map((card) => {
    const picture = card.querySelector('picture');
    const img = card.querySelector('.card-image, img');

    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (picture) {
      imgFrag.appendChild(picture);
    } else if (img) {
      const cleanImg = document.createElement('img');
      cleanImg.src = img.src || img.getAttribute('src') || '';
      cleanImg.alt = img.alt || img.getAttribute('alt') || '';
      imgFrag.appendChild(cleanImg);
    }

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    const eyebrow = card.querySelector('.card-eyebrow');
    const title = card.querySelector('.card-title');
    const description = card.querySelector('.card-description');
    const cta = card.querySelector('.card-cta');
    const link = card.querySelector('a');

    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      p.appendChild(strong);
      textFrag.appendChild(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textFrag.appendChild(p);
    }
    if (cta && link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href') || '';
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    return [imgFrag, textFrag];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
