import { describe, it, expect } from 'vitest'
import { calcRemaining, pluralizeRu } from '../src/scripts/countdown'

describe('calcRemaining', () => {
  it('reports 1 day remaining when target is 24h ahead', () => {
    const now = new Date('2026-07-03T15:30:00+03:00')
    const r = calcRemaining('2026-07-04T15:30:00+03:00', now)
    expect(r.days).toBe(1)
    expect(r.hours).toBe(0)
    expect(r.isPast).toBe(false)
  })

  it('returns isPast=true when target has passed', () => {
    const now = new Date('2026-07-05T00:00:00+03:00')
    const r = calcRemaining('2026-07-04T15:30:00+03:00', now)
    expect(r.isPast).toBe(true)
  })

  it('reports zero seconds at exact target', () => {
    const target = '2026-07-04T15:30:00+03:00'
    const r = calcRemaining(target, new Date(target))
    expect(r.isPast).toBe(true)
  })
})

describe('pluralizeRu', () => {
  it('selects singular for 1', () => {
    expect(pluralizeRu(1, ['день', 'дня', 'дней'])).toBe('день')
  })
  it('selects plural for 2-4', () => {
    expect(pluralizeRu(3, ['день', 'дня', 'дней'])).toBe('дня')
  })
  it('selects general for 5+', () => {
    expect(pluralizeRu(11, ['день', 'дня', 'дней'])).toBe('дней')
    expect(pluralizeRu(25, ['день', 'дня', 'дней'])).toBe('дней')
  })
})
