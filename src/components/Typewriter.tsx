import { useStoreActions } from '@/hooks/useStoreActions'
import { getCurrentTypeWritterSeq } from '@/store/common/reducer'
import { cn } from '@/utils/cn'
import { useState, useEffect, ReactNode, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

const DEFAULT_MS = 40

export interface ITypewriterProps {
  renderNodes: (currentNodeIndex: number) => string | ReactNode[]
  seq?: number
  loop?: boolean
  speed?: number
  cursor?: boolean
  wrapperClassName?: string
  onStop?: () => void
}

export default function Typewriter({
  seq,
  renderNodes,
  loop = false,
  speed = DEFAULT_MS,
  cursor = true,
  wrapperClassName,
  onStop
}: ITypewriterProps) {
  const { setCurrentTypewritterSeq } = useStoreActions()
  const timerRef = useRef(0)
  const currentSeq = useSelector(getCurrentTypeWritterSeq)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)

  const formattedNodes = useMemo(() => {
    const nodes = renderNodes(currentNodeIndex)

    if (!Array.isArray(nodes)) {
      const text = nodes as string
      return text.split('') as ReactNode[]
    }
    const nds = (nodes as ReactNode[]).reduce((acc: ReactNode[], r) => {
      if (typeof r === 'string') {
        return [...acc, ...r.split('')]
      }

      return [...acc, r]
    }, [] as ReactNode[])

    return nds
  }, [currentNodeIndex, renderNodes])

  const isStarted = seq === currentSeq || seq === undefined

  useEffect(() => {
    if (currentSeq !== seq && seq !== undefined) return

    timerRef.current = setTimeout(() => {
      if (currentNodeIndex < formattedNodes.length) {
        setCurrentNodeIndex(currentNodeIndex + 1)
      } else {
        if (loop) {
          setCurrentNodeIndex(0)
        } else {
          if (seq !== undefined) {
            setCurrentTypewritterSeq(currentSeq + 1)
          }
          clearTimeout(timerRef.current)
          onStop?.()
        }
      }
    }, speed)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [
    seq,
    loop,
    currentNodeIndex,
    currentSeq,
    speed,
    formattedNodes.length,
    setCurrentTypewritterSeq,
    onStop
  ])

  return (
    <span className={cn('flex items-center', wrapperClassName)}>
      {formattedNodes?.slice(0, currentNodeIndex).map((n, idx) => (
        <span key={idx} className="relative flex items-center justify-center">
          {/^\s*$/.test(n as string) ? '\u00A0' : n}

          {idx === formattedNodes?.slice(0, currentNodeIndex).length - 1 && (
            <span className="absolute -right-2">
              {isStarted ? cursor && '▎' : ''}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
