/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import quoteParser from './parsers/quote.js';
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'quote': quoteParser,
  'accordion': accordionParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'our-people',
  description: 'Science people page showcasing key scientists, researchers and leaders at AbbVie',
  urls: [
    'https://www.abbvie.com/science/our-people.html'
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        '#maincontent > .aem-Grid > div:nth-child(1)',
        '#maincontent > .aem-Grid > div.video.aem-GridColumn'
      ]
    },
    {
      name: 'columns',
      instances: [
        '.grid.no-bottom-margin',
        '.grid.cmp-grid-custom.no-bottom-margin',
        '.grid:not(.cmp-grid-custom):not(.no-bottom-margin)',
        '#maincontent > .aem-Grid > div:nth-child(4) .grid',
        '#maincontent > .aem-Grid > div:nth-child(7) .grid.cmp-grid-custom'
      ]
    },
    {
      name: 'quote',
      instances: [
        '.container.semi-transparent-layer'
      ]
    },
    {
      name: 'accordion',
      instances: [
        '.accordion.panelcontainer'
      ]
    }
  ],
  sections: [
    {
      id: 'section-0',
      name: 'Hero Image',
      selector: '#maincontent > .aem-Grid > div:nth-child(1)',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-1',
      name: 'Page Title with Breadcrumb',
      selector: '#maincontent > .aem-Grid > div:nth-child(2)',
      style: 'overlap-predecessor',
      blocks: [],
      defaultContent: ['.cmp-title h1', '.cmp-text p']
    },
    {
      id: 'section-2',
      name: 'Video Grid Section',
      selector: '#maincontent > .aem-Grid > div:nth-child(3)',
      style: null,
      blocks: ['columns', 'quote'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Explore R&D Community',
      selector: '#maincontent > .aem-Grid > div:nth-child(4)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Discovery Files Video',
      selector: '#maincontent > .aem-Grid > div.video.aem-GridColumn',
      style: 'dark-blue',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'FAQ Accordion',
      selector: '#maincontent > .aem-Grid > div:nth-child(6)',
      style: null,
      blocks: ['accordion'],
      defaultContent: ['.cmp-title h2']
    },
    {
      id: 'section-6',
      name: 'CTA Banner',
      selector: '#maincontent > .aem-Grid > div:nth-child(7)',
      style: 'dark-blue',
      blocks: ['columns'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
