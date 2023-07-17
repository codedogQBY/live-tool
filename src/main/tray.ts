import { Menu, Tray, BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import path, { join } from 'path'
import { is } from '@electron-toolkit/utils'
const tray = (): void => {
  const tray = new Tray(path.resolve(__dirname, '../../resources/videocameraTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '字幕',
      click: (): void => {
        const win = new BrowserWindow({
          width: 1080,
          height: 60,
          maxHeight: 60,
          minHeight: 60,
          alwaysOnTop: true,
          autoHideMenuBar: true,
          frame: false,
          transparent: true,
          ...(process.platform === 'linux' ? { icon } : {}),
          webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
          }
        })
        win.on('ready-to-show', () => {
          win.show()
        })
        //渲染进程中请求创建一个新窗口之前被调用
        win.webContents.setWindowOpenHandler((details) => {
          shell.openExternal(details.url)
          //取消新窗口创建
          return { action: 'deny' }
        })
        //设置窗口标题
        win.setTitle('字幕')
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
          win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/subtitle')
        } else {
          win.loadFile(join(__dirname, '../renderer/index.html' + '/subtitle'))
        }
      }
    },
    { label: '退出', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
}

export { tray }
