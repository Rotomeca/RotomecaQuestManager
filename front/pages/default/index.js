/**
 * @typedef {import("@rotomeca/framework-electron/framework/front/JsHtml").JsHtml} JsHtml
 */

/**
 * @typedef Envs
 * @property {string} folderPath
 */

/**
 * @type {JsHtml}
 */
var JsHtml = JsHtml || null;
/**
 * @type {import("@rotomeca/framework-electron/framework/front/exporter").Exporter}
 */
var exporter = exporter || null;

if (!JsHtml) {
  throw new Error('JsHtml is not defined');
}

if (!exporter) {
  throw new Error('Exporter is not defined');
}

exporter.setTitle('Rotomeca Quest Manager')

let style = JsHtml.start
.style()
  .style_css_selector('h1')
    .style_css_prop('margin-top', '0')
  .style_css_selector_end()
  .style_css_selector('.center')
    .style_css_prop('text-align', 'center')
  .style_css_selector_end()
  .style_css_selector('body')
    .style_css_prop('width', 'unset')
    .style_css_prop('margin', '0 15px')
  .style_css_selector_end()
.end();

exporter.addToHeader(style);

let html = JsHtml.start
.h1({class: 'center'})
  .text('Rotomeca Quest Manager')
.end()
.p()
  .text('Ouvrez un dossier Rpg Maker MZ pour commencer.')
.end();


exporter.export(html);
  