"use client"

import { useState } from "react"
import { Shield, Power, Zap, Maximize } from "lucide-react"
import SciFiCorner from "@/components/TestCamera/sci-fi-corner"
import WebcamFeed from "@/components/TestCamera/webcam-feed"

export default function SciFiCamera() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Top header bar */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">Security Feed Alpha</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex h-8 items-center gap-1 rounded border border-cyan-700 px-3 font-mono text-xs uppercase tracking-wider ${isActive ? "bg-cyan-900/50 text-cyan-300" : "bg-transparent text-cyan-600"}`}
            >
              <Power className="h-3 w-3" />
              {isActive ? "Active" : "Standby"}
            </button>
            <button className="flex h-8 items-center gap-1 rounded border border-cyan-700 bg-transparent px-3 font-mono text-xs uppercase tracking-wider text-cyan-600 hover:bg-cyan-900/30">
              <Maximize className="h-3 w-3" />
              Expand
            </button>
          </div>
        </div>

        {/* Main container with sci-fi corners */}
        <div className="relative overflow-hidden rounded-lg bg-gray-900/80 p-1">
          <SciFiCorner position="top-left" />
          <SciFiCorner position="top-right" />
          <SciFiCorner position="bottom-left" />
          <SciFiCorner position="bottom-right" />

          <div className="relative z-10 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)]"></div>
                <span className="font-mono text-xs text-cyan-400">LIVE</span>
              </div>
              <div className="font-mono text-xs text-cyan-400">{new Date().toLocaleTimeString()}</div>
            </div>

            {/* Webcam container */}
            <div className="relative overflow-hidden rounded border border-cyan-800 bg-black">
              <div className="absolute inset-0 z-10 pointer-events-none border-t-2 border-cyan-400/30"></div>
              <div className="absolute inset-0 z-10 pointer-events-none border-l-2 border-cyan-400/20"></div>

              <WebcamFeed isActive={isActive} />

              {/* Overlay elements */}
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs text-cyan-400">Signal Strength: Optimal</span>
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(0deg,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Bottom stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Sector 7", "Clearance: Alpha", "Encryption: Active"].map((text, i) => (
                <div key={i} className="rounded border border-cyan-800 bg-cyan-950/30 p-2">
                  <p className="font-mono text-xs text-cyan-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

