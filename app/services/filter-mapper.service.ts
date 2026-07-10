import type { Filter, FilterApi, FilterCreateInput } from '~/features/filters/types/filter'

export function mapFilter(data: FilterApi): Filter {
  return {
    id: String(data.id),
    name: data.name,
    type: data.type,
    purifierId: String(data.purifier_id ?? data.purifierId ?? ''),
    purifierName: data.purifier_name ?? data.purifierName ?? '',
    stage: data.stage,
    lifePercent: data.life_percent ?? data.lifePercent ?? 0,
    lifespanDays: data.lifespan_days ?? data.lifespanDays ?? 180,
    installedDate: data.installed_date ?? data.installedDate ?? '',
    lastReplacedDate: data.last_replaced_date ?? data.lastReplacedDate ?? '',
    notes: data.notes
  }
}

export function toFilterCreatePayload(input: FilterCreateInput) {
  return {
    name: input.name,
    type: input.type,
    purifier_id: input.purifierId,
    stage: input.stage,
    life_percent: input.lifePercent,
    lifespan_days: input.lifespanDays,
    installed_date: input.installedDate,
    last_replaced_date: input.lastReplacedDate,
    notes: input.notes
  }
}

export function toFilterUpdatePayload(input: Partial<FilterCreateInput>) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.purifierId !== undefined && { purifier_id: input.purifierId }),
    ...(input.stage !== undefined && { stage: input.stage }),
    ...(input.lifePercent !== undefined && { life_percent: input.lifePercent }),
    ...(input.lifespanDays !== undefined && { lifespan_days: input.lifespanDays }),
    ...(input.installedDate !== undefined && { installed_date: input.installedDate }),
    ...(input.lastReplacedDate !== undefined && { last_replaced_date: input.lastReplacedDate }),
    ...(input.notes !== undefined && { notes: input.notes })
  }
}
