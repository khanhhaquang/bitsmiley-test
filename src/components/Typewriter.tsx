import { useStoreActions } from '@/hooks/useStoreActions'
import { getCurrentTypeWritterSeq } from '@/store/common/reducer'
import { useState, useEffect, ReactNode, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

const DEFAULT_MS = 40

export interface ITypewriterProps {
  seq: number | false
  nodes: string | ReactNode[]
  loop?: boolean
  speed?: number
  cursor?: boolean
}

export default function Typewriter({
  seq,
  nodes,
  loop = false,
  speed = DEFAULT_MS,
  cursor = true
}: ITypewriterProps) {
  const { setCurrentTypewritterSeq } = useStoreActions()
  const timerRef = useRef(0)
  const currentSeq = useSelector(getCurrentTypeWritterSeq)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)

  const formattedNodes = useMemo(() => {
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
  }, [nodes])

  const isStarted = seq === currentSeq || seq === false

  useEffect(() => {
    if (currentSeq !== seq && seq !== false) return

    timerRef.current = setTimeout(() => {
      if (currentNodeIndex < formattedNodes.length) {
        setCurrentNodeIndex(currentNodeIndex + 1)
      } else {
        if (loop) {
          setCurrentNodeIndex(0)
        } else {
          setCurrentTypewritterSeq(currentSeq + 1)
          clearTimeout(timerRef.current)
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
    setCurrentTypewritterSeq
  ])

  return (
    <span className="flex items-center">
      {formattedNodes?.slice(0, currentNodeIndex).map((n, idx) => (
        <span key={idx} className="relative flex items-center justify-center">
          {/^\s*$/.test(n as string) ? '\u00A0' : n}

          {idx === formattedNodes?.slice(0, currentNodeIndex).length - 1 && (
            <span className="absolute -right-4">
              {isStarted ? cursor && '▎' : ''}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
