;("use client")

export default function Logo({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Elegant makeup brush and mirror logo */}
        {/* Mirror circle */} 
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />

        {/* Makeup brush handle */}
        <path
          d="M 50 20 Q 45 35 50 50 Q 55 35 50 20"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Brush bristles */}
        <ellipse cx="50" cy="18" rx="6" ry="4" fill="currentColor" opacity="0.7" />

        {/* Decorative elements */}
        <circle cx="35" cy="50" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="65" cy="50" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="70" r="3" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  )
}
