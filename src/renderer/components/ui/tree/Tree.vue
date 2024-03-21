<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import TreeBuilder from './TreeBuilder.vue'
import type { Node } from './types'
import { treeKey } from './key'
import { flatToNested } from './utils'

interface Props {
  data: Node[]
  draggable?: boolean
  selectedNodeId?: string
}

interface Emits {
  (e: 'update', value: Node[]): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const localData = ref<Node[]>(JSON.parse(JSON.stringify(props.data)))

const draggedNodeId = ref('')
const draggedNodeChildrenIds = ref<string[]>([])
const selectedNodeId = ref(props.selectedNodeId)

const isRootHovered = ref(false)

const tree = computed(() => flatToNested(localData.value))

function toggleOpen(id: string) {
  localData.value.forEach((node) => {
    if (node.id === id)
      node.isOpen = !node.isOpen
  })
}

provide(treeKey, {
  data: localData,
  draggedNodeId,
  draggedNodeChildrenIds,
  isRootHovered,
  selectedNodeId,
  toggleOpen,
})

watch(
  localData,
  () => {
    emit('update', localData.value)
  },
  { deep: true },
)

watch(
  () => props.data,
  (value) => {
    localData.value = JSON.parse(JSON.stringify(value))
  },
)

watch(
  () => props.selectedNodeId,
  (value) => {
    selectedNodeId.value = value
  },
)
</script>

<template>
  <div
    class="tree"
    :data-root-hovered="isRootHovered"
  >
    <TreeBuilder
      :data="tree"
      :draggable="draggable"
    >
      <template #default="{ node, stat }">
        <slot
          :node="node"
          :stat="stat"
        />
      </template>
    </TreeBuilder>
  </div>
</template>
