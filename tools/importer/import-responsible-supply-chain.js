/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import accordionParser from './parsers/accordion.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'accordion': accordionParser,
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'responsible-supply-chain',
  description: 'Corporate responsibility page with hero image, stats grid, code of conduct quote, sidebar navigation, long-form content sections, FAQ accordion, and related content cards',
  urls: [
    'https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html'
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        '#maincontent > .aem-Grid > div:nth-child(1)'
      ]
    },
    {
      name: 'columns',
      instances: [
        '#maincontent > .aem-Grid > div:nth-child(3)',
        '#maincontent > .aem-Grid > div:nth-child(5)',
        '#maincontent > .aem-Grid > div:nth-child(7)',
        '#maincontent > .aem-Grid > div:nth-child(9)'
      ]
    },
    {
      name: 'accordion',
      instances: [
        '#maincontent > .aem-Grid > div:nth-child(10) .accordion.panelcontainer'
      ]
    },
    {
      name: 'cards',
      instances: [
        '#maincontent > .aem-Grid > div:nth-child(11) .grid.cmp-grid-custom'
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
      name: 'Page Title',
      selector: '#maincontent > .aem-Grid > div:nth-child(2)',
      style: 'overlap-predecessor',
      blocks: [],
      defaultContent: ['.cmp-breadcrumb', '.cmp-title h1', '.cmp-text p', '.cmp-separator']
    },
    {
      id: 'section-2',
      name: 'Stats Grid',
      selector: '#maincontent > .aem-Grid > div:nth-child(3)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Code of Conduct',
      selector: '#maincontent > .aem-Grid > div:nth-child(4)',
      style: 'lavender-blue',
      blocks: [],
      defaultContent: ['.cmp-title h2', '.cmp-text p', 'a.internal-cta']
    },
    {
      id: 'section-4',
      name: 'Sidebar and Social Responsibility',
      selector: '#maincontent > .aem-Grid > div:nth-child(5)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Supplier Risk Management',
      selector: '#maincontent > .aem-Grid > div:nth-child(6)',
      style: 'lavender-blue',
      blocks: [],
      defaultContent: ['.cmp-title h2', '.cmp-text p', '.cmp-separator', '.cmp-container__bg-image']
    },
    {
      id: 'section-6',
      name: 'Supplier Inclusion Header',
      selector: '#maincontent > .aem-Grid > div:nth-child(7)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Supplier Inclusion Details',
      selector: '#maincontent > .aem-Grid > div:nth-child(9)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'DSCSA FAQ Accordion',
      selector: '#maincontent > .aem-Grid > div:nth-child(10)',
      style: null,
      blocks: ['accordion'],
      defaultContent: ['.cmp-title h2', '.cmp-text p']
    },
    {
      id: 'section-10',
      name: 'Related Content Cards',
      selector: '#maincontent > .aem-Grid > div:nth-child(11)',
      style: 'light-grey',
      blocks: ['cards'],
      defaultContent: ['.title h3']
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
