import clxs, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clxs(...classes))
}
