import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const variants = cva(
  'inline-flex rounded focus-visible:outline-none border border-neutral-300 dark:border-neutral-700',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
      },
      size: {
        default: 'px-3 py-1',
        sm: 'px-2 py-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type Variants = VariantProps<typeof variants>
