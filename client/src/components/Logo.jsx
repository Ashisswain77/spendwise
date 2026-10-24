export default function SpendWiseLogo({ className = "h-8 w-auto", textColor = "currentColor", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 265 48"
      className={className}
      fill="none"
      role="img"
      aria-label="SpendWise Logo"
      {...props}
    >
      <text
        x="0"
        y="38"
        fontFamily="'Plus Jakarta Sans', 'Inter', 'Manrope', system-ui, -apple-system, sans-serif"
        fontSize="44"
        fontWeight="700"
        letterSpacing="-1.2"
      >
        <tspan fill={textColor}>Spend</tspan>
        <tspan fill="#10B981">Wise</tspan>
      </text>
    </svg>
  )
}
