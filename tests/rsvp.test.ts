import { describe, it, expect } from 'vitest'
import { isFormReady } from '../src/scripts/rsvp'

describe('isFormReady', () => {
  it('false when name empty', () => {
    expect(isFormReady('', 'yes')).toBe(false)
    expect(isFormReady('   ', 'yes')).toBe(false)
  })
  it('false when no attendance selected', () => {
    expect(isFormReady('Иван', null)).toBe(false)
  })
  it('false when attendance is some other string', () => {
    expect(isFormReady('Иван', 'maybe')).toBe(false)
  })
  it('true when both filled with yes/no', () => {
    expect(isFormReady('Иван', 'yes')).toBe(true)
    expect(isFormReady('Анна', 'no')).toBe(true)
  })
})
