import { describe, it, expect } from 'vitest'
import { makeCaptcha, isFormReady, isCaptchaCorrect } from '../src/scripts/rsvp'

describe('makeCaptcha', () => {
  it('produces a valid arithmetic challenge', () => {
    const c = makeCaptcha()
    expect(c.a + c.b).toBe(c.answer)
    expect(c.question).toContain(`${c.a} + ${c.b}`)
  })
})

describe('isFormReady', () => {
  it('false when name empty', () => {
    expect(isFormReady('', 'yes')).toBe(false)
    expect(isFormReady('   ', 'yes')).toBe(false)
  })
  it('false when no attendance selected', () => {
    expect(isFormReady('Иван', null)).toBe(false)
  })
  it('true when both filled', () => {
    expect(isFormReady('Иван', 'yes')).toBe(true)
    expect(isFormReady('Анна', 'no')).toBe(true)
  })
})

describe('isCaptchaCorrect', () => {
  it('accepts correct answer', () => {
    expect(isCaptchaCorrect('5', 5)).toBe(true)
    expect(isCaptchaCorrect(' 5 ', 5)).toBe(true)
  })
  it('rejects wrong answer', () => {
    expect(isCaptchaCorrect('4', 5)).toBe(false)
  })
  it('rejects non-numeric input', () => {
    expect(isCaptchaCorrect('abc', 5)).toBe(false)
    expect(isCaptchaCorrect('', 5)).toBe(false)
  })
})
