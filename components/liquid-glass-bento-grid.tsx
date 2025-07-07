"use client"

import type React from "react"
import { memo, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { animate } from "motion/react"
import { Box, Settings, Sparkles, Shield, Rocket, Heart, Globe, Code } from "lucide-react"

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

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  gradient?: string
  image?: string
}

const GridItem = ({ area, icon, title, description, gradient, image }: GridItemProps) => {
  return (
    <>
      {/* SVG Filter for Liquid Glass Effect */}
      <svg style={{ display: "none" }}>
        <filter
          id={`glass-distortion-${area.replace(/[^a-zA-Z0-9]/g, "")}`}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.008" numOctaves="2" seed="17" result="turbulence" />
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

      <li className={`min-h-[14rem] list-none ${area}`}>
        <div className="liquidGlass-wrapper relative flex font-semibold overflow-hidden text-black cursor-pointer shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] rounded-2xl md:rounded-3xl p-2 md:p-3 hover:p-3 md:hover:p-4 hover:scale-[1.02] hover:shadow-[0_12px_12px_rgba(0,0,0,0.3),0_0_40px_rgba(0,0,0,0.2)] h-full">
          {/* Liquid Glass Effect Layer */}
          <div
            className={`liquidGlass-effect absolute z-0 inset-0 [backdrop-filter:blur(3px)] [filter:url(#glass-distortion-${area.replace(/[^a-zA-Z0-9]/g, "")})] overflow-hidden [isolation:isolate] rounded-2xl md:rounded-3xl`}
          />

          {/* Tint Layer */}
          <div className="liquidGlass-tint z-[1] absolute inset-0 bg-white/[0.048] rounded-2xl md:rounded-3xl" />

          {/* Shine Layer */}
          <div className="liquidGlass-shine absolute inset-0 z-[2] overflow-hidden rounded-2xl md:rounded-3xl shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.5),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.5)]" />

          {/* Content Layer */}
          <div className="liquidGlass-text z-[3] relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 bg-white/90 backdrop-blur-sm w-full">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

            {image && (
              <div className="absolute inset-0 opacity-10">
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover rounded-xl" />
              </div>
            )}
            {gradient && <div className="absolute inset-0 opacity-20 rounded-xl" style={{ background: gradient }} />}
            <div className="relative flex flex-1 flex-col justify-between gap-3 z-10">
              <div className="w-fit rounded-lg border border-gray-600/30 p-2 bg-white/50 backdrop-blur-sm">{icon}</div>
              <div className="space-y-3">
                <h3 className="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem]">
                  {title}
                </h3>
                <h2 className="font-sans text-sm/[1.125rem] text-black/70 md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                  {description}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  )
}

export function LiquidGlassBentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-4 lg:gap-6 xl:max-h-[50rem] xl:grid-rows-3">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-5 w-5 text-purple-600" />}
          title="Build Amazing Products"
          description="Create stunning user interfaces with our liquid glass components that adapt to any design system."
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Settings className="h-5 w-5 text-blue-600" />}
          title="Highly Customizable"
          description="Every component comes with extensive customization options and responsive design built-in."
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/9]"
          icon={<Rocket className="h-5 w-5 text-green-600" />}
          title="Performance First"
          description="Optimized animations and effects that don't compromise on performance. Built with modern web standards."
          gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/9/2/13]"
          icon={<Sparkles className="h-5 w-5 text-yellow-600" />}
          title="Magic Effects"
          description="Liquid glass effects that respond to user interaction with smooth animations."
          gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
        />
        <GridItem
          area="md:[grid-area:3/1/4/5] xl:[grid-area:2/9/3/13]"
          icon={<Shield className="h-5 w-5 text-red-600" />}
          title="Type Safe"
          description="Built with TypeScript for better developer experience."
          gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
        />
        <GridItem
          area="md:[grid-area:3/5/4/9] xl:[grid-area:3/1/4/7]"
          icon={<Code className="h-5 w-5 text-indigo-600" />}
          title="Developer Friendly"
          description="Clean APIs, comprehensive documentation, and examples to get you started quickly."
          gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
        />
        <GridItem
          area="md:[grid-area:3/9/4/13] xl:[grid-area:3/7/4/13]"
          icon={<Heart className="h-5 w-5 text-pink-600" />}
          title="Community Driven"
          description="Open source and built by the community for the community."
          gradient="linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)"
        />
        
      </ul>
    </div>
  )
}
