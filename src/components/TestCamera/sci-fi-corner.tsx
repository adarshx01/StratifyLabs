interface SciFiCornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export default function SciFiCorner({ position }: SciFiCornerProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`absolute z-20 h-16 w-16 ${positionClasses[position]}`}>
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute h-[2px] w-12 bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]"></div>
        <div className="absolute h-12 w-[2px] bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]"></div>
        <div className="absolute left-12 top-0 h-6 w-[2px] rotate-45 bg-cyan-400/70 shadow-[0_0_5px_1px_rgba(34,211,238,0.5)]"></div>
        <div className="absolute left-0 top-12 h-[2px] w-6 rotate-45 bg-cyan-400/70 shadow-[0_0_5px_1px_rgba(34,211,238,0.5)]"></div>
      </div>
    </div>
  )
}

