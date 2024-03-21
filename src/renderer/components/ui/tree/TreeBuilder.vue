<script setup lang="ts">
import TreeNode from './TreeNode.vue'
import type { Node, Stat } from './types'

interface Props {
  data: Node[]
  level?: number
  indent?: number
  parentId?: string
  draggable?: boolean
}

withDefaults(defineProps<Props>(), {
  level: 1,
  indent: 10,
})
</script>

<template>
  <template
    v-for="i in data"
    :key="i.id"
  >
    <TreeNode
      :node="i"
      :level="level"
      :data-level="level"
      :indent="indent"
      :parent-id="parentId"
      :draggable="draggable"
    >
      <template #default="{ node, stat }">
        <slot
          :node="node"
          :stat="stat"
        />
      </template>
    </TreeNode>

    <template v-if="i.children.length">
      <TreeBuilder
        :data="i.children"
        :level="level + 1"
        :parent-id="i.id"
        :draggable="draggable"
      >
        <template #default="{ node, stat }: { node: Node; stat: Stat }">
          <slot
            :node="node"
            :stat="stat"
          />
        </template>
      </TreeBuilder>
    </template>
  </template>
</template>
