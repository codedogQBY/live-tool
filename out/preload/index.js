"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  //退出应用
  quit: () => electron.ipcRenderer.send("quit"),
  // 切换圆角
  toggleRound: (opt) => {
    electron.ipcRenderer.send("toggleRound", opt);
  },
  //切换全屏
  toggleFullscreen: () => {
    electron.ipcRenderer.send("toggleFullscreen");
  },
  //打开新窗口
  openNewWindow: (opt, url, isCloseCurrentWindow, title) => {
    electron.ipcRenderer.send("openNewWindow", opt, url, isCloseCurrentWindow, title);
  },
  // 设置窗口标题
  setTitle: (title) => {
    electron.ipcRenderer.send("setTitle", title);
  },
  // 拖拽窗口
  dragWindow: (offsetX, offsetY) => {
    electron.ipcRenderer.send("dragWindow", offsetX, offsetY);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
