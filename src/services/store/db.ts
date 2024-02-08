import Store from 'electron-store'

// eslint-disable-next-line node/prefer-global/process
const isDev = process.env.NODE_ENV === 'development'

export default new Store({
  name: 'db',
  cwd: isDev ? 'dev' : undefined,
  defaults: {
    folders: [],
    tasks: [],
    taskRecords: [],
  },
})
