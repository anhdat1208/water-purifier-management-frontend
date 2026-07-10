import type { FilterLifeStatus, FilterType } from '~/features/filters/types/filter'

export const filterTypeLabels: Record<FilterType, string> = {
  sediment: 'Lõi lọc thô',
  carbon: 'Lõi than hoạt tính',
  ro_membrane: 'Màng RO',
  mineral: 'Lõi khoáng',
  post_carbon: 'Lõi than sau'
}

export const filterLifeStatusLabels: Record<FilterLifeStatus, string> = {
  good: 'Tốt',
  warning: 'Cần chú ý',
  critical: 'Cần thay gấp'
}

export function getFilterLifeStatus(lifePercent: number): FilterLifeStatus {
  if (lifePercent <= 20) return 'critical'
  if (lifePercent <= 40) return 'warning'
  return 'good'
}
