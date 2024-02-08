import { cva } from 'class-variance-authority'

export const variants = cva(
  'inline-flex items-center justify-center rounded cursor-default',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-200 hover:bg-neutral-300/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 active:bg-neutral-300 dark:active:bg-neutral-800/70',
        ghost:
          'hover:bg-neutral-200 dark:hover:bg-neutral-800 active:bg-neutral-300/80 dark:active:bg-neutral-800/60',
      },
      size: {
        default: 'px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
