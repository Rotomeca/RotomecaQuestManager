/**
 * @typedef {import("@rotomeca/framework-electron/framework/front/JsHtml").JsHtml} JsHtml
 */

/**
 * @typedef Envs
 * @property {string} folderPath
 * @property {string} projectName
 */


/**
 * @type {JsHtml}
 */
var JsHtml = JsHtml || null;
/**
 * @type {import("@rotomeca/framework-electron/framework/front/exporter").Exporter}
 */
var exporter = exporter || null;
var envs = envs || null;
if (!JsHtml) {
  throw new Error('JsHtml is not defined');
}

if (!exporter) {
  throw new Error('Exporter is not defined');
}

if (!envs) {
  throw new Error('Envs is not defined');
}

exporter.setTitle(`${envs.projectName} - BDD de Quêtes`);

exporter.export(JsHtml.start.div().end());