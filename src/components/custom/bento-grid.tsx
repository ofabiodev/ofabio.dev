import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { HiExternalLink } from "react-icons/hi"
import {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type KeyboardEvent,
} from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode
  className?: string
}

export interface BentoCardProps {
  name: string
  className?: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href?: string
  cta?: string
  badges?: Array<{
    text: string
    className?: string
  }>
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  const gridRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (!gridRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - gridRef.current.offsetLeft)
    setScrollLeft(gridRef.current.scrollLeft)
  }

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isDragging || !gridRef.current) return
    e.preventDefault()
    const x = e.pageX - gridRef.current.offsetLeft
    const walk = (x - startX) * 2
    gridRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (!gridRef.current) return
    setStartX(e.touches[0].pageX - gridRef.current.offsetLeft)
    setScrollLeft(gridRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!gridRef.current) return
    const x = e.touches[0].pageX - gridRef.current.offsetLeft
    const walk = (x - startX) * 2
    gridRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section
      ref={gridRef}
      aria-label="Projects grid"
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        "lg:overflow-visible overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing",
        className,
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      {...props}
    >
      {children}
    </section>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badges,
}: BentoCardProps) => {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([])
  const cardRef = useRef<HTMLElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const isClickable = !!href
  const displayCta = cta || "View"

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)

    if (isClickable && href) {
      window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!isClickable || !href) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  const descriptionId = `desc-${name.replace(/\s+/g, "-").toLowerCase()}`
  const labelId = `label-${name.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <article
      ref={cardRef}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl select-none",
        "bg-[#27272A] transform-gpu focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900",
        "cursor-pointer",
        className,
      )}
    >
      {badges && badges.length > 0 && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {badges.map((badge, index) => (
            <span
              key={`badge-${badge.text}-${index}`}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md backdrop-blur-sm",
                badge.className ||
                  "bg-zinc-800/90 text-zinc-400 border border-zinc-700/50",
              )}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}

      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#27272A]" />
        <div className="absolute inset-0">{background}</div>
      </div>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div
          className={cn(
            "pointer-events-none flex transform-gpu flex-col gap-1",
            prefersReducedMotion || !href
              ? ""
              : "transition-all duration-300 lg:group-hover:-translate-y-10",
          )}
        >
          <Icon
            className={cn(
              "h-8 w-8 origin-left transform-gpu text-neutral-400",
              prefersReducedMotion || !href
                ? ""
                : "transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:text-neutral-300",
            )}
            aria-hidden="true"
          />
          <h3 id={labelId} className="text-xl font-semibold text-neutral-100">
            {name}
          </h3>
          <p id={descriptionId} className="max-w-lg text-neutral-400">
            {description}
          </p>
        </div>

        {href && (
          <div
            className={cn(
              "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden",
            )}
          >
            <Button
              variant="link"
              asChild
              size="sm"
              className="pointer-events-auto p-0 text-neutral-300 hover:text-neutral-100"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${displayCta} for ${name} (opens in new tab)`}
              >
                {displayCta}
                <HiExternalLink
                  className="ms-2 h-4 w-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
        )}
      </div>

      {href && (
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex z-10",
          )}
        >
          <Button
            variant="link"
            asChild
            size="sm"
            className="pointer-events-auto p-0 text-neutral-300 hover:text-neutral-100"
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${displayCta} for ${name} (opens in new tab)`}
            >
              {displayCta}
              <HiExternalLink
                className="ms-2 h-4 w-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </a>
          </Button>
        </div>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl",
          prefersReducedMotion
            ? ""
            : "transform-gpu transition-all duration-300 group-hover:bg-black/40",
        )}
        aria-hidden="true"
      />
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        {name} project card. {description}
      </output>
    </article>
  )
}

export { BentoCard, BentoGrid }
