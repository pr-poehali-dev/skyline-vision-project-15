import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { QuizSection } from "@/components/sections/quiz-section"
import { useRef, useEffect, useState } from "react"
import func2url from "../../backend/func2url.json"

const API_URL = func2url["chess-quiz"]

export default function Index() {
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [globalStats, setGlobalStats] = useState<{ total: number; avgPercent: number } | null>(null)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) clearInterval(intervalId)
    }, 100)

    const fallbackTimer = setTimeout(() => setIsLoaded(true), 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setGlobalStats(data)
    } catch (_e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleSubmitResult = async (score: number, percent: number) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, percent }),
      })
      await fetchStats()
    } catch (_e) {
      // ignore
    }
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1a1a2e"
            colorB="#16213e"
            speed={0.3}
            detail={0.6}
            blend={60}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={30}
            fineY={30}
          />
          <ChromaFlow
            baseColor="#0f3460"
            upColor="#533483"
            downColor="#0d0d0d"
            leftColor="#e94560"
            rightColor="#1a1a2e"
            intensity={0.7}
            radius={1.5}
            momentum={20}
            maskType="alpha"
            opacity={0.95}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/10 backdrop-blur-md">
            <span className="text-lg">♟️</span>
          </div>
          <span className="font-sans text-lg font-semibold tracking-tight text-foreground">
            Шахматный тест
          </span>
        </div>

        {globalStats && globalStats.total > 0 && (
          <div className="hidden items-center gap-6 md:flex">
            <div className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="font-sans text-xs text-foreground/60">
                Прошли:{" "}
                <span className="font-semibold text-foreground">{globalStats.total}</span>
                {" · "}Средний балл:{" "}
                <span className="font-semibold text-foreground">{globalStats.avgPercent}%</span>
              </span>
            </div>
          </div>
        )}
      </nav>

      <div
        className={`relative z-10 h-full w-full transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <QuizSection onSubmitResult={handleSubmitResult} globalStats={globalStats} />
      </div>
    </main>
  )
}