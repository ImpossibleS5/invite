export function isFormReady(name: string, attendance: string | null): boolean {
  return name.trim().length > 0 && (attendance === 'yes' || attendance === 'no')
}
