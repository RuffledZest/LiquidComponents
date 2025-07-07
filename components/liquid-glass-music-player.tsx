"use client"

import type React from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { animate } from "motion/react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

interface MusicPlayerProps {
  albumArt: string
  songTitle: string
  artist: string
  duration?: number
  className?: string
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.01,
    proximity = 64,
    spread = 40,
    variant = "default",
    glow = true,
    className,
    disabled = false,
    movementDuration = 2,
    borderWidth = 1,
  }: {
    blur?: number
    inactiveZone?: number
    proximity?: number
    spread?: number
    variant?: "default" | "white"
    glow?: boolean
    className?: string
    disabled?: boolean
    movementDuration?: number
    borderWidth?: number
  }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lastPosition = useRef({ x: 0, y: 0 })
    const animationFrameRef = useRef<number>(0)

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current
          if (!element) return
          const { left, top, width, height } = element.getBoundingClientRect()
          const mouseX = e?.x ?? lastPosition.current.x
          const mouseY = e?.y ?? lastPosition.current.y
          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY }
          }
          const center = [left + width * 0.5, top + height * 0.5]
          const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1])
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone
          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0")
            return
          }
          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity
          element.style.setProperty("--active", isActive ? "1" : "0")
          if (!isActive) return
          const currentAngle = Number.parseFloat(element.style.getPropertyValue("--start")) || 0
          const targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
          const newAngle = currentAngle + angleDiff
          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value))
            },
          })
        })
      },
      [inactiveZone, proximity, movementDuration],
    )

    useEffect(() => {
      if (disabled) return
      const handleScroll = () => handleMove()
      const handlePointerMove = (e: PointerEvent) => handleMove(e)
      window.addEventListener("scroll", handleScroll, { passive: true })
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      })
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        window.removeEventListener("scroll", handleScroll)
        document.body.removeEventListener("pointermove", handlePointerMove)
      }
    }, [handleMove, disabled])

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block",
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
                 radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)),
                   #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden",
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
            )}
          />
        </div>
      </>
    )
  },
)

GlowingEffect.displayName = "GlowingEffect"

export function LiquidGlassMusicPlayer({ albumArt, songTitle, artist, duration = 180, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (currentTime / duration) * 100

  return (
    <>
      {/* SVG Filter for Liquid Glass Effect */}
      <svg style={{ display: "none" }}>
        <filter id="glass-distortion-music" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.008" numOctaves="2" seed="14" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1.2" exponent="8" offset="0.4" />
            <feFuncG type="gamma" amplitude="0.1" exponent="1" offset="0.1" />
            <feFuncB type="gamma" amplitude="0.1" exponent="1" offset="0.6" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="4" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="8"
            specularConstant="1.5"
            specularExponent="120"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-150" y="-150" z="400" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1.2" k3="1.2" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="300" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={cn("relative w-full max-w-sm mx-auto", className)}>
        <div className="liquidGlass-wrapper relative flex font-semibold overflow-hidden text-black cursor-pointer shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] rounded-2xl md:rounded-3xl p-3 hover:p-4 hover:scale-[1.02] hover:shadow-[0_12px_12px_rgba(0,0,0,0.3),0_0_40px_rgba(0,0,0,0.2)]">
          {/* Liquid Glass Effect Layer */}
          <div className="liquidGlass-effect absolute z-0 inset-0 [backdrop-filter:blur(3px)] [filter:url(#glass-distortion-music)] overflow-hidden [isolation:isolate] rounded-2xl md:rounded-3xl" />

          {/* Tint Layer */}
          <div className="liquidGlass-tint z-[1] absolute inset-0 bg-white/[0.048] rounded-2xl md:rounded-3xl" />

          {/* Shine Layer */}
          <div className="liquidGlass-shine absolute inset-0 z-[2] overflow-hidden rounded-2xl md:rounded-3xl shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.5),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.5)]" />

          {/* Content Layer */}
          <div className="liquidGlass-text z-[3] relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white/90 backdrop-blur-sm w-full">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

            {/* Album Art */}
            <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={albumArt || "/placeholder.svg"}
                alt={`${songTitle} album art`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Song Info */}
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-lg text-black truncate">{songTitle}</h3>
              <p className="text-sm text-black/70 truncate">{artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="relative h-2 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-black/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <SkipBack className="h-5 w-5 text-black" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
              >
                {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-0.5" />}
              </button>
              <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <SkipForward className="h-5 w-5 text-black" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-black/60" />
              <div className="flex-1 relative h-1 bg-black/10 rounded-full">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${volume}%` }}
                />
              </div>
              <span className="text-xs text-black/60 w-8">{volume}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
