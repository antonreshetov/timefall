import { computed, ref, shallowRef, watch } from 'vue'
import type { Folder } from '~/services/api/types'

const { api, store } = window.electron

const folders = shallowRef<Folder[]>([])
const selectedFolderId = ref<string>(store.app.get('selectedFolderId'))
const editFolderId = ref<string>()
const contextFolderId = ref<string>()
const isOpenEditMenu = ref(false)

const editFolder = computed(() => {
  return folders.value.find(folder => folder.id === editFolderId.value)
})

const selectedFolder = computed(() => {
  return folders.value.find(folder => folder.id === selectedFolderId.value)
})

function addFolder(folder: Pick<Folder, 'name'>) {
  api.addFolder(folder)
  getFolders()
}

function getFolders() {
  folders.value = api.getFolders()
}

function updateFolders(data: any) {
  api.updateFolders(data)
}

watch(selectedFolderId, (id) => {
  store.app.set('selectedFolderId', id)
})

export function useFolders() {
  return {
    addFolder,
    contextFolderId,
    editFolder,
    editFolderId,
    folders,
    getFolders,
    isOpenEditMenu,
    selectedFolder,
    selectedFolderId,
    updateFolders,
  }
}
