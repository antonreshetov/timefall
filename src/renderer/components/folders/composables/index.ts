import { computed, ref, shallowRef } from 'vue'
import type { Folder } from '~/services/api/types'

const { api } = window.electron

const folders = shallowRef<Folder[]>([])
const selectedFolderId = ref<string>()
const editFolderId = ref<string>()
const contextFolderId = ref<string>()
const isOpenEditMenu = ref(false)

const editFolder = computed(() => {
  return folders.value.find(folder => folder.id === editFolderId.value)
})

function addFolder(folder: Pick<Folder, 'name'>) {
  api.addFolder(folder)
  getFolders()
}

function getFolders() {
  folders.value = api.getFolders()
  folders.value.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
  )
}

function updateFolders(data: any) {
  api.updateFolders(data)
}

export function useFolders() {
  return {
    addFolder,
    contextFolderId,
    selectedFolderId,
    editFolderId,
    folders,
    getFolders,
    editFolder,
    isOpenEditMenu,
    updateFolders,
  }
}
