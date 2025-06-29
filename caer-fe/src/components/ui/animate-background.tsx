"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Hexagon,
  Shield,
  FileText,
  Landmark,
  Package,
  RotateCcw,
  Wallet,
  LucideIcon,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { TypewriterEffectSmooth } from "./typewriter-effect";

interface IconPosition {
  icon?: LucideIcon;
  image?: string;
  x: number;
  y: number;
  bg: string;
  color?: string;
  size: number;
  type: "icon" | "image";
  border?: boolean;
}

export default function imateBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showButtons, setShowButtons] = useState(false);

  // Words for typewriter effect
  const words = [
    {
      text: "The",
    },
    {
      text: "First",
    },
    {
      text: "Permissionless",
    },
    {
      text: "Cross-Chain",
    },
    {
      text: "Lending",
    },
    {
      text: "Protocol",
    },
    {
      text: "Powered",
    },
    {
      text: "by",
    },
    {
      text: "Chainlink",
      className: "text-indigo-500 dark:text-indigo-500",
    },
    {
      text: "CCIP",
      className: "text-indigo-500 dark:text-indigo-500",
    },
  ];

  const handleTypewriterComplete = () => {
    setShowButtons(true);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Get icon positions to match with connection points
    const iconPositions = getIconPositions();

    // Create points based on actual icon positions
    const getActivePoints = () => {
      return iconPositions.map((icon) => ({
        x: icon.x,
        y: icon.y,
      }));
    };

    const points = getActivePoints();

    // Create connections between actual icons to match Chainlink layout pattern
    const connections: number[][] = [
      [0, 1], // BSC to Chainlink
      [1, 2], // Chainlink to Base
      [10, 4], // Chainlink to ETH (center hub)
      [4, 6], // ETH to Wallet (center connection)
      [5, 9], // Arbitrum to Polkadot
      [7, 8], // USDT to Optimism
      [8, 9], // Optimism to Polkadot
      [0, 3], // BSC to USDC (left side)
      [2, 5], // Base to Arbitrum (right side)
      [3, 7], // USDC to USDT (bottom left)
      [5, 8], // Arbitrum to Optimism (bottom right)

      // New connections for DeFi/CCIP icons
      [1, 10], // Chainlink to Shield (security)
      [6, 11], // Shield to TrendingUp (DeFi growth)
    ];

    // Moving dots on connections
    const movingDots: Array<{
      connectionIndex: number;
      progress: number;
      speed: number;
    }> = [];

    // Initialize moving dots
    const dotCount = dimensions.width < 768 ? 3 : 6;
    for (let i = 0; i < Math.min(dotCount, connections.length); i++) {
      movingDots.push({
        connectionIndex: Math.floor(Math.random() * connections.length),
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with lighter, more subtle lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)"; // Very light gray-blue
      ctx.lineWidth = 1;
      connections.forEach(([startIndex, endIndex]) => {
        const start = points[startIndex];
        const end = points[endIndex];

        if (start && end) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      });

      // Draw and update moving dots
      movingDots.forEach((dot) => {
        const connection = connections[dot.connectionIndex];
        if (!connection) return;

        const start = points[connection[0]];
        const end = points[connection[1]];
        if (!start || !end) return;

        // Calculate current position
        const x = start.x + (end.x - start.x) * dot.progress;
        const y = start.y + (end.y - start.y) * dot.progress;

        // Draw moving dot with blue color like Chainlink
        ctx.fillStyle = "#1D4ED8"; // Blue-600
        ctx.beginPath();
        const dotSize = dimensions.width < 768 ? 1.5 : 2;
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Update progress
        dot.progress += dot.speed;
        if (dot.progress > 1) {
          dot.progress = 0;
          // Randomly switch to a different connection
          if (Math.random() > 0.8) {
            dot.connectionIndex = Math.floor(
              Math.random() * connections.length
            );
          }
        }
      });

      // Only draw static dots at points that have connections
      const connectedPoints = new Set<number>();
      connections.forEach(([start, end]) => {
        connectedPoints.add(start);
        connectedPoints.add(end);
      });

      ctx.fillStyle = "#1D4ED8"; 
      points.forEach((point, index) => {
        if (connectedPoints.has(index)) {
          ctx.beginPath();
          const pointSize = dimensions.width < 768 ? 1 : 2;
          ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [dimensions]);

  // Icon and image positions - supporting both icons and images
  const getIconPositions = (): IconPosition[] => {
    const { width, height } = dimensions;
    if (width === 0) return [];

    const isMobile = width < 768;
    const iconSize = isMobile ? 10 : 12;

    return [
      // Top row - distributed like Chainlink layout
      {
        image: "/bnb.png",
        x: width * 0.15,
        y: height * 0.12,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },
      // Chainlink in center-top
      {
        image: "/eth2.jpg",
        x: width * 0.5,
        y: height * 0.08,
        bg: "bg-white",
        size: iconSize + 4,
        type: "image",
        border: true,
      },
      // Base top-right
      {
        image: "/chain/base.png",
        x: width * 0.85,
        y: height * 0.12,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },

      // Left side
      {
        image: "/token/usdc.png",
        x: width * 0.08,
        y: height * 0.35,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },

      // Center-left ETH position
      {
        image: "/chainlink.png",
        x: width * 0.25,
        y: height * 0.45,
        bg: "bg-white",
        size: iconSize + 3,
        type: "image",
        border: true,
      },

      // Center area - larger elements
      {
        image: "/chain/arbitrum.png",
        x: width * 0.75,
        y: height * 0.35,
        bg: "bg-white",
        size: iconSize + 3,
        type: "image",
        border: true,
      },

      // Center-bottom
      {
        icon: Wallet,
        x: width * 0.35,
        y: height * 0.65,
        bg: "bg-blue-500",
        color: "text-white",
        size: iconSize,
        type: "icon",
      },

      // Bottom distributed
      {
        image: "/token/usdt.png",
        x: width * 0.15,
        y: height * 0.8,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },
      {
        image: "/chain/avax-logo.png",
        x: width * 0.65,
        y: height * 0.75,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },
      {
        image: "/polkadot.png",
        x: width * 0.92,
        y: height * 0.65,
        bg: "bg-white",
        size: iconSize + 2,
        type: "image",
        border: true,
      },

      // Additional DeFi/CCIP related icons
      {
        icon: Shield,
        x: width * 0.45,
        y: height * 0.3,
        bg: "bg-white",
        color: "text-blue-800",
        size: iconSize + 2,
        type: "icon",
      },
      {
        icon: TrendingUp,
        x: width * 0.25,
        y: height * 0.7,
        bg: "bg-white",
        color: "text-green-600",
        size: iconSize,
        type: "icon",
      },
    ];
  };

  const iconPositions = getIconPositions();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen max-h-[100vh] bg-white overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Floating Icons and Images */}
      <div className="absolute inset-0 pointer-events-none">
        {iconPositions.map((item, index) => {
          const sizeClass = `w-${item.size} h-${item.size}`;
          const iconSizeClass = dimensions.width < 768 ? "w-4 h-4" : "w-5 h-5";
          // Use fixed sizes for images to ensure they display properly
          const imageSizeClass =
            dimensions.width < 768 ? "w-12 h-12" : "w-14 h-14";

          return (
            <div
              key={index}
              className={`absolute ${sizeClass} ${item.bg} ${
                item.type === "image"
                  ? "rounded-full"
                  : item.bg.includes("white")
                  ? "rounded-lg"
                  : "rounded-full"
              } flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                item.border ? "border border-indigo-100" : ""
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: "translate(-50%, -50%)",
                animation: `float ${
                  3 + Math.random() * 2
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {item.type === "icon" && item.icon ? (
                <item.icon className={`${iconSizeClass} ${item.color}`} />
              ) : item.type === "image" && item.image ? (
                <div
                  className={`${imageSizeClass} relative rounded-full overflow-hidden`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto w-full">
          <div className="mb-8 px-2 max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 overflow-hidden">
            <TypewriterEffectSmooth 
              words={words} 
              className="justify-center w-full"
              onComplete={handleTypewriterComplete}
            />
          </div>
          {/* Fixed height container untuk buttons agar posisi typewriter tidak bergeser */}
          <div className="h-20 flex items-center justify-center">
            {showButtons && (
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  staggerChildren: 0.2
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.3, delay: 0 }}
                >
                  <Link href="/earn">
                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-size-200 bg-pos-0 text-white rounded-lg font-semibold hover:bg-pos-100 transition-all duration-200 shadow-lg cursor-pointer flex items-center gap-2 animate-gradient">
                      Get Started
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <a
                    href="https://caer-finance-ccip.gitbook.io/caer-finance-docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </a>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
        
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        
        .hover\\:bg-pos-100:hover {
          background-position: 100% 50%;
        }
      `}</style>
    </div>
  );
}
