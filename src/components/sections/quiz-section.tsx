import { useState } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

const QUESTIONS = [
  {
    id: 1,
    question: "Как ходит конь?",
    options: [
      "По прямой на любое количество клеток",
      "Буквой «Г»: 2 клетки в одну сторону и 1 в другую",
      "Только по диагонали",
      "На одну клетку в любую сторону",
    ],
    correct: 1,
    points: 5,
  },
  {
    id: 2,
    question: "Что такое «рокировка»?",
    options: [
      "Ход, при котором пешка превращается в ферзя",
      "Взятие фигуры противника на проходе",
      "Одновременный ход короля и ладьи",
      "Ничья по соглашению сторон",
    ],
    correct: 2,
    points: 10,
  },
  {
    id: 3,
    question: "Что означает «шах и мат»?",
    options: [
      "Ничья в партии",
      "Король атакован и не может уйти из-под удара — конец игры",
      "Угроза ладье противника",
      "Взятие ферзя",
    ],
    correct: 1,
    points: 5,
  },
  {
    id: 4,
    question: "Кто такой Магнус Карлсен?",
    options: [
      "Создатель современных шахматных правил",
      "Компьютерная программа для игры в шахматы",
      "Действующий и многократный чемпион мира по шахматам",
      "Советский гроссмейстер 1960-х годов",
    ],
    correct: 2,
    points: 10,
  },
  {
    id: 5,
    question: "Как называется ход пешки, при котором она берёт другую пешку «на лету»?",
    options: ["Рокировка", "Промоушен", "Взятие на проходе (en passant)", "Гамбит"],
    correct: 2,
    points: 15,
  },
  {
    id: 6,
    question: "Сколько клеток на шахматной доске?",
    options: ["48", "56", "64", "72"],
    correct: 2,
    points: 5,
  },
  {
    id: 7,
    question: "Что такое «вилка» в шахматах?",
    options: [
      "Ход, когда фигура одновременно атакует две и более фигуры противника",
      "Защитный приём с участием двух пешек",
      "Ситуация когда оба короля стоят рядом",
      "Специальный ход ферзя",
    ],
    correct: 0,
    points: 15,
  },
  {
    id: 8,
    question: "Как называется позиция, при которой игрок не может сделать ни одного хода, но его король не под шахом?",
    options: ["Мат", "Пат", "Цугцванг", "Ничья"],
    correct: 1,
    points: 15,
  },
  {
    id: 9,
    question: "Какая начальная позиция правильная для белого ферзя?",
    options: [
      "d1 (белая клетка)",
      "e1 (белая клетка)",
      "d1 — ферзь на своём цвете",
      "c1",
    ],
    correct: 2,
    points: 20,
  },
  {
    id: 10,
    question: "Что такое «цугцванг»?",
    options: [
      "Дебютная ловушка в начале партии",
      "Ситуация, когда любой ход игрока ухудшает его позицию",
      "Атака на короля двумя фигурами одновременно",
      "Защитный манёвр ладьёй",
    ],
    correct: 1,
    points: 20,
  },
]

const MAX_POINTS = QUESTIONS.reduce((sum, q) => sum + q.points, 0)

function getLevel(percent: number) {
  if (percent < 20) return { label: "Новичок", emoji: "♟️", color: "text-gray-400" }
  if (percent < 40) return { label: "Любитель", emoji: "♞", color: "text-blue-400" }
  if (percent < 60) return { label: "Игрок", emoji: "♝", color: "text-green-400" }
  if (percent < 80) return { label: "Опытный", emoji: "♜", color: "text-yellow-400" }
  if (percent < 95) return { label: "Мастер", emoji: "♛", color: "text-orange-400" }
  return { label: "Гроссмейстер", emoji: "♚", color: "text-purple-400" }
}

interface QuizSectionProps {
  onSubmitResult: (score: number, percent: number) => void
  globalStats: { total: number; avgPercent: number } | null
}

