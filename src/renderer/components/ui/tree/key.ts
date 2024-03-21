import type { InjectionKey } from 'vue'
import type { TreeInject } from './types'

export const treeKey: InjectionKey<TreeInject> = Symbol('tree')
