import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    getFaceCounts: (normalPath: string, iconPath: string) => ipcRenderer.invoke("get-face-counts", normalPath, iconPath),
    getPaths: () => ipcRenderer.invoke("get-paths"),
    savePaths: (normalPath: string, iconPath: string) => ipcRenderer.invoke("save-paths", normalPath, iconPath),
    fetchSortItOutSINations: () => ipcRenderer.invoke("fetch-sortitoutsi-nations"),
    openExternal: (url: string) => ipcRenderer.send("open-external", url),
    quitApp: () => ipcRenderer.send("quit-app"),
})
