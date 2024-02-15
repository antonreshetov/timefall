import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeFormat(sec: number, showSeconds: boolean = true) {
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec - hours * 3600) / 60)
  const seconds = sec - hours * 3600 - minutes * 60

  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  if (!showSeconds)
    return `${hoursStr}:${minutesStr}`

  return `${hoursStr}:${minutesStr}:${secondsStr}`
}

export function timeToSec(time: string) {
  const [hours, minutes, seconds] = time.split(':').map(Number)

  return hours * 3600 + minutes * 60 + seconds
}
