"use client"

import { LiquidGlassCard } from "@/components/liquid-glass-card"
import { LiquidGlassMusicPlayer } from "@/components/liquid-glass-music-player"
import { LiquidGlassNavigation } from "@/components/liquid-glass-navigation"
import { LiquidGlassButton } from "@/components/liquid-glass-button"
import { LiquidGlassMenu } from "@/components/liquid-glass-menu"
import { LiquidGlassBentoGrid } from "@/components/liquid-glass-bento-grid"
import { LiquidGlassDock } from "@/components/liquid-glass-dock"
import { useNotifications } from "@/components/liquid-glass-notification"
import { LiquidGlassWindow } from "@/components/liquid-glass-window"
import { useState } from "react"

export default function Home() {
  const { addNotification, NotificationContainer } = useNotifications()
  const [showWindow, setShowWindow] = useState(false)

  const handleShowNotification = (type: "success" | "error" | "warning" | "info") => {
    const messages = {
      success: { title: "Success!", message: "Your action was completed successfully." },
      error: { title: "Error!", message: "Something went wrong. Please try again." },
      warning: { title: "Warning!", message: "Please check your input and try again." },
      info: { title: "Info", message: "Here's some helpful information for you." },
    }

    addNotification({
      ...messages[type],
      type,
      duration: 5000,
    })
  }

  return (
    <div className="min-h-screen bg-[url('https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/flowers.jpg')] bg-center bg-cover p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ArDacity Presents
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-2xl p-4">
            Complete collection of macOS-style liquid glass components with authentic wobbly distortions and
            cursor-following glow effects
          </p>
        </div>

        {/* New Components Demo */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center text-white backdrop-blur-sm bg-black/20 rounded-2xl p-4 inline-block mx-auto">
            New Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dock Demo */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
                macOS Dock
              </h3>
              <div className="relative h-32 flex items-center justify-center">
                <LiquidGlassDock position="bottom" />
              </div>
            </div>

            {/* Notifications Demo */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
                Notifications
              </h3>
              <div className="flex flex-wrap gap-2">
                <LiquidGlassButton size="sm" onClick={() => handleShowNotification("success")}>
                  Success
                </LiquidGlassButton>
                <LiquidGlassButton size="sm" onClick={() => handleShowNotification("error")}>
                  Error
                </LiquidGlassButton>
                <LiquidGlassButton size="sm" onClick={() => handleShowNotification("warning")}>
                  Warning
                </LiquidGlassButton>
                <LiquidGlassButton size="sm" onClick={() => handleShowNotification("info")}>
                  Info
                </LiquidGlassButton>
              </div>
            </div>

            {/* Window Demo */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
                Window
              </h3>
              <LiquidGlassButton onClick={() => setShowWindow(true)}>Open Window</LiquidGlassButton>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white backdrop-blur-sm bg-black/20 rounded-2xl p-4 inline-block mx-auto">
            Bento Grid Layout
          </h2>
          <LiquidGlassBentoGrid />
        </section>

        {/* Original Components */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
              Large Card
            </h3>
            <LiquidGlassCard
              title="Beautiful Landscape"
              description="Experience the beauty of nature with this stunning mountain landscape that captures the essence of wilderness."
              imageUrl="/placeholder.svg?height=300&width=400"
              imageAlt="Mountain landscape"
            >
              <div className="flex gap-2">
                <LiquidGlassButton size="sm">View Details</LiquidGlassButton>
                <LiquidGlassButton variant="outline" size="sm">
                  Save
                </LiquidGlassButton>
              </div>
            </LiquidGlassCard>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
              Music Player
            </h3>
            <LiquidGlassMusicPlayer
              albumArt="/placeholder.svg?height=200&width=200"
              songTitle="Midnight Dreams"
              artist="Luna & The Stars"
              duration={245}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/20 rounded-2xl p-3 text-center">
              Buttons & Menu
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <LiquidGlassButton>Primary</LiquidGlassButton>
                <LiquidGlassButton variant="secondary">Secondary</LiquidGlassButton>
                <LiquidGlassButton variant="outline">Outline</LiquidGlassButton>
              </div>
              <div className="flex gap-3">
                <LiquidGlassButton size="sm">Small</LiquidGlassButton>
                <LiquidGlassButton size="lg">Large</LiquidGlassButton>
              </div>
              <div className="flex justify-center">
                <LiquidGlassMenu />
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        {/*<LiquidGlassNavigation />*/}
      </div>

      {/* Notification Container */}
      <NotificationContainer />

      {/* Window */}
      {showWindow && (
        <LiquidGlassWindow
          title="Liquid Glass Window"
          onClose={() => setShowWindow(false)}
          defaultPosition={{ x: 200, y: 150 }}
          defaultSize={{ width: 500, height: 400 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black">Welcome to the Liquid Glass Window!</h2>
            <p className="text-black/70">
              This is a fully functional window component with liquid glass effects. You can:
            </p>
            <ul className="list-disc list-inside text-black/70 space-y-1">
              <li>Drag the window around by clicking the title bar</li>
              <li>Close, minimize, or maximize using the traffic light buttons</li>
              <li>Resize the window (when not maximized)</li>
              <li>Enjoy the beautiful liquid glass distortion effects</li>
            </ul>
            <div className="flex gap-2 pt-4">
              <LiquidGlassButton size="sm">Action 1</LiquidGlassButton>
              <LiquidGlassButton variant="secondary" size="sm">
                Action 2
              </LiquidGlassButton>
            </div>
          </div>
        </LiquidGlassWindow>
      )}
    </div>
  )
}
