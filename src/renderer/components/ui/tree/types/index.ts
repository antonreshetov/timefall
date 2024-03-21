import type { Ref } from 'vue'

export interface Node {
  id: string
  parentId?: string
  isOpen: boolean
  [key: string]: any
}

export interface Tree extends Node {
  children: Node[]
}

export interface Stat {
  isOpen: boolean
  level: number
}

export type FlatData = Omit<Node, 'children'> & { parentId?: string }

export interface TreeInject {
  data: Ref<Node[]>
  draggedNodeChildrenIds: Ref<string[]>
  draggedNodeId: Ref<string>
  isRootHovered: Ref<boolean>
  selectedNodeId: Ref<string>
  toggleOpen: (id: string) => void
}
