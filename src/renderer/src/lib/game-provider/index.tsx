// ---------------------------
// INTERFEJSY DO ROZEZNANIA SIĘ
// ---------------------------

// baza
interface Category {
  id: string
  name: string
}

// baza
interface Answer {
  id: string
  content: string
  note: string
  isCorrect: boolean
}

// baza
interface Question {
  id: string
  content: string
  category: string // id_category
  answers: Answer[]
}

interface Team {
  id: string
  name: string
  score: number
}

// ------------------------------

// ---------------------------
// TUTAJ BĘDZIE STATE Z GRĄ
// ---------------------------

interface Game {
  question: Question
  currentRound: number
  answerChoose: string // id_answer
  questionsChoosed?: Question[]
  categories?: Category[]
}
