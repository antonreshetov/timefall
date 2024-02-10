import type { Api } from '~/services/api/types'
import type { Store } from '~/services/store/types'

declare global {
  interface Window {
    electron: {
      api: Api
      store: Store
    }
  }
}
