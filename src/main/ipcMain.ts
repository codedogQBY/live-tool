import { BrowserWindow, app, ipcMain, BrowserWindowConstructorOptions, shell,screen } from 'electron'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
//退出应用
ipcMain.on('quit', (event: Electron.IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (BrowserWindow.getAllWindows().length == 0) app.quit()
  else win?.close()
})

//切换圆角
ipcMain.on(
  'toggleRound',
  (event: Electron.IpcMainEvent, opt: { aspectRatio: number; width?: number; height?: number }) => {
    const win = BrowserWindow.fromWebContents(event.sender)!
    win.setAspectRatio(opt.aspectRatio)
    const { height } = win.getBounds()
    if (opt.aspectRatio == 1) {
      win.setBounds({ width: height, height })
    } else {
      win.setBounds({ width: Math.floor(height * 1.7), height })
    }
  }
)

//全屏切换
ipcMain.on('toggleFullscreen', (event: Electron.IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender)!
  win.setFullScreen(!win.isFullScreen())
  win.setAspectRatio(16 / 9)
})

// 打开新窗口
ipcMain.on(
  'openNewWindow',
  (
    event: Electron.IpcMainEvent,
    opt: BrowserWindowConstructorOptions = {},
    url = '/',
    isCloseCurrentWindow = false,
    title = ''
  ) => {
    //获取用于控制网页的webContents对象
    const webContents = event.sender
    //获取原窗口
    const currentWin = BrowserWindow.fromWebContents(webContents)

    const win = new BrowserWindow({
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      },
      ...opt
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
    win.setTitle(title)

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(process.env['ELECTRON_RENDERER_URL'] + url)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html' + url))
    }

    if (isCloseCurrentWindow) {
      // 关闭原窗口
      currentWin.close()
    }
    return win
  }
)

// 设置标题
ipcMain.on('setTitle', (event: Electron.IpcMainEvent, title: string) => {
  //获取用于控制网页的webContents对象
  const webContents = event.sender
  //获取窗口
  const win = BrowserWindow.fromWebContents(webContents)
  //设置窗口标题
  win.setTitle(title)
})

// 监听渲染进程发送的消息，并在接收到消息时处理拖拽逻辑
ipcMain.on('dragWindow', (event, offsetX: number, offsetY: number) => {
  //获取用于控制网页的webContents对象
  const webContents = event.sender
  //获取窗口
  const win = BrowserWindow.fromWebContents(webContents)
  const [x, y] = win.getPosition()
  win.setPosition(x + offsetX, y + offsetY)
})

ipcMain.on('setSubtitlePosition', (event) => {
  // 获取屏幕的宽度和高度
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  //获取用于控制网页的webContents对象
  const webContents = event.sender
  //获取窗口
  const win = BrowserWindow.fromWebContents(webContents)

  // 设置窗口的位置
  const winWidth = win.getSize()[0];
  const winHeight = win.getSize()[1];
  const posX = Math.round((width - winWidth) / 2);
  const posY = Math.round(height - winHeight - 50);

  // 设置窗口的位置
  win.setPosition(posX, posY);
})
