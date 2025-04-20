"use client";

import { motion } from "motion/react";
import { Pacifico } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react"; // Importing the ArrowRight icon from lucide-react
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

// Define the GIF data
const gifs = [
  {
    id: 1,
    title: "Classification",
    description: "Identifying what objects are in an image",
    src: "/images/heroGifs/classification_gif.gif",
  },
  {
    id: 2,
    title: "Segmentation",
    description: "Dividing an image into segments or regions",
    src: "/images/heroGifs/segmentation_gif.gif",
  },
  {
    id: 3,
    title: "Detection",
    description: "Locating objects within an image",
    src: "/images/heroGifs/detection_gif.gif",
  },
];

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-linear-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function GifCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance the carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToGif = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="overflow-hidden bg-darkblue-500/[0.2] border border-white/[0.1] shadow-lg rounded-lg">
        <CardContent className="p-0">
          <div className="relative h-[300px] w-full">
            {gifs.map((gif, index) => (
              <div
                key={gif.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                <img
                  src={gif.src || "/placeholder.svg"}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicator box */}
      <div className="mt-4 bg-darkblue-500/[0.3] rounded-lg shadow-md p-4">
        <div className="flex justify-center space-x-2 mb-3">
          {gifs.map((gif, index) => (
            <button
              key={gif.id}
              onClick={() => goToGif(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-white/[0.3] hover:bg-white/[0.5]"
              )}
              aria-label={`View ${gif.title}`}
            />
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">
            {gifs[currentIndex].title}
          </h3>
          <p className="text-sm text-white/75">
            {gifs[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroGeometric({
  badge = "Kokonut UI",
  title1 = "Train Vision",
  title2 = "Deploy Vision",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-darkblue-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={150}
          rotate={12}
          gradient="from-blue-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-darkblue-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.4}
          width={400}
          height={100}
          rotate={-8}
          gradient="from-blue-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={350}
          height={90}
          rotate={20}
          gradient="from-darkblue-500/[0.15]"
          className="right-[10%] md:right-[15%] top-[5%] md:top-[10%]"
        />
        <ElegantShape
          delay={0.7}
          width={300}
          height={80}
          rotate={-25}
          gradient="from-blue-500/[0.15]"
          className="left-[15%] md:left-[20%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto py-20 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-500 via-darkblue-500 to-white">
                  {title1}
                </span>
                <br />
                <span
                  className={cn(
                    "bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-darkblue-500 to-white",
                    "pr-5",
                    pacifico.className
                  )}
                >
                  {title2}
                </span>
              </h1>
            </motion.div>
            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg sm:text-l text-darkblue-500/75 text-opacity-75 leading-relaxed font-light tracking-wide max-w-2xl mx-auto lg:mx-0">
                Build, train, and deploy computer vision models using your own GPU. Perfect for teams that need data privacy and cost-effective solutions.
              </p>
            </motion.div>
            <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
              <SignUpButton>
                <button className="mt-6 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition flex items-center gap-3 text-lg">
                  Get Started
                  <ArrowRight className="w-6 h-6" />
                </button>
              </SignUpButton>
            </motion.div>
          </div>

          {/* Replace the image box with the GIF carousel */}
          <GifCarousel />
        </div>
      </div>
    </section>
  );
}

