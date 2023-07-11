import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      toggleFullscreen: () => void
      toggleRound: (opt: { aspectRatio: number; width: number; height: number }) => void
      setTitle: (title: any) => void
      quit: () => void
      openNewWindow: (opt?: BrowserWindowConstructorOptions, url?: string) => void
    }
  }
}
