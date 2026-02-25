var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-our-people.js
  var import_our_people_exports = {};
  __export(import_our_people_exports, {
    default: () => import_our_people_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".cmp-container__bg-image, .cmp-image__image, img");
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const img = document.createElement("img");
      img.src = bgImage.src || bgImage.getAttribute("src") || "";
      img.alt = bgImage.alt || bgImage.getAttribute("alt") || "";
      imgFrag.appendChild(img);
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    cells.push([""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const gridCells = Array.from(element.querySelectorAll(":scope .grid-row > .grid-cell"));
    const contentCells = gridCells.filter((cell) => {
      if (cell.querySelector("h1, h2, h3, h4, h5, h6, p, img, picture, a, ul, ol, table, video")) return true;
      if (cell.textContent.trim().length > 0) return true;
      return false;
    });
    if (contentCells.length === 0) return;
    const row = contentCells.map((cell) => {
      const frag = document.createDocumentFragment();
      while (cell.firstChild) {
        frag.appendChild(cell.firstChild);
      }
      return frag;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote.js
  function parse3(element, { document }) {
    const quoteTextEl = element.querySelector(".cmp-quote__text, .cmp-quote p");
    const authorName = element.querySelector(".author-name");
    const authorTitle = element.querySelector(".author-title");
    const cells = [];
    const quoteFrag = document.createDocumentFragment();
    quoteFrag.appendChild(document.createComment(" field:quotation "));
    if (quoteTextEl) {
      const p = document.createElement("p");
      p.textContent = quoteTextEl.textContent.trim();
      quoteFrag.appendChild(p);
    }
    cells.push([quoteFrag]);
    const attrFrag = document.createDocumentFragment();
    attrFrag.appendChild(document.createComment(" field:attribution "));
    if (authorName || authorTitle) {
      const p = document.createElement("p");
      if (authorName) {
        p.textContent = authorName.textContent.trim();
      }
      if (authorTitle) {
        const em = document.createElement("em");
        em.textContent = authorTitle.textContent.trim();
        p.appendChild(document.createElement("br"));
        p.appendChild(em);
      }
      attrFrag.appendChild(p);
    }
    cells.push([attrFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse4(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-accordion__item"));
    const cells = items.map((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(" field:summary "));
      if (titleText) {
        summaryFrag.appendChild(document.createTextNode(titleText));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (panel) {
        const textDivs = Array.from(panel.querySelectorAll(".cmp-text"));
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
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]'
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "banner",
        "header",
        'nav[aria-label="Primary"]',
        ".abbvie-breadcrumb",
        ".cmp-breadcrumb"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        'button[aria-label="Scroll to top of page"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".separator"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("[data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
      });
      element.querySelectorAll("[data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-our-people.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "quote": parse3,
    "accordion": parse4
  };
  var PAGE_TEMPLATE = {
    name: "our-people",
    description: "Science people page showcasing key scientists, researchers and leaders at AbbVie",
    urls: [
      "https://www.abbvie.com/science/our-people.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          "#maincontent > .aem-Grid > div:nth-child(1)",
          "#maincontent > .aem-Grid > div.video.aem-GridColumn"
        ]
      },
      {
        name: "columns",
        instances: [
          ".grid.no-bottom-margin",
          ".grid.cmp-grid-custom.no-bottom-margin",
          ".grid:not(.cmp-grid-custom):not(.no-bottom-margin)",
          "#maincontent > .aem-Grid > div:nth-child(4) .grid",
          "#maincontent > .aem-Grid > div:nth-child(7) .grid.cmp-grid-custom"
        ]
      },
      {
        name: "quote",
        instances: [
          ".container.semi-transparent-layer"
        ]
      },
      {
        name: "accordion",
        instances: [
          ".accordion.panelcontainer"
        ]
      }
    ],
    sections: [
      {
        id: "section-0",
        name: "Hero Image",
        selector: "#maincontent > .aem-Grid > div:nth-child(1)",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-1",
        name: "Page Title with Breadcrumb",
        selector: "#maincontent > .aem-Grid > div:nth-child(2)",
        style: "overlap-predecessor",
        blocks: [],
        defaultContent: [".cmp-title h1", ".cmp-text p"]
      },
      {
        id: "section-2",
        name: "Video Grid Section",
        selector: "#maincontent > .aem-Grid > div:nth-child(3)",
        style: null,
        blocks: ["columns", "quote"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Explore R&D Community",
        selector: "#maincontent > .aem-Grid > div:nth-child(4)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Discovery Files Video",
        selector: "#maincontent > .aem-Grid > div.video.aem-GridColumn",
        style: "dark-blue",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "FAQ Accordion",
        selector: "#maincontent > .aem-Grid > div:nth-child(6)",
        style: null,
        blocks: ["accordion"],
        defaultContent: [".cmp-title h2"]
      },
      {
        id: "section-6",
        name: "CTA Banner",
        selector: "#maincontent > .aem-Grid > div:nth-child(7)",
        style: "dark-blue",
        blocks: ["columns"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_our_people_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_our_people_exports);
})();
