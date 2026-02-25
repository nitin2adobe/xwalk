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

  // tools/importer/import-responsible-supply-chain.js
  var import_responsible_supply_chain_exports = {};
  __export(import_responsible_supply_chain_exports, {
    default: () => import_responsible_supply_chain_default
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

  // tools/importer/parsers/accordion.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/cards.js
  function parse4(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(".cardpagestory"));
    const cells = cardEls.map((card) => {
      const picture = card.querySelector("picture");
      const img = card.querySelector(".card-image, img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (picture) {
        imgFrag.appendChild(picture);
      } else if (img) {
        const cleanImg = document.createElement("img");
        cleanImg.src = img.src || img.getAttribute("src") || "";
        cleanImg.alt = img.alt || img.getAttribute("alt") || "";
        imgFrag.appendChild(cleanImg);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const eyebrow = card.querySelector(".card-eyebrow");
      const title = card.querySelector(".card-title");
      const description = card.querySelector(".card-description");
      const cta = card.querySelector(".card-cta");
      const link = card.querySelector("a");
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      if (title) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        p.appendChild(strong);
        textFrag.appendChild(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textFrag.appendChild(p);
      }
      if (cta && link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href || link.getAttribute("href") || "";
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      return [imgFrag, textFrag];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
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

  // tools/importer/import-responsible-supply-chain.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "accordion": parse3,
    "cards": parse4
  };
  var PAGE_TEMPLATE = {
    name: "responsible-supply-chain",
    description: "Corporate responsibility page with hero image, stats grid, code of conduct quote, sidebar navigation, long-form content sections, FAQ accordion, and related content cards",
    urls: [
      "https://www.abbvie.com/who-we-are/operating-with-integrity/responsible-supply-chain.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          "#maincontent > .aem-Grid > div:nth-child(1)"
        ]
      },
      {
        name: "columns",
        instances: [
          "#maincontent > .aem-Grid > div:nth-child(3)",
          "#maincontent > .aem-Grid > div:nth-child(5)",
          "#maincontent > .aem-Grid > div:nth-child(7)",
          "#maincontent > .aem-Grid > div:nth-child(9)"
        ]
      },
      {
        name: "accordion",
        instances: [
          "#maincontent > .aem-Grid > div:nth-child(10) .accordion.panelcontainer"
        ]
      },
      {
        name: "cards",
        instances: [
          "#maincontent > .aem-Grid > div:nth-child(11) .grid.cmp-grid-custom"
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
        name: "Page Title",
        selector: "#maincontent > .aem-Grid > div:nth-child(2)",
        style: "overlap-predecessor",
        blocks: [],
        defaultContent: [".cmp-breadcrumb", ".cmp-title h1", ".cmp-text p", ".cmp-separator"]
      },
      {
        id: "section-2",
        name: "Stats Grid",
        selector: "#maincontent > .aem-Grid > div:nth-child(3)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Code of Conduct",
        selector: "#maincontent > .aem-Grid > div:nth-child(4)",
        style: "lavender-blue",
        blocks: [],
        defaultContent: [".cmp-title h2", ".cmp-text p", "a.internal-cta"]
      },
      {
        id: "section-4",
        name: "Sidebar and Social Responsibility",
        selector: "#maincontent > .aem-Grid > div:nth-child(5)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Supplier Risk Management",
        selector: "#maincontent > .aem-Grid > div:nth-child(6)",
        style: "lavender-blue",
        blocks: [],
        defaultContent: [".cmp-title h2", ".cmp-text p", ".cmp-separator", ".cmp-container__bg-image"]
      },
      {
        id: "section-6",
        name: "Supplier Inclusion Header",
        selector: "#maincontent > .aem-Grid > div:nth-child(7)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Supplier Inclusion Details",
        selector: "#maincontent > .aem-Grid > div:nth-child(9)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "DSCSA FAQ Accordion",
        selector: "#maincontent > .aem-Grid > div:nth-child(10)",
        style: null,
        blocks: ["accordion"],
        defaultContent: [".cmp-title h2", ".cmp-text p"]
      },
      {
        id: "section-10",
        name: "Related Content Cards",
        selector: "#maincontent > .aem-Grid > div:nth-child(11)",
        style: "light-grey",
        blocks: ["cards"],
        defaultContent: [".title h3"]
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
  var import_responsible_supply_chain_default = {
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
  return __toCommonJS(import_responsible_supply_chain_exports);
})();
