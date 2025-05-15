const Rotomeca = require("@rotomeca/framework-electron");
const { Menu, dialog } = require("electron");

class Index extends Rotomeca.Abstract.AAppObject {
  main() {
    this.onwindowallclosed.push(this.quit.bind(this));

    this.init().mainAsync();
  }

  init() {
    this.folderPath = Rotomeca.EMPTY_STRING;

    return this;
  }

  async mainAsync() {
    {
      // Chargement des fichiers de configuration
      const data = await this.loadSettingsData();

      if (data.loadSuccess) {
        this.folderPath = data.data.folderPath;
      }
    }
    let menu = Menu.buildFromTemplate([
      {
        label: "Fichier",
        submenu: [
          {
            label: "Ouvrir un dossier",
            accelerator: "CmdOrCtrl+O",
            click: async () => {
              const result = await dialog.showOpenDialog(mainWindow, {
                properties: ["openDirectory"],
                title: "Sélectionner un repertoire RPG Maker MZ",
              });

              if (result.canceled) return;

              this.folderPath = result.filePaths[0];
              this.saveSettings({ folderPath: this.folderPath });
              mainWindow.webContents.executeJavaScript(
                `window.rotomeca = ${JSON.stringify({ folderPath: this.folderPath })};`,
              );
            },
          },
          { type: "separator" },
          {
            label: "Quitter",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              this.quit();
            },
          },
        ],
      },
    ]);

    Menu.setApplicationMenu(menu);

    let mainWindow = this.createBrowserWindow("default", {
      windowConfig: {
        show: false,
      },
    });

    mainWindow.webContents.on("dom-ready", () => {
      mainWindow.webContents.executeJavaScript(`
        window.rotomeca = ${JSON.stringify({ folderPath: this.folderPath })};`);
    });

    mainWindow.addEnv("folderPath", this.folderPath);

    if (
      !this.isNullOrUndefined(this.folderPath) &&
      this.folderPath !== Rotomeca.EMPTY_STRING
    )
      mainWindow.changePage("database");

    mainWindow.show();
    mainWindow.webContents.openDevTools();
  }
}

Index.Run();
