export interface CaptchaChallenge {
  a: number
  b: number
  question: string
  answer: number
}

export function makeCaptcha(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 8) + 1
  const b = Math.floor(Math.random() * 8) + 1
  return { a, b, question: `Сколько будет ${a} + ${b}?`, answer: a + b }
}

export function isFormReady(name: string, attendance: string | null): boolean {
  return name.trim().length > 0 && (attendance === 'yes' || attendance === 'no')
}

export function isCaptchaCorrect(input: string, expected: number): boolean {
  const parsed = parseInt(input.trim(), 10)
  return !Number.isNaN(parsed) && parsed === expected
}
