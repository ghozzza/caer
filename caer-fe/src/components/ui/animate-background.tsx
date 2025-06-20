"use client"

import { useEffect, useRef, useState } from "react"
import { Building2, TrendingUp, Link, Hexagon, Shield, FileText, Landmark, Package, RotateCcw, Wallet } from "lucide-react"
import eth from "/eth.svg"
import usdt from "/usdt.png"
import base from "/base-logo.png"

export default function imateBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Fixed points that correspond to icon positions
    const getFixedPoints = () => {
      const { width, height } = dimensions

      // Scale positions based on the reference image layout
      return [
        // Top row
        { x: width * 0.12, y: height * 0.15 }, // Golden cube area
        { x: width * 0.25, y: height * 0.25 }, // Ethereum area
        { x: width * 0.45, y: height * 0.22 }, // Center-top area
        { x: width * 0.75, y: height * 0.28 }, // Shield area
        { x: width * 0.88, y: height * 0.18 }, // Top-right area

        // Middle row
        { x: width * 0.08, y: height * 0.35 }, // Left chain
        { x: width * 0.08, y: height * 0.55 }, // Left chart
        { x: width * 0.35, y: height * 0.45 }, // Red circle
        { x: width * 0.55, y: height * 0.52 }, // Center building
        { x: width * 0.82, y: height * 0.45 }, // Right building
        { x: width * 0.92, y: height * 0.55 }, // Right document

        // Bottom row
        { x: width * 0.18, y: height * 0.75 }, // Bottom-left link
        { x: width * 0.32, y: height * 0.78 }, // Blue circle
        { x: width * 0.52, y: height * 0.82 }, // Bottom cube
        { x: width * 0.78, y: height * 0.78 }, // Purple circle
      ]
    }

    const points = getFixedPoints()

    // Create connections between nearby points (similar to the image)
    const connections: number[][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4], // Top connections
      [0, 5],
      [1, 7],
      [2, 8],
      [3, 9],
      [4, 10], // Vertical connections
      [5, 6],
      [6, 11],
      [7, 8],
      [8, 9],
      [9, 10], // Middle connections
      [11, 12],
      [12, 13],
      [13, 14], // Bottom connections
      [6, 12],
      [7, 13],
      [8, 13],
      [9, 14], // More verticals
    ]

    // Moving dots on connections
    const movingDots: Array<{
      connectionIndex: number
      progress: number
      speed: number
    }> = []

    // Initialize moving dots
    const dotCount = dimensions.width < 768 ? 3 : 6
    for (let i = 0; i < Math.min(dotCount, connections.length); i++) {
      movingDots.push({
        connectionIndex: Math.floor(Math.random() * connections.length),
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "#e0e7ff"
      ctx.lineWidth = 1
      connections.forEach(([startIndex, endIndex]) => {
        const start = points[startIndex]
        const end = points[endIndex]

        if (start && end) {
          ctx.beginPath()
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
          ctx.stroke()
        }
      })

      // Draw and update moving dots
      movingDots.forEach((dot) => {
        const connection = connections[dot.connectionIndex]
        if (!connection) return

        const start = points[connection[0]]
        const end = points[connection[1]]
        if (!start || !end) return

        // Calculate current position
        const x = start.x + (end.x - start.x) * dot.progress
        const y = start.y + (end.y - start.y) * dot.progress

        // Draw moving dot
        ctx.fillStyle = "#6366f1"
        ctx.beginPath()
        const dotSize = dimensions.width < 768 ? 2 : 3
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fill()

        // Update progress
        dot.progress += dot.speed
        if (dot.progress > 1) {
          dot.progress = 0
          // Randomly switch to a different connection
          if (Math.random() > 0.8) {
            dot.connectionIndex = Math.floor(Math.random() * connections.length)
          }
        }
      })

      // Draw static dots at connection points
      ctx.fillStyle = "#6366f1"
      points.forEach((point) => {
        ctx.beginPath()
        const pointSize = dimensions.width < 768 ? 2 : 3
        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [dimensions])

  // Icon positions matching the reference image exactly
  const getIconPositions = () => {
    const { width, height } = dimensions
    if (width === 0) return []

    const isMobile = width < 768
    const iconSize = isMobile ? 10 : 12

    return [
      // Top row - matching the reference image
      {
        icon: Package,
        x: width * 0.12,
        y: height * 0.15,
        bg: "bg-yellow-400",
        color: "text-white",
        size: iconSize,
      },
      {
        icon: Hexagon,
        x: width * 0.25,
        y: height * 0.25,
        bg: "bg-gray-800",
        color: "text-white",
        size: iconSize,
      },
      {
        icon: Shield,
        x: width * 0.75,
        y: height * 0.28,
        bg: "bg-gray-600",
        color: "text-white",
        size: iconSize,
      },
      {
        icon: Building2,
        x: width * 0.88,
        y: height * 0.18,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },
      {
        icon: RotateCcw,
        x: width * 0.88,
        y: height * 0.32,
        bg: "bg-red-500",
        color: "text-white",
        size: iconSize,
      },

      // Left side
      {
        icon: Link,
        x: width * 0.08,
        y: height * 0.35,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },
      {
        icon: TrendingUp,
        x: width * 0.08,
        y: height * 0.55,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },

      // Center area
      {
        icon: RotateCcw,
        x: width * 0.35,
        y: height * 0.45,
        bg: "bg-red-500",
        color: "text-white",
        size: iconSize,
      },
      {
        icon: Building2,
        x: width * 0.55,
        y: height * 0.52,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },

      // Right side
      {
        icon: Building2,
        x: width * 0.82,
        y: height * 0.45,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },
      {
        icon: FileText,
        x: width * 0.92,
        y: height * 0.55,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },

      // Bottom area
      {
        icon: Link,
        x: width * 0.18,
        y: height * 0.75,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },
      {
        icon: Landmark,
        x: width * 0.32,
        y: height * 0.78,
        bg: "bg-blue-500",
        color: "text-white",
        size: iconSize,
      },
      {
        icon: Package,
        x: width * 0.52,
        y: height * 0.82,
        bg: "bg-white",
        color: "text-indigo-500",
        border: true,
        size: iconSize,
      },
      {
        icon: Link,
        x: width * 0.78,
        y: height * 0.78,
        bg: "bg-purple-600",
        color: "text-white",
        size: iconSize,
      },
    ]
  }

  const iconPositions = getIconPositions()

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen max-h-[100vh] bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {iconPositions.map((item, index) => {
          const IconComponent = item.icon
          const sizeClass = `w-${item.size} h-${item.size}`
          const iconSizeClass = dimensions.width < 768 ? "w-4 h-4" : "w-5 h-5"

          return (
            <div
              key={index}
              className={`absolute ${sizeClass} ${item.bg} rounded-${item.bg.includes("white") ? "lg" : "full"} flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                item.border ? "border border-indigo-100" : ""
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: "translate(-50%, -50%)",
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <IconComponent className={`${iconSizeClass} ${item.color}`} />
            </div>
          )
        })}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Cross Chain Lending and Borrowing by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}
              Embocon
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The First Lending and Borrowing Platform Integrated With CCIP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
