import { useState } from 'react'
import './App.css'

type Country = {
  name: string
  code: string
}

const countries: Country[] = [
  { name: 'Франция', code: 'fr' },
  { name: 'Германия', code: 'de' },
  { name: 'Италия', code: 'it' },
  { name: 'Испания', code: 'es' },
  { name: 'Япония', code: 'jp' },
  { name: 'Бразилия', code: 'br' },
  { name: 'Канада', code: 'ca' },
  { name: 'США', code: 'us' },
  { name: 'Великобритания', code: 'gb' },
  { name: 'Украина', code: 'ua' },
  { name: 'Польша', code: 'pl' },
  { name: 'Китай', code: 'cn' },
  { name: 'Южная Корея', code: 'kr' },
  { name: 'Австралия', code: 'au' },
  { name: 'Аргентина', code: 'ar' },
  { name: 'Мексика', code: 'mx' },
  { name: 'Турция', code: 'tr' },
  { name: 'Греция', code: 'gr' },
  { name: 'Швеция', code: 'se' },
  { name: 'Норвегия', code: 'no' },
  { name: 'Швейцария', code: 'ch' },
  { name: 'Португалия', code: 'pt' },
  { name: 'Нидерланды', code: 'nl' },
  { name: 'Индия', code: 'in' },
]

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function createQuestion() {
  const correct = countries[Math.floor(Math.random() * countries.length)]
  const wrong = shuffle(
    countries.filter((country) => country.code !== correct.code),
  ).slice(0, 3)

  return {
    correct,
    options: shuffle([correct, ...wrong]),
  }
}

function App() {
  const [question, setQuestion] = useState(createQuestion)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => {
    return Number(localStorage.getItem('bestStreak')) || 0
  })

  const isAnswered = selectedAnswer !== null
  const isCorrect = selectedAnswer === question.correct.name

  function chooseAnswer(answer: string) {
    if (isAnswered) return

    setSelectedAnswer(answer)

    if (answer === question.correct.name) {
      const nextStreak = streak + 1
      setStreak(nextStreak)

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak)
        localStorage.setItem('bestStreak', String(nextStreak))
      }
    } else {
      setStreak(0)
    }
  }

  function nextQuestion() {
    setQuestion(createQuestion())
    setSelectedAnswer(null)
  }

  return (
    <main className="app">
      <section className="game">
        <div className="stats">
          <div>
            <span>Серия</span>
            <strong>{streak}</strong>
          </div>

          <div>
            <span>Рекорд</span>
            <strong>{bestStreak}</strong>
          </div>
        </div>

        <div className="flag-card">
          <img
            className="flag-image"
            src={`https://flagcdn.com/w640/${question.correct.code}.png`}
            alt={`Флаг страны: ${question.correct.name}`}
          />
        </div>

        <h1>Угадай страну</h1>

        <div className="answers">
          {question.options.map((country) => (
            <button
              key={country.code}
              disabled={isAnswered}
              className={
                isAnswered && country.name === question.correct.name
                  ? 'correct'
                  : isAnswered && country.name === selectedAnswer
                    ? 'wrong'
                    : ''
              }
              onClick={() => chooseAnswer(country.name)}
            >
              {country.name}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={isCorrect ? 'result correct-result' : 'result wrong-result'}>
            <p>{isCorrect ? 'Правильно!' : `Неправильно. Это ${question.correct.name}`}</p>
            <button onClick={nextQuestion}>Следующий флаг</button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App