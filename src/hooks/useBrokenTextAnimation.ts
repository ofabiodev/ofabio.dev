import { useState, useEffect, useRef, useCallback } from "react"

export interface LetterState {
  x: number
  y: number
  rotation: number
  velocityX: number
  velocityY: number
  shakeX: number
  shakeY: number
}

export const useBrokenTextAnimation = (
  text: string,
  viewportSize: { width: number; height: number },
  onComplete?: () => void,
) => {
  const [letterStates, setLetterStates] = useState<LetterState[]>(
    text.split("").map(() => ({
      x: 0,
      y: 0,
      rotation: 0,
      velocityX: 0,
      velocityY: 0,
      shakeX: 0,
      shakeY: 0,
    })),
  )
  const [isBroken, setIsBroken] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const resetTimeoutRef = useRef<number | null>(null)

  const resetAnimation = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }
    setLetterStates(
      text.split("").map(() => ({
        x: 0,
        y: 0,
        rotation: 0,
        velocityX: 0,
        velocityY: 0,
        shakeX: 0,
        shakeY: 0,
      })),
    )
    setIsBroken(false)
    setClickCount(0)
  }, [text])

  const handleClick = useCallback(() => {
    if (isBroken) return

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }

    setLetterStates((prev) =>
      prev.map((state) => ({
        ...state,
        rotation: state.rotation + (Math.random() * 15 - 7.5),
        shakeX: (Math.random() - 0.5) * 4,
        shakeY: (Math.random() - 0.5) * 4,
        velocityX: state.velocityX,
        velocityY: state.velocityY,
      })),
    )

    setTimeout(() => {
      setLetterStates((prev) =>
        prev.map((state) => ({
          ...state,
          shakeX: 0,
          shakeY: 0,
        })),
      )
    }, 100)

    if (newCount >= 3) {
      setIsBroken(true)

      setLetterStates((prev) =>
        prev.map(() => ({
          x: 0,
          y: 0,
          rotation: Math.random() * 360,
          velocityX: (Math.random() - 0.5) * 20,
          velocityY: (Math.random() - 0.5) * 20 - 10,
          shakeX: 0,
          shakeY: 0,
        })),
      )
    } else {
      resetTimeoutRef.current = setTimeout(() => {
        setLetterStates((prev) =>
          prev.map((state) => ({
            ...state,
            rotation: 0,
            shakeX: 0,
            shakeY: 0,
          })),
        )
        setClickCount(0)
      }, 2000)
    }
  }, [clickCount, isBroken])

  useEffect(() => {
    if (!isBroken) return

    const interval = setInterval(() => {
      setLetterStates((prev) => {
        const newStates = prev.map((state) => ({
          x: state.x + state.velocityX,
          y: state.y + state.velocityY,
          rotation: state.rotation + state.velocityX * 2,
          velocityX: state.velocityX,
          velocityY: state.velocityY + 0.5,
          shakeX: 0,
          shakeY: 0,
        }))

        const allLettersGone = newStates.every(
          (state) =>
            Math.abs(state.x) > (viewportSize.width || window.innerWidth) ||
            Math.abs(state.y) > (viewportSize.height || window.innerHeight),
        )

        if (allLettersGone) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete?.()
          }, 500)
        }

        return newStates
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isBroken, viewportSize, onComplete])

  return {
    letterStates,
    isBroken,
    clickCount,
    handleClick,
    resetAnimation,
  }
}
