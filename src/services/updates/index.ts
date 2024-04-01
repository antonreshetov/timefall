/* eslint-disable node/prefer-global/process */
import axios from 'axios'
import { BrowserWindow } from 'electron'
import { repository, version } from '../../../package.json'

const isDev = process.env.NODE_ENV === 'development'

export async function checkForUpdates() {
  if (isDev)
    return

  try {
    const res = await axios.get(`${repository.url}/releases/latest`)

    const latest = res.request.socket._httpMessage.path
      .split('/')
      .pop()
      .substring(1)

    if (latest !== version) {
      BrowserWindow.getFocusedWindow()?.webContents.send('update-available')
      return latest
    }
  }
  catch (err) {
    console.error(err)
  }
}

export async function checkForUpdatesWithInterval() {
  checkForUpdates()

  setInterval(
    () => {
      checkForUpdates()
    },
    1000 * 60 * 360,
  ) // 6 часов
}
