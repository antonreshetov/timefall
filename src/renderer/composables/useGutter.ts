import type { MaybeElement, MaybeElementRef } from '@vueuse/core'
import interact from 'interactjs'
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

export function useGutter(
  target: Ref,
  gutter: Ref,
  initWidth: number = 0,
  minWidth: number = 100,
) {
  const width = ref(initWidth)

  onMounted(() => {
    interact(target.value).resizable({
      allowFrom: gutter.value.$el,

      onmove: (e) => {
        const { pageX } = e

        if (pageX < minWidth)
          return
        width.value = Math.floor(pageX)
      },
    })
  })

  return {
    width,
  }
}
