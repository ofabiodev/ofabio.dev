import { useState, useRef, useCallback } from "react"

export const useTypingAnimation = (
  text: string,
  onComplete: (() => void) | null,
) => {
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const textMeasureRef = useRef<HTMLSpanElement>(null)

  const reset = useCallback(() => {
    setShowCursor(false)
    setCursorPos({ x: -100, y: -100 })
    setIsSelecting(false)
    setTypedText("")
    setIsTyping(false)
  }, [])

  const getTextWidth = useCallback((textToMeasure: string) => {
    if (!textMeasureRef.current) return 0
    textMeasureRef.current.textContent = textToMeasure
    return textMeasureRef.current.offsetWidth
  }, [])

  const typeText = useCallback(() => {
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          reset()
          onComplete?.()
        }, 100)
      }
    }, 100)
  }, [text, onComplete, reset])

  const animateCursor = useCallback(
    (targetElement: HTMLElement, viewportWidth: number) => {
      const startX = viewportWidth + 50
      const startY = -50
      const rect = targetElement.getBoundingClientRect()
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const endX = rect.left + rect.width / 2
      const endY = rect.top + rect.height / 2 + scrollY

      setCursorPos({ x: startX, y: startY })

      let progress = 0
      const duration = 1500
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        progress = Math.min(elapsed / duration, 1)

        const easeProgress = 1 - (1 - progress) ** 3
        const currentX = startX + (endX - startX) * easeProgress
        const currentY = startY + (endY - startY) * easeProgress

        setCursorPos({ x: currentX, y: currentY })

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setTimeout(() => {
            setIsSelecting(true)
            setTimeout(() => {
              setShowCursor(false)
              setIsTyping(true)
              typeText()
            }, 1000)
          }, 100)
        }
      }

      requestAnimationFrame(animate)
    },
    [typeText],
  )

  const startAnimation = useCallback(
    (targetElement: HTMLElement, viewportWidth: number) => {
      setShowCursor(true)
      animateCursor(targetElement, viewportWidth)
    },
    [animateCursor],
  )

  return {
    showCursor,
    cursorPos,
    isSelecting,
    typedText,
    isTyping,
    textMeasureRef,
    getTextWidth,
    startAnimation,
    reset,
  }
}
