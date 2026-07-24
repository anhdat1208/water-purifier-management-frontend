/** Ngày local YYYY-MM-DD (tránh lệch UTC của toISOString). */
export function localDateString(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * % tuổi thọ còn lại:
 * còn = 100 * (1 - số_ngày_đã_dùng / lifespanDays)
 */
export function computeFilterLifePercent(
  lastReplacedDate: string,
  lifespanDays: number,
  today = new Date()
): number {
  if (!lifespanDays || lifespanDays <= 0) return 0
  if (!lastReplacedDate) return 100

  const replaced = new Date(`${lastReplacedDate}T00:00:00`)
  if (Number.isNaN(replaced.getTime())) return 100

  const start = Date.UTC(replaced.getFullYear(), replaced.getMonth(), replaced.getDate())
  const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const daysUsed = Math.floor((end - start) / 86_400_000)

  if (daysUsed <= 0) return 100
  return Math.max(0, Math.min(100, Math.round((1 - daysUsed / lifespanDays) * 100)))
}
