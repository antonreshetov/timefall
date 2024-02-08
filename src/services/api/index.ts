import type { Api } from './types'
import { api as folderApi } from './folders'
import { api as tasksApi } from './tasks'

export const api: Api = {
  ...folderApi,
  ...tasksApi,
}
