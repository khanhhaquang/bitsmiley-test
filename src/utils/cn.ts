import classNames, { Argument } from 'classnames'
import { twMerge } from 'tailwind-merge'

export const cn = (...classes: Argument[]) => {
  return twMerge(classNames(...classes))
}
