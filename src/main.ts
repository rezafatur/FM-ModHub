import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import type { IpcMainEvent } from "electron"
import fs from "node:fs";
import path from "node:path";
import Store from "electron-store";
import started from "electron-squirrel-startup";
import * as cheerio from "cheerio";

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
      webSecurity: false, // Allow cross-origin requests
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

function getConfigLastModified(dirPath: string): string | null {
  if (!fs.existsSync(dirPath)) return null;
  
  const configPath = path.join(dirPath, "config.xml");
  
  if (!fs.existsSync(configPath)) return null;
  
  try {
    const stats = fs.statSync(configPath);
    return stats.mtime.toISOString();
  } catch (error) {
    return null;
  }
}

// IPC Handlers
ipcMain.handle("get-face-counts", (_event, normalPath: string, iconPath: string) => {
  return {
    normal: countPngFiles(normalPath),
    icon: countPngFiles(iconPath),
    normalLastUpdate: getConfigLastModified(normalPath),
    iconLastUpdate: getConfigLastModified(iconPath),
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

// Fetch using Electron's net module which supports more browser-like behavior
ipcMain.handle("fetch-sortitoutsi-nations", async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) {
      throw new Error("Window not found");
    }
    
    // Use executeJavaScript to fetch from renderer context (bypasses CORS and Cloudflare)
    const result = await win.webContents.executeJavaScript(`
      (async () => {
        try {
          const response = await fetch("https://sortitoutsi.net/football-manager-2026/database", {
            method: "GET",
            headers: {
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
            },
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
          }
          
          const html = await response.text();
          return { success: true, html };
        } catch (error) {
          return { success: false, error: error.message };
        }
      })()
    `);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    const $ = cheerio.load(result.html);
    
    const nations: Array<{
      id: string;
      name: string;
      nickname: string;
      logo: string;
      newgens: string;
      isWomens: boolean;
      detailUrl: string;
    }> = [];
    
    $("table.table-striped tbody tr").each((_, element) => {
      const $row = $(element);
      const gender = $row.attr("class")?.includes("border-left-gender-womens") ? "womens" : "mens";
      
      const logoSrc = $row.find("td.row-icon img").attr("src") || "";
      const nameLink = $row.find("td.row-title a.item-title");
      const name = nameLink.text().trim();
      const detailUrl = nameLink.attr("href") || "";
      const nickname = $row.find("td.row-title .small.text-muted").text().trim();
      const newgens = $row.find("td").eq(2).text().trim();
      
      // Extract ID from URL
      const idMatch = detailUrl.match(/\/nation\/(\d+)\//);
      const id = idMatch ? idMatch[1] : "";
      
      if (name && id) {
        nations.push({
          id,
          name,
          nickname,
          logo: logoSrc,
          newgens,
          isWomens: gender === "womens",
          detailUrl,
        });
      }
    });
    
    return { success: true, data: nations };
  } catch (error) {
    let errorMessage = "Failed to fetch data from SortItOutSI";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
});

ipcMain.on("open-external", (_event: IpcMainEvent, url: string) => {
  shell.openExternal(url)
});

ipcMain.on("quit-app", () => {
  app.quit();
});