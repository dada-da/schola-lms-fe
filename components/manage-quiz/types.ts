export interface QuizQuestion {
  id: number
  question: string
  sequence: number
  lessonId: number
}

export interface QuizAnswer {
  id: number
  answer: string
  correct: boolean
  questionId: number
}

export interface QuizAttempt {
  id: number
  studentId: number
  lessonId: number
  attemptAt: string
}

export interface QuizAttemptResult {
  id: number
  studentId: number
  lessonId: number
  correctCount: number
  totalQuestions: number
  attemptAt: string
}

export interface QuestionFormValues {
  question: string
  sequence: number
}

export interface AnswerFormValues {
  answer: string
  correct: boolean
}

export interface QuestionWithAnswers {
  question: QuizQuestion
  answers: QuizAnswer[]
}
