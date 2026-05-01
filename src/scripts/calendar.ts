export interface CalendarCell {
  day: number | null
}

export function buildMonthGrid(year: number, monthZeroBased: number): CalendarCell[] {
  const first = new Date(year, monthZeroBased, 1)
  const daysInMonth = new Date(year, monthZeroBased + 1, 0).getDate()
  const startWeekday = (first.getDay() + 6) % 7 // shift Mon=0 ... Sun=6

  const cells: CalendarCell[] = []
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d })
  while (cells.length % 7 !== 0) cells.push({ day: null })
  return cells
}
