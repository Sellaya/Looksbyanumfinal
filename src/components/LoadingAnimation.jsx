import React from "react";

/**
 * RoseGlowSparkle Component
 * Renders a premium, animated ambient glow using the luxury rose gradient.
 * Creates depth and sophisticated visual atmosphere behind content.
 *
 * NOTE: This component is positioned absolutely within a parent container
 * that has relative positioning (e.g., `<div className="relative">...<RoseGlowSparkle /></div>`).
 */
export default function RoseGlowSparkle({
  size = "lg",
  position = "top-left",
  intensity = "normal",
}) { 
  // Determine size classes with refined proportions
  let sizeClasses = "w-[500px] h-[500px]";
  if (size === "sm") {
    sizeClasses = "w-48 h-48";
  } else if (size === "md") {
    sizeClasses = "w-80 h-80";
  } else if (size === "xl") {
    sizeClasses = "w-[600px] h-[600px]";
  }

  // Determine position classes with smooth offset
  let positionClasses = "top-[-40%] left-[-40%]";
  if (position === "top-right") {
    positionClasses = "top-[-40%] right-[-40%]";
  } else if (position === "bottom-left") {
    positionClasses = "bottom-[-40%] left-[-40%]";
  } else if (position === "bottom-right") {
    positionClasses = "bottom-[-40%] right-[-40%]";
  } else if (position === "center") {
    positionClasses = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
  }

  // Determine intensity with refined opacity
  let intensityClass = "opacity-20";
  if (intensity === "subtle") {
    intensityClass = "opacity-10";
  } else if (intensity === "strong") {
    intensityClass = "opacity-30";
  }

  return (
    <>
      {/* Refined keyframe animations for smooth, luxurious movement */}
      <style jsx="true">{`
        @keyframes glow-pulse-elegant {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          33% {
            transform: scale(1.15) rotate(3deg);
            opacity: 0.85;
          }
          66% {
            transform: scale(1.08) rotate(-2deg);
            opacity: 0.92;
          }
        }

        @keyframes glow-drift {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(15px, -10px) scale(1.05);
          }
          50% {
            transform: translate(-10px, 15px) scale(0.98);
          }
          75% {
            transform: translate(8px, 8px) scale(1.02);
          }
        }

        .glow-animation-primary {
          animation: glow-pulse-elegant 8s ease-in-out infinite;
        }

        .glow-animation-secondary {
          animation: glow-drift 12s ease-in-out infinite;
        }
      `}</style>

      {/* Primary glow layer - main ambient light */}
      <div
        className={`
          absolute rounded-full blur-3xl
          bg-gradient-to-br from-rose-400/70 via-pink-400/60 to-fuchsia-500/70
          ${sizeClasses} ${positionClasses} ${intensityClass}
          glow-animation-primary pointer-events-none z-0
        `}
        aria-hidden="true"
      />

      {/* Secondary glow layer - adds depth and richness */}
      <div
        className={`
          absolute rounded-full blur-2xl
          bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/50 to-pink-400/40
          ${sizeClasses} ${positionClasses} ${intensityClass}
          glow-animation-secondary pointer-events-none z-0
        `}
        style={{
          filter: "blur(60px)",
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />

      {/* Tertiary accent layer - subtle shimmer effect */}
      <div
        className={`
          absolute rounded-full blur-3xl
          bg-gradient-to-bl from-pink-300/30 via-rose-400/30 to-fuchsia-400/30
          ${sizeClasses} ${positionClasses}
          opacity-15 pointer-events-none z-0
        `}
        style={{
          filter: "blur(80px)",
          animation: "glow-pulse-elegant 10s ease-in-out infinite reverse",
        }}
        aria-hidden="true"
      />
    </>
  );
}
