/* eslint-disable node/prefer-global/process */
import os from 'node:os'
import type { BrowserWindow, MenuItemConstructorOptions } from 'electron'
import { Menu, dialog, shell } from 'electron'
import { repository, version } from '../package.json'

const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'
const sinceYear = 2024
const year = new Date().getFullYear()

function createAboutMenu(focusedWindow: BrowserWindow) {
  dialog.showMessageBox(focusedWindow, {
    title: 'Timefall',
    message: 'Timefall',
    type: 'info',
    detail: `
      Version: ${version}
      Electron: ${process.versions.electron}
      Chrome: ${process.versions.chrome}
      Node.js: ${process.versions.node}
      V8: ${process.versions.v8}
      OS: ${os.type()} ${os.arch()} ${os.release()}
      ©${sinceYear !== year ? `${sinceYear}-${year}` : year} Anton Reshetov <reshetov.art@gmail.com>
    `,
  })
}

const appMenuCommon: Record<string, MenuItemConstructorOptions> = {
  preferences: {
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click: (_, focusedWindow) => {
      dialog.showMessageBox(focusedWindow, {
        title: 'Preferences',
        message: 'Preferences',
        type: 'info',
        detail: 'Not implemented yet.',
      })
    },
  },
  update: {
    label: 'Check for Updates...',
    click: () => console.warn('Check for Updates...'),
  },
  devtools: {
    label: 'Toggle Developer Tools',
    role: 'toggleDevTools',
  },
  quit: {
    label: 'Quit',
    role: 'quit',
  },
}

const appMenuMac: MenuItemConstructorOptions[] = [
  {
    label: 'About Timefall',
    click: (_, focusedWindow) => createAboutMenu(focusedWindow),
  },
  { ...appMenuCommon.update },
  {
    type: 'separator',
  },
  {
    ...appMenuCommon.preferences,
  },
  {
    type: 'separator',
  },
  {
    ...appMenuCommon.devtools,
  },
  {
    type: 'separator',
  },
  {
    label: 'Hide Timefall',
    role: 'hide',
  },
  {
    label: 'Hide Others',
    role: 'hideOthers',
  },
  {
    label: 'Show All',
    role: 'unhide',
  },
  {
    type: 'separator',
  },
  {
    ...appMenuCommon.quit,
  },
]

const appMenu: MenuItemConstructorOptions[] = [
  { ...appMenuCommon.preferences },
  { type: 'separator' },
  { ...appMenuCommon.devtools },
  { type: 'separator' },
  { ...appMenuCommon.quit },
]

const helpMenu: MenuItemConstructorOptions[] = [
  {
    label: 'About Timefall',
    click: (_, focusedWindow) => createAboutMenu(focusedWindow),
  },
  {
    label: 'View on GitHub',
    click: () => shell.openExternal(repository.url),
  },
  {
    label: 'Change Log',
    click: () => shell.openExternal(`${repository.url}/releases`),
  },
  {
    label: 'Report Issue',
    click: () => shell.openExternal(`${repository.url}/issues/new/choose`),
  },
  {
    label: 'Give a Star',
    click: () => shell.openExternal(`${repository.url}/stargazers`),
  },
  {
    type: 'separator',
  },
  {
    label: 'Donate via PayPal',
    click: () =>
      shell.openExternal('https://www.paypal.com/paypalme/antongithub'),
  },
  {
    label: 'Donate via Gumroad (Visa, Mastercard, etc.)',
    click: () =>
      shell.openExternal('https://antonreshetov.gumroad.com/l/timefall'),
  },
  {
    type: 'separator',
  },
  {
    label: 'Toggle Developer Tools',
    role: 'toggleDevTools',
  },
]

if (isDev) {
  helpMenu.push({
    label: 'Reload',
    role: 'reload',
  })
}

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: 'Timefall',
    submenu: isMac ? appMenuMac : appMenu,
  },
  {
    label: 'Edit',
    role: 'editMenu',
  },
  {
    label: 'Help',
    submenu: helpMenu,
  },
]

export const menu = Menu.buildFromTemplate(menuTemplate)
