import Store from 'electron-store'

export default new Store({
  name: 'app',
  defaults: {
    bounds: {},
  },
})
