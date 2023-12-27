/* eslint-disable tailwindcss/no-custom-classname */

import {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
  FC,
  forwardRef,
  Children,
  MutableRefObject,
  RefAttributes
} from 'react'
import './index.scss'

type MarqueeProps = {
  className?: string
  play?: boolean
  direction?: 'left' | 'right' | 'up' | 'down'
  speed?: number
  children?: ReactNode
} & RefAttributes<HTMLDivElement>

export const Marquee: FC<MarqueeProps> = forwardRef(function Marquee(
  { className = '', play = true, direction = 'left', speed = 50, children },
  ref
) {
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = (ref as MutableRefObject<HTMLDivElement>) || rootRef
  const marqueeRef = useRef<HTMLDivElement>(null)

  const calculateWidth = useCallback(() => {
    if (marqueeRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const marqueeRect = marqueeRef.current.getBoundingClientRect()
      let containerWidth = containerRect.width
      let marqueeWidth = marqueeRect.width

      if (direction === 'up' || direction === 'down') {
        containerWidth = containerRect.height
        marqueeWidth = marqueeRect.height
      }

      if (containerWidth && marqueeWidth) {
        setMultiplier(
          marqueeWidth < containerWidth
            ? Math.ceil(containerWidth / marqueeWidth)
            : 1
        )
      } else {
        setMultiplier(1)
      }

      setMarqueeWidth(marqueeWidth)
    }
  }, [containerRef, direction])

  useEffect(() => {
    if (!isMounted) return

    calculateWidth()
    if (marqueeRef.current && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => calculateWidth())
      resizeObserver.observe(containerRef.current)
      resizeObserver.observe(marqueeRef.current)
      return () => {
        if (!resizeObserver) return
        resizeObserver.disconnect()
      }
    }
  }, [calculateWidth, containerRef, isMounted])

  useEffect(() => {
    calculateWidth()
  }, [calculateWidth, children])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const containerStyle = useMemo(
    () => ({
      ['--pause-on-hover' as string]: !play ? 'paused' : 'running',
      ['--pause-on-click' as string]: !play ? 'paused' : 'running',
      ['--width' as string]:
        direction === 'up' || direction === 'down' ? `100vh` : '100%',
      ['--transform' as string]:
        direction === 'up'
          ? 'rotate(-90deg)'
          : direction === 'down'
          ? 'rotate(90deg)'
          : 'none'
    }),
    [play, direction]
  )

  const marqueeStyle = useMemo(
    () => ({
      ['--play' as string]: play ? 'running' : 'paused',
      ['--direction' as string]: direction === 'left' ? 'normal' : 'reverse',
      ['--duration' as string]: `${(marqueeWidth * multiplier) / speed}s`
    }),
    [play, direction, marqueeWidth, multiplier, speed]
  )

  const childStyle = useMemo(
    () => ({
      ['--transform' as string]:
        direction === 'up'
          ? 'rotate(90deg)'
          : direction === 'down'
          ? 'rotate(-90deg)'
          : 'none'
    }),
    [direction]
  )

  // Render {multiplier} number of children
  const multiplyChildren = useCallback(
    (multiplier: number) => {
      return [
        ...Array(
          Number.isFinite(multiplier) && multiplier >= 0 ? multiplier : 0
        )
      ].map((_, i) => (
        <Fragment key={i}>
          {Children.map(children, (child) => {
            return (
              <div style={childStyle} className="rfm-child">
                {child}
              </div>
            )
          })}
        </Fragment>
      ))
    },
    [childStyle, children]
  )

  return !isMounted ? null : (
    <div
      ref={containerRef}
      style={containerStyle}
      className={'rfm-marquee-container ' + className}>
      <div className="rfm-marquee" style={marqueeStyle}>
        <div className="rfm-initial-child-container" ref={marqueeRef}>
          {Children.map(children, (child) => {
            return (
              <div style={childStyle} className="rfm-child">
                {child}
              </div>
            )
          })}
        </div>
        {multiplyChildren(multiplier - 1)}
      </div>
      <div className="rfm-marquee" style={marqueeStyle}>
        {multiplyChildren(multiplier)}
      </div>
    </div>
  )
})
