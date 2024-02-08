import type { Api } from '~/services/api/types'

declare global {
  interface Window {
    electron: {
      api: Api
    }
  }
}