export function QuizSection({ onSubmitResult, globalStats }: QuizSectionProps) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro")
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [percent, setPercent] = useState(0)

  const startQuiz = () => {
    setPhase("quiz")
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setShowAnswer(false)
    setScore(0)
  }

  const handleSelect = (idx: number) => {
    if (showAnswer) return
    setSelected(idx)
    setShowAnswer(true)
    const q = QUESTIONS[current]
    if (idx === q.correct) {
      setScore((s) => s + q.points)
    }
  }

  const handleNext = () => {
    setAnswers((a) => [...a, selected ?? -1])
    if (current + 1 < QUESTIONS.length) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      const finalScore = score + (selected === QUESTIONS[current].correct ? 0 : 0)
      const pct = Math.round((score / MAX_POINTS) * 100)
      setPercent(pct)
      setPhase("result")
      onSubmitResult(score, pct)
    }
  }

  const q = QUESTIONS[current]
  const level = getLevel(percent)

  if (phase === "intro") {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-7xl">♟️</div>
        <h1 className="mb-4 font-sans text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Шахматный тест
        </h1>
        <p className="mb-2 max-w-xl font-sans text-lg text-foreground/70">
          10 вопросов. Узнай свой уровень игры в процентах — и сравни себя с другими участниками.
        </p>
        {globalStats && globalStats.total > 0 && (
          <p className="mb-8 font-sans text-sm text-foreground/50">
            Уже прошли тест: <span className="text-foreground/80 font-semibold">{globalStats.total}</span> человек · Средний результат:{" "}
            <span className="text-foreground/80 font-semibold">{globalStats.avgPercent}%</span>
          </p>
        )}
        {(!globalStats || globalStats.total === 0) && (
          <p className="mb-8 font-sans text-sm text-foreground/50">Будь первым, кто пройдёт тест!</p>
        )}
        <MagneticButton onClick={startQuiz} variant="primary">
          Начать тест
        </MagneticButton>
      </div>
    )
  }

  if (phase === "result") {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-6xl">{level.emoji}</div>
        <h2 className="mb-2 font-sans text-3xl font-bold text-foreground md:text-5xl">
          Ваш результат
        </h2>
        <div className={`mb-2 font-sans text-6xl font-bold ${level.color}`}>{percent}%</div>
        <div className={`mb-6 font-sans text-2xl font-semibold ${level.color}`}>{level.label}</div>

        <div className="mb-6 w-full max-w-sm rounded-2xl bg-foreground/5 border border-foreground/10 px-6 py-4 backdrop-blur-sm">
          <div className="mb-1 text-sm text-foreground/50">Баллов набрано</div>
          <div className="text-2xl font-bold text-foreground">{score} / {MAX_POINTS}</div>
        </div>

        {globalStats && globalStats.total > 0 && (
          <div className="mb-8 w-full max-w-sm rounded-2xl bg-foreground/5 border border-foreground/10 px-6 py-4 backdrop-blur-sm">
            <div className="mb-3 text-sm text-foreground/50">Статистика участников</div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-foreground/50 text-xs">Всего прошли</div>
                <div className="text-foreground font-semibold text-lg">{globalStats.total}</div>
              </div>
              <div>
                <div className="text-foreground/50 text-xs">Средний балл</div>
                <div className="text-foreground font-semibold text-lg">{globalStats.avgPercent}%</div>
              </div>
              <div>
                <div className="text-foreground/50 text-xs">Ваш результат</div>
                <div className={`font-semibold text-lg ${percent >= globalStats.avgPercent ? "text-green-400" : "text-orange-400"}`}>
                  {percent >= globalStats.avgPercent ? "выше среднего" : "ниже среднего"}
                </div>
              </div>
            </div>
          </div>
        )}

        <MagneticButton onClick={startQuiz} variant="secondary">
          Пройти ещё раз
        </MagneticButton>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 md:px-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-sans text-sm text-foreground/50">
            Вопрос {current + 1} из {QUESTIONS.length}
          </span>
          <span className="font-sans text-sm text-foreground/50">
            Баллов: <span className="text-foreground font-semibold">{score}</span>
          </span>
        </div>

        <div className="mb-2 h-1 w-full rounded-full bg-foreground/10">
          <div
            className="h-1 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="mt-8 mb-6 rounded-2xl bg-foreground/5 border border-foreground/10 px-6 py-6 backdrop-blur-sm">
          <div className="mb-1 text-xs text-foreground/40 font-semibold uppercase tracking-widest">
            +{q.points} очков
          </div>
          <h3 className="font-sans text-xl font-semibold text-foreground md:text-2xl">{q.question}</h3>
        </div>

        <div className="grid gap-3">
          {q.options.map((opt, idx) => {
            let cls =
              "w-full rounded-xl border px-5 py-4 text-left font-sans text-sm transition-all duration-200 cursor-pointer "
            if (!showAnswer) {
              cls += "border-foreground/10 bg-foreground/5 text-foreground hover:border-primary/50 hover:bg-primary/10"
            } else if (idx === q.correct) {
              cls += "border-green-500 bg-green-500/10 text-green-300"
            } else if (idx === selected && idx !== q.correct) {
              cls += "border-red-500 bg-red-500/10 text-red-300"
            } else {
              cls += "border-foreground/5 bg-foreground/3 text-foreground/40"
            }
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                <span className="mr-3 font-bold text-foreground/30">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {showAnswer && (
          <div className="mt-6 flex justify-end">
            <MagneticButton onClick={handleNext} variant="primary">
              {current + 1 < QUESTIONS.length ? "Следующий вопрос" : "Узнать результат"}
            </MagneticButton>
          </div>
        )}
      </div>
    </div>
  )
}
