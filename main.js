const Rotomeca = require('@rotomeca/framework-electron');
const { Menu } = require('electron');
const FileManager = require('./classes/FileManager');

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
        label: 'Fichier',
        submenu: [
          {
            label: `Ouvrir un${this.folderPath ? ' autre' : Rotomeca.EMPTY_STRING} dossier`,
            accelerator: 'CmdOrCtrl+O',
            click: async () => {
              const result = await FileManager.LoadProject();

              if (!result) return;

              this.folderPath = result;
              mainWindow.addEnv('folderPath', this.folderPath);
              this.saveSettings({ folderPath: this.folderPath });
              mainWindow.changePage('database');
            },
          },
          {
            label: 'Sauvegarder',
            accelerator: 'CmdOrCtrl+S',
            click: async () => {},
            enabled:
              this.folderPath && this.folderPath !== Rotomeca.EMPTY_STRING,
          },
          { type: 'separator' },
          {
            label: 'Quitter',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
              this.quit();
            },
          },
        ],
      },
    ]);

    Menu.setApplicationMenu(menu);

    let mainWindow = this.createBrowserWindow('default', {
      page:
        !this.isNullOrUndefined(this.folderPath) &&
        this.folderPath !== Rotomeca.EMPTY_STRING
          ? 'database'
          : 'default',
      windowConfig: {
        show: false,
      },
    });

    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.webContents.executeJavaScript(`
        window.rotomeca = ${JSON.stringify({ folderPath: this.folderPath })};`);
    });

    mainWindow.addEnv('folderPath', this.folderPath);

    mainWindow.show();
    mainWindow.webContents.openDevTools();
  }
}

Index.Run();
