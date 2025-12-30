import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import type { IpcMainEvent } from "electron"
import fs from "node:fs";
import path from "node:path";
import Store from "electron-store";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Initialize electron-store with defaults
const store = new Store({
  defaults: {
    normalPath: "",
    iconPath: "",
  },
});

const createWindow = () => {
  Menu.setApplicationMenu(null);
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    icon: path.join(__dirname, "../assets/icon.png"), // Windows & Linux
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  // macOS dock icon
  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "../assets/icon.png"));
  }
  
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // Development
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Production
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function countPngFiles(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(
      (file) =>
        file.isFile() && path.extname(file.name).toLowerCase() === ".png"
    ).length;
}

// IPC Handlers
ipcMain.handle("get-face-counts", (_event, normalPath: string, iconPath: string) => {
  return {
    normal: countPngFiles(normalPath),
    icon: countPngFiles(iconPath),
  };
});

ipcMain.handle("get-paths", () => {
  return {
    normalPath: store.get("normalPath") as string,
    iconPath: store.get("iconPath") as string,
  };
});

ipcMain.handle("save-paths", (_event, normalPath: string, iconPath: string) => {
  store.set("normalPath", normalPath);
  store.set("iconPath", iconPath);
  return { success: true };
});

ipcMain.on("open-external", (_event: IpcMainEvent, url: string) => {
  shell.openExternal(url)
});

ipcMain.on("quit-app", () => {
  app.quit();
});