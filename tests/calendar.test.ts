import { describe, it, expect } from 'vitest'
import { buildMonthGrid } from '../src/scripts/calendar'

describe('buildMonthGrid', () => {
  it('builds a 5-row grid for July 2026 (35 cells)', () => {
    const cells = buildMonthGrid(2026, 6) // July is month index 6
    expect(cells.length).toBe(35)
  })

  it('starts July 2026 on Wednesday (Mon-first index 2)', () => {
    const cells = buildMonthGrid(2026, 6)
    expect(cells[0].day).toBeNull()
    expect(cells[1].day).toBeNull()
    expect(cells[2].day).toBe(1)
  })

  it('places day 4 at index 5 (Saturday)', () => {
    const cells = buildMonthGrid(2026, 6)
    expect(cells[5].day).toBe(4)
  })

  it('contains all 31 days of July', () => {
    const cells = buildMonthGrid(2026, 6)
    const days = cells.filter((c) => c.day !== null).map((c) => c.day)
    expect(days).toEqual(Array.from({ length: 31 }, (_, i) => i + 1))
  })
})
