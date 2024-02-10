import Store from 'electron-store'
import type { AppStore } from './types'
import { APP_DEFAULTS } from './constants'

export default new Store<AppStore>({
  name: 'app',
  defaults: {
    bounds: {},
    sizes: {
      sidebar: APP_DEFAULTS.sizes.sidebar,
      tasks: APP_DEFAULTS.sizes.tasks,
    },
  },
})
