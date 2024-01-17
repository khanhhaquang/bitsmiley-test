import {
  useCallback,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useLayoutEffect
} from 'react'

interface CountdownOption {
  countStart: number
  intervalMs?: number
  isIncrement?: boolean
  countStop?: number
}
interface CountdownControllers {
  startCountdown: () => void
  stopCountdown: () => void
  resetCountdown: () => void
}

export function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers]

export function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers] {
  // default values
  const intervalMs = countdownOption.intervalMs ?? 1000
  const isIncrement = countdownOption.isIncrement ?? false
  const countStop = countdownOption.countStop ?? 0

  const {
    count,
    increment,
    decrement,
    reset: resetCounter
  } = useCounter(countdownOption.countStart)

  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown
  } = useBoolean(false)

  const resetCountdown = () => {
    stopCountdown()
    resetCounter()
  }

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      increment()
    } else {
      decrement()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return [
    count,
    {
      startCountdown,
      stopCountdown,
      resetCountdown
    } as CountdownControllers
  ]
}

interface UseCounterOutput {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: Dispatch<SetStateAction<number>>
}

function useCounter(initialValue?: number): UseCounterOutput {
  const [count, setCount] = useState(initialValue || 0)

  const increment = () => setCount((x) => x + 1)
  const decrement = () => setCount((x) => x - 1)
  const reset = () => setCount(initialValue || 0)

  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  }
}

interface UseBooleanOutput {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

function useBoolean(defaultValue?: boolean): UseBooleanOutput {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue((x) => !x), [])

  return { value, setValue, setTrue, setFalse, toggle }
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!delay && delay !== 0) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}
