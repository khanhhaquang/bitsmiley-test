import { useStoreActions } from '@/hooks/useStoreActions'
import { getCurrentTypeWritterSeq } from '@/store/common/reducer'
import { useState, useEffect, ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'

const DEFAULT_MS = 40

export interface ITypewriterProps {
  seq: number
  nodes: string | ReactNode[]
  speed?: number
  cursor?: boolean
}

let timer: number

export default function Typewriter({
  seq,
  nodes,
  speed = DEFAULT_MS,
  cursor = true
}: ITypewriterProps) {
  const { setCurrentTypewritterSeq } = useStoreActions()
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

  const isStarted = currentSeq === seq

  useEffect(() => {
    if (currentSeq !== seq) return

    timer = setTimeout(() => {
      if (currentNodeIndex < formattedNodes.length) {
        setCurrentNodeIndex(currentNodeIndex + 1)
      } else {
        setCurrentTypewritterSeq(currentSeq + 1)
        clearTimeout(timer)
      }
    }, speed)

    return () => {
      clearTimeout(timer)
    }
  }, [
    seq,
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
