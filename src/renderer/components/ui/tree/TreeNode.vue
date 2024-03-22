<script setup lang="ts">
import { computed, inject, reactive, ref, watch } from 'vue'
import type { Node, Stat } from './types'
import { treeKey } from './key'

interface Props {
  node: Node
  level: number
  indent?: number
  parentId?: string
}

const props = defineProps<Props>()

const root = inject(treeKey)!

const isRootHovered = ref(false)
const isHovered = ref(false)

const stat = reactive<Stat>({
  isOpen: props.node.isOpen,
  level: props.level,
})

const identStyle = computed(() => {
  return {
    paddingLeft: `${(props.level - 1) * props.indent}px`,
  }
})

const isSelected = computed(() => {
  return props.node.id === root.selectedNodeId.value
})

const allParents = computed(() => {
  const parents = []
  const flatData = root.data.value
  let parent = flatData.find(node => node.id === props.parentId)

  while (parent) {
    parents.push(parent)
    parent = flatData.find(node => node.id === parent.parentId)
  }

  return parents
})

const isOpen = computed(() => {
  return allParents.value.every(node => node.isOpen)
})

function getChildren(node: Node) {
  const children = []
  const flatData = root.data.value
  let child = flatData.find(n => n.parentId === node.id)

  while (child) {
    children.push(child)
    child = flatData.find(n => n.parentId === child.id)
  }

  return children
}

function canDrop(id: string) {
  return (
    id !== props.node.id && !allParents.value.some(node => node.id === id)
  )
}

function onDragStart(e: DragEvent) {
  e.dataTransfer.setData('id', props.node.id)
  e.dataTransfer.setData('name', props.node.name)

  const children = getChildren(props.node)

  root.draggedNodeId.value = props.node.id
  root.draggedNodeChildrenIds.value = children.map(node => node.id)
  root.onDragStart(e)
}

function onDragOver(e: DragEvent) {
  const curPos = { x: e.clientX, y: e.clientY }
  const nodeEl = e.currentTarget as HTMLElement
  const nodePos = { x: nodeEl.offsetLeft, y: nodeEl.offsetTop }

  if (
    props.node.id !== root.draggedNodeId.value
    && !root.draggedNodeChildrenIds.value.includes(props.node.id)
  )
    isHovered.value = true

  isRootHovered.value = curPos.x - nodePos.x < 20
  root.isRootHovered.value = isRootHovered.value

  e.preventDefault()
}

function onDrop(e: DragEvent) {
  const id = root.draggedNodeId.value
  const can = canDrop(id)

  const droppedNode = root.data.value.find(node => node.id === id)

  if (isRootHovered.value)
    droppedNode.parentId = ''

  if (can && droppedNode && !isRootHovered.value)
    droppedNode.parentId = props.node.id

  isHovered.value = false
  isRootHovered.value = false
  root.isRootHovered.value = false
  root.draggedNodeId.value = ''

  e.preventDefault()
}

function onDragLeave() {
  isHovered.value = false
  root.isRootHovered.value = false
}

function onDragEnd() {
  root.isRootHovered.value = false
  root.draggedNodeId.value = ''
}

watch(
  () => stat.isOpen,
  () => {
    root.toggleOpen(props.node.id)
  },
)
</script>

<template>
  <div
    v-if="isOpen"
    class="tree-node"
    :style="identStyle"
    style="position: relative"
    :data-hovered="isHovered"
    :data-selected="isSelected"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @dragend="onDragEnd"
    @drop="onDrop"
  >
    <slot
      :node="node"
      :stat="stat"
    />
  </div>
</template>
