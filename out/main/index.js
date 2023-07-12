"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
electron.ipcMain.on("quit", (event) => {
  const win = electron.BrowserWindow.fromWebContents(event.sender);
  if (electron.BrowserWindow.getAllWindows().length == 0)
    electron.app.quit();
  else
    win?.close();
});
electron.ipcMain.on(
  "toggleRound",
  (event, opt) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    win.setAspectRatio(opt.aspectRatio);
    const { height } = win.getBounds();
    if (opt.aspectRatio == 1) {
      win.setBounds({ width: height, height });
    } else {
      win.setBounds({ width: Math.floor(height * 1.7), height });
    }
  }
);
electron.ipcMain.on("toggleFullscreen", (event) => {
  const win = electron.BrowserWindow.fromWebContents(event.sender);
  win.setFullScreen(!win.isFullScreen());
  win.setAspectRatio(16 / 9);
});
electron.ipcMain.on(
  "openNewWindow",
  (event, opt = {}, url = "/", isCloseCurrentWindow = false, title = "") => {
    const webContents = event.sender;
    const currentWin = electron.BrowserWindow.fromWebContents(webContents);
    const win = new electron.BrowserWindow({
      ...process.platform === "linux" ? { icon } : {},
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false
      },
      ...opt
    });
    win.on("ready-to-show", () => {
      win.show();
    });
    win.webContents.setWindowOpenHandler((details) => {
      electron.shell.openExternal(details.url);
      return { action: "deny" };
    });
    win.setTitle(title);
    if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      win.loadURL(process.env["ELECTRON_RENDERER_URL"] + url);
    } else {
      win.loadFile(path.join(__dirname, "../renderer/index.html" + url));
    }
    if (isCloseCurrentWindow) {
      currentWin.close();
    }
    return win;
  }
);
electron.ipcMain.on("setTitle", (event, title) => {
  const webContents = event.sender;
  const win = electron.BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
});
electron.ipcMain.on("dragWindow", (event, offsetX, offsetY) => {
  const webContents = event.sender;
  const win = electron.BrowserWindow.fromWebContents(webContents);
  const [x, y] = win.getPosition();
  win.setPosition(x + offsetX, y + offsetY);
});
electron.ipcMain.on("setSubtitlePosition", (event) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const webContents = event.sender;
  const win = electron.BrowserWindow.fromWebContents(webContents);
  const winWidth = win.getSize()[0];
  const winHeight = win.getSize()[1];
  const posX = Math.round((width - winWidth) / 2);
  const posY = Math.round(height - winHeight - 50);
  win.setPosition(posX, posY);
});
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 400,
    height: 200,
    autoHideMenuBar: true,
    resizable: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.center();
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
