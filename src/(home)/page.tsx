"use client"

import { BentoGrid, BentoCard } from "@/components/custom/bento-grid"
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6"
import { projects } from "@/data/bento"
import { useRef, useCallback, useState, useEffect } from "react"
import { useViewportSize } from "@/hooks/useViewportSize"
import { useBrokenTextAnimation } from "@/hooks/useBrokenTextAnimation"
import { useTypingAnimation } from "@/hooks/useTypingAnimation"
import { FcCursor } from "react-icons/fc"

const TEXT = "Hi, I'm Fábio"

export default function Home() {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportSize = useViewportSize()

  const [resetCallback, setResetCallback] = useState<(() => void) | null>(null)

  const {
    showCursor,
    cursorPos,
    isSelecting,
    typedText,
    isTyping,
    textMeasureRef,
    getTextWidth,
    startAnimation,
    reset,
  } = useTypingAnimation(TEXT, resetCallback)

  const handleAnimationComplete = useCallback(() => {
    if (h1Ref.current) {
      startAnimation(h1Ref.current, viewportSize.width || window.innerWidth)
    }
  }, [startAnimation, viewportSize.width])

  const { letterStates, isBroken, handleClick, resetAnimation } =
    useBrokenTextAnimation(TEXT, viewportSize, handleAnimationComplete)

  useEffect(() => {
    setResetCallback(() => () => {
      reset()
      setTimeout(() => {
        resetAnimation()
      }, 50)
    })
  }, [reset, resetAnimation])

  const handleHiClick = useCallback(() => {
    if (isBroken || isTyping) return
    handleClick()
  }, [isBroken, isTyping, handleClick])

  const handleHiKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleHiClick()
      }
    },
    [handleHiClick],
  )

  return (
    <div ref={containerRef} className="bg-zinc-900 text-white">
      <div className="bg-zinc-900 overflow-hidden">
        <span
          ref={textMeasureRef}
          className="fixed invisible text-2xl sm:text-3xl lg:text-4xl font-bold"
          style={{ whiteSpace: "pre" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-24 sm:h-32 lg:h-40 rounded-b-2xl relative overflow-hidden">
            <img
              src="/banner.svg"
              alt="Banner"
              className="object-cover absolute inset-0 w-full h-full"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="flex flex-col items-center -mt-12 sm:-mt-16 lg:-mt-20 relative z-10 px-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl p-1.5 shadow-2xl">
            <div className="w-full h-full rounded-[1.3rem] relative overflow-hidden">
              <img
                src="/avatar.svg"
                alt="Avatar"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <h1
            ref={h1Ref}
            onClick={handleHiClick}
            onKeyDown={handleHiKeyDown}
            aria-label="Click to break the text animation"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 sm:mt-6 text-white select-none cursor-pointer relative text-center focus:outline-none focus:ring-0 rounded"
            style={{
              minHeight: "3rem",
              lineHeight: "1.2",
            }}
          >
            {isTyping ? (
              <span style={{ whiteSpace: "pre" }}>
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            ) : isBroken ? (
              <div
                className="relative"
                style={{
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {TEXT.split("").map((char, i) => (
                  <span
                    key={`broken-${char}-${i}-${Date.now()}`}
                    className="inline-block absolute"
                    style={{
                      transform: `translate(${letterStates[i]?.x || 0}px, ${letterStates[i]?.y || 0}px) rotate(${letterStates[i]?.rotation || 0}deg)`,
                      opacity: Math.max(
                        0,
                        1 -
                          Math.sqrt(
                            letterStates[i]?.x ** 2 + letterStates[i]?.y ** 2,
                          ) /
                            300,
                      ),
                      transition: "opacity 0.3s",
                      whiteSpace: "pre",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ) : (
              TEXT.split("").map((char, i) => (
                <span
                  key={`normal-${char}-${i}-${Date.now()}`}
                  className="inline-block"
                  style={{
                    transform: `translate(${letterStates[i]?.shakeX || 0}px, ${letterStates[i]?.shakeY || 0}px) rotate(${letterStates[i]?.rotation || 0}deg)`,
                    transition:
                      (letterStates[i]?.rotation || 0) === 0
                        ? "transform 0.5s ease-out"
                        : "none",
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </span>
              ))
            )}
          </h1>
          <p className="text-gray-400 mt-2 text-xs sm:text-sm text-center px-4">
            Software developer based in 🇧🇷 <br />
            Working at @ Sympla
          </p>

          <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
            <a
              href="https://www.linkedin.com/in/ofabiome/"
              className="text-gray-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/ofabiodev"
              className="text-gray-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
            >
              <FaGithub />
            </a>
            <a
              href="https://x.com/ofabiodev"
              className="text-gray-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
            >
              <FaXTwitter />
            </a>
          </div>

          <div className="mx-auto my-6 max-w-md w-full h-px bg-zinc-800" />
        </div>

        {showCursor && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FcCursor size={32} />
          </div>
        )}
        {(isSelecting || isTyping) && h1Ref.current && (
          <div
            className="absolute pointer-events-none z-40 bg-blue-500/30 border border-blue-500 rounded"
            style={{
              left:
                h1Ref.current.getBoundingClientRect().left +
                (isTyping
                  ? (h1Ref.current.getBoundingClientRect().width -
                      getTextWidth(typedText)) /
                    2
                  : 0) -
                8,
              top:
                h1Ref.current.getBoundingClientRect().top +
                (window.scrollY || document.documentElement.scrollTop) -
                2,
              width: isTyping
                ? getTextWidth(typedText) + 16
                : h1Ref.current.getBoundingClientRect().width + 16,
              height: isTyping
                ? h1Ref.current.getBoundingClientRect().height + 4
                : h1Ref.current.getBoundingClientRect().height + 4,
            }}
          />
        )}

        <div className="flex justify-center w-full mt-8 sm:mt-12 pb-10 px-4 sm:px-6 lg:px-8">
          <BentoGrid className="w-full max-w-5xl">
            {projects.map((project) => (
              <BentoCard
                key={project.name}
                name={project.name}
                description={project.description}
                href={project.href}
                cta={project.cta}
                Icon={project.Icon}
                badges={project.badges}
                background={project.background}
                className={project.className}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </div>
  )
}
