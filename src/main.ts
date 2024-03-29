/* eslint-disable node/prefer-global/process */
import path from 'node:path'
import {
  BrowserWindow,
  Menu,
  Tray,
  app,
  ipcMain,
  nativeImage,
  nativeTheme,
} from 'electron'
import { author } from '../package.json'
import { store } from './services/store'
import { timeFormat } from './renderer/utils'
import { menu } from './menu'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow
let tray: Tray
let timer: NodeJS.Timeout
let sec = 0

let isTimerActive = false
let isQuitting = false

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line ts/no-require-imports
if (require('electron-squirrel-startup'))
  app.quit()

function createWindow() {
  const bounds = store.app.get('bounds')
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#181818' : '#fff',
    ...bounds,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })

  Menu.setApplicationMenu(menu)

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  }
  else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }

  if (isDev)
    mainWindow.webContents.openDevTools()

  mainWindow.on('move', () => store.app.set('bounds', mainWindow.getBounds()))
  mainWindow.on('resize', () =>
    store.app.set('bounds', mainWindow.getBounds()))

  mainWindow.on('close', (event: Event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    else {
      mainWindow = null
    }
  })
}

function createTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: isTimerActive ? 'Stop' : 'Start',
      click: () =>
        isTimerActive
          ? mainWindow.webContents.send('stop')
          : mainWindow.webContents.send('start'),
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])
}

function createTray() {
  tray = new Tray(nativeImage.createFromDataURL(''))

  tray.setTitle('00:00:00')
  tray.setContextMenu(createTrayMenu())

  tray.on('click', () => mainWindow.show())
}

app.on('ready', () => {
  createWindow()

  if (process.platform === 'darwin')
    createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('activate', () => {
  mainWindow.show()
})

if (process.platform === 'darwin') {
  ipcMain.on('tray-start-timer', () => {
    isTimerActive = true

    tray.setContextMenu(createTrayMenu())

    timer = setInterval(() => {
      sec++

      tray.setTitle(timeFormat(sec), {
        fontType: 'monospacedDigit',
      })
    }, 1000)
  })

  ipcMain.on('tray-stop-timer', () => {
    clearInterval(timer)

    sec = 0
    isTimerActive = false

    tray.setTitle('00:00:00')
    tray.setContextMenu(createTrayMenu())
  })

  app.setAboutPanelOptions({
    applicationName: app.name,
    applicationVersion: app.getVersion(),
    copyright: `${author.name} ©2024-${new Date().getFullYear()}`,
  })
}
