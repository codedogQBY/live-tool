import { BrowserWindowConstructorOptions, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  //退出应用
  quit: (): void => ipcRenderer.send('quit'),
  // 切换圆角
  toggleRound: (opt: { aspectRatio: number; width: number; height: number }): void => {
    ipcRenderer.send('toggleRound', opt)
  },
  //切换全屏
  toggleFullscreen: (): void => {
    ipcRenderer.send('toggleFullscreen')
  },
  //打开新窗口
  openNewWindow: (
    opt?: BrowserWindowConstructorOptions,
    url?: string,
    isCloseCurrentWindow?: boolean,
    title?: string
  ) => {
    return ipcRenderer.send('openNewWindow', opt, url, isCloseCurrentWindow, title)
  },
  // 设置窗口标题
  setTitle: (title): void => {
    ipcRenderer.send('setTitle', title)
  },
  // 拖拽窗口
  dragWindow: (offsetX: number, offsetY: number): void => {
    ipcRenderer.send('dragWindow', offsetX, offsetY)
  },
  // 设置窗口位置
  setSubtitlePosition: (): void => {
    ipcRenderer.send('setSubtitlePosition')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
