import type { Purifier, PurifierApi, PurifierCreateInput } from '~/features/purifiers/types/purifier'

export function mapPurifier(data: PurifierApi): Purifier {
  return {
    id: String(data.id),
    name: data.name,
    model: data.model,
    location: data.location,
    installDate: data.install_date ?? data.installDate ?? '',
    status: data.status,
    filterLifePercent: data.filter_life_percent ?? data.filterLifePercent ?? 0
  }
}

export function toPurifierCreatePayload(input: PurifierCreateInput) {
  return {
    name: input.name,
    model: input.model,
    location: input.location,
    install_date: input.installDate,
    status: input.status,
    filter_life_percent: input.filterLifePercent
  }
}

export function toPurifierUpdatePayload(input: Partial<PurifierCreateInput>) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.model !== undefined && { model: input.model }),
    ...(input.location !== undefined && { location: input.location }),
    ...(input.installDate !== undefined && { install_date: input.installDate }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.filterLifePercent !== undefined && { filter_life_percent: input.filterLifePercent })
  }
}
