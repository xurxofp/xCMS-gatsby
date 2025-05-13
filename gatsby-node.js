// gatsby-node.js
require('dotenv').config();
const { createRemoteFileNode } = require("gatsby-source-filesystem");

// Un “cache” en memoria para guardar los fileNode IDs
// la primera vez que procesamos cada post
const inlineImagesCache = {};

exports.onCreateNode = async ({ node, actions, store, cache, createNodeId, reporter }) => {
  const { createNodeField, createNode } = actions;

  // Sólo nos interesan los posts
  if (node.internal.type !== "STRAPI_RESUMYA_POST") {
    return;
  }

  // ¿Tenemos el HTML en esta instancia del nodo?
  let html = node.content?.data;
  
  if (html) {
    // 1) Sustituimos localhost por tu URL real de Strapi
    const base = process.env.STRAPI_API_URL || "http://localhost:1337";
    html = html.replace(/https?:\/\/localhost:1337/g, base);

    // 2) Extraemos todas las src="URL"
    const regex = /<img[^>]+src="(https?:\/\/[^">]+)"/g;
    const urls = Array.from(html.matchAll(regex), m => m[1]);
    reporter.info(`🔍 [HTML-phase] ${urls.length} inline image URL(s) en ${node.id}`);

    if (urls.length === 0) return;

    // 3) Creamos un File node por cada URL
    const fileNodes = (await Promise.all(
      urls.map(url =>
        createRemoteFileNode({
          url,
          parentNodeId: node.id,
          store,
          cache,
          createNode,
          createNodeId,
          reporter,
        }).catch(err => {
          reporter.warn(`❌ No pude bajar ${url}: ${err.message}`);
          return null;
        })
      )
    )).filter(Boolean);

    const ids = fileNodes.map(fn => fn.id);
    inlineImagesCache[node.id] = ids;

    // 4) Creamos el campo por primera vez
    if (ids.length) {
      createNodeField({
        node,
        name: "inlineImages",
        value: ids,
      });
      reporter.info(`✅ [HTML-phase] Attached ${ids.length} inlineImages a ${node.id}`);
    }

  } else {
    // Segunda vez que vemos este mismo post, sin HTML:
    // reutilizamos el cache para adjuntar el mismo campo
    const cached = inlineImagesCache[node.id];
    if (cached && cached.length) {
      createNodeField({
        node,
        name: "inlineImages",
        value: cached,
      });
      reporter.info(`⚡ [Final-phase] Attached cached ${cached.length} inlineImages a ${node.id}`);
    }
  }
};

exports.createSchemaCustomization = ({ actions, reporter }) => {
  reporter.info("👷 createSchemaCustomization running (extending STRAPI_RESUMYA_POST)");
  const { createTypes } = actions;
  createTypes(`
    # Simplemente añadimos inlineImages al tipo ya existente
    extend type STRAPI_RESUMYA_POST implements Node {
      inlineImages: [File] @link(by: "id", from: "fields.inlineImages")
    }
  `);
};
