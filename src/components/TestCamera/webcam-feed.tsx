"use client"

interface WebcamFeedProps {
  isActive: boolean
}

export default function WebcamFeed({ isActive }: WebcamFeedProps) {
  return (
    <div className="relative aspect-video w-full">
      {isActive ? (
        // Using an img tag to display the MJPEG stream from the API
        <img src="http://0.0.0.0:8001/video_feed" className="h-fit w-fit object-cover" alt="Video feed" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-950">
          <div className="text-center">
            <p className="font-mono text-sm text-cyan-400">FEED INACTIVE</p>
            <p className="mt-2 font-mono text-xs text-cyan-600">Click ACTIVE to enable feed</p>
          </div>
        </div>
      )}

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px] opacity-30"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none rounded-sm bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  )
}

