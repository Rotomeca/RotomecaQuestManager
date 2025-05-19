const {
  FILE_SEPARATOR,
  EMPTY_STRING,
} = require('@rotomeca/framework-electron');
const RotomecaPromise = require('@rotomeca/promise');
const { dialog, app } = require('electron');

class FileManager {
  constructor() {}

  /**
   * Ouvre une boite de dialogue pour selectionner un dossier
   * @param {string} title Titre de la boite de dialogue
   * @param {Electron.BrowserWindow} window Fenetre de la boite de dialogue
   * @returns {RotomecaPromise<string | false>}
   * @async
   * @private
   * @static
   */
  static #_LoadFolder(title, window) {
    return RotomecaPromise.Start(async (manager) => {
      var returnData = null;
      const result = await dialog.showOpenDialog(window, {
        properties: ['openDirectory'],
        title,
      });

      if (
        manager.state() === RotomecaPromise.PromiseStates.cancelled ||
        result.canceled
      )
        returnData = false;
      else returnData = result.filePaths[0];
      return returnData;
    });
  }

  /**
   * Ouvre une boite de dialogue pour selectionner le dossier du projet rpg maker mz
   * @returns {RotomecaPromise<string | false>}
   * @async
   * @static
   */
  static LoadProject() {
    return RotomecaPromise.Start(async (manager) => {
      let returnData = false;
      let childPromise = this.#_LoadFolder(
        'Sélectionner un repertoire RPG Maker MZ',
      );

      if (manager.state() === RotomecaPromise.PromiseStates.cancelled)
        await childPromise.abort();

      while (childPromise.isPending()) {
        if (manager.state() === RotomecaPromise.PromiseStates.cancelled) {
          await childPromise.abort();
          break;
        }

        await RotomecaPromise.Sleep(100);
      }

      const result = await childPromise;

      if (result) {
        const fs = require('fs');
        // Check if the folder is a RPG Maker MZ project
        // Check .rmmzproject
        const hasProject = fs.existsSync(
          `${result}${FILE_SEPARATOR}game.rmmzproject`,
        );
        // Check js folder
        const hasJs = fs.existsSync(`${result}${FILE_SEPARATOR}js`);
        // Check data folder
        const hasData = fs.existsSync(`${result}${FILE_SEPARATOR}data`);

        if (hasProject && hasJs && hasData) returnData = result;
      }

      return returnData;
    });
  }

  /**
   *
   * @param {string} path
   * @returns {RotomecaPromise<ProjectData>}
   */
  static LoadProjectData(path) {
    return new RotomecaPromise(this.#_LoadProjectData.bind(this, path));
  }

  /**
   *
   * @param {*} path
   * @param {import('@rotomeca/promise').PromiseManager} manager
   * @returns {Promise<ProjectData>}
   */
  static async #_LoadProjectData(path, manager) {
    const fs = require('fs');
    let promises = [];
    //Récupération du titre
    promises.push(fs.promises.readFile(`${path}${FILE_SEPARATOR}package.json`));

    /**
     * @type {PromiseSettledResult<Buffer>[]}
     */
    const data = await RotomecaPromise.AllSettled(...promises);

    if (manager.state() === RotomecaPromise.PromiseStates.cancelled)
      return false;

    return new ProjectData({
      title: data[0].value.toString(),
    });
  }
}

class ProjectData {
  #_title = EMPTY_STRING;
  constructor({ title }) {
    this.#_setup({ title });
  }

  #_setup({ title }) {
    try {
      this.#_title = JSON.parse(title).window.title;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @type {string}
   * @readonly
   */
  get title() {
    return this.#_title;
  }

  serialize() {
    return JSON.stringify({
      title: this.title,
    });
  }
}

module.exports = FileManager;
