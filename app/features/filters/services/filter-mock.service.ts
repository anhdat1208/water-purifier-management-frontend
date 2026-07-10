import type { Filter, FilterCreateInput, FilterUpdateInput } from '~/features/filters/types/filter'

let nextId = 16

const purifierNames: Record<string, string> = {
  '1': 'Máy lọc phòng khách',
  '2': 'Máy lọc bếp',
  '3': 'Máy lọc phòng ngủ',
  '4': 'Máy lọc văn phòng',
  '5': 'Máy lọc sảnh'
}

const store: Filter[] = [
  {
    id: '1',
    name: 'Lõi PP 5 micron',
    type: 'sediment',
    purifierId: '1',
    purifierName: 'Máy lọc phòng khách',
    stage: 1,
    lifePercent: 72,
    lifespanDays: 180,
    installedDate: '2024-03-15',
    lastReplacedDate: '2025-09-15'
  },
  {
    id: '2',
    name: 'Lõi than GAC',
    type: 'carbon',
    purifierId: '1',
    purifierName: 'Máy lọc phòng khách',
    stage: 2,
    lifePercent: 68,
    lifespanDays: 180,
    installedDate: '2024-03-15',
    lastReplacedDate: '2025-09-15'
  },
  {
    id: '3',
    name: 'Màng RO 75GPD',
    type: 'ro_membrane',
    purifierId: '1',
    purifierName: 'Máy lọc phòng khách',
    stage: 3,
    lifePercent: 72,
    lifespanDays: 365,
    installedDate: '2024-03-15',
    lastReplacedDate: '2025-03-15'
  },
  {
    id: '4',
    name: 'Lõi PP 1 micron',
    type: 'sediment',
    purifierId: '2',
    purifierName: 'Máy lọc bếp',
    stage: 1,
    lifePercent: 12,
    lifespanDays: 180,
    installedDate: '2023-11-02',
    lastReplacedDate: '2025-05-02'
  },
  {
    id: '5',
    name: 'Lõi than block',
    type: 'carbon',
    purifierId: '2',
    purifierName: 'Máy lọc bếp',
    stage: 2,
    lifePercent: 15,
    lifespanDays: 180,
    installedDate: '2023-11-02',
    lastReplacedDate: '2025-05-02'
  },
  {
    id: '6',
    name: 'Màng RO 50GPD',
    type: 'ro_membrane',
    purifierId: '2',
    purifierName: 'Máy lọc bếp',
    stage: 3,
    lifePercent: 18,
    lifespanDays: 365,
    installedDate: '2023-11-02',
    lastReplacedDate: '2024-11-02'
  },
  {
    id: '7',
    name: 'Lõi PP 5 micron',
    type: 'sediment',
    purifierId: '3',
    purifierName: 'Máy lọc phòng ngủ',
    stage: 1,
    lifePercent: 45,
    lifespanDays: 180,
    installedDate: '2024-08-20',
    lastReplacedDate: '2025-10-20'
  },
  {
    id: '8',
    name: 'Lõi than GAC',
    type: 'carbon',
    purifierId: '3',
    purifierName: 'Máy lọc phòng ngủ',
    stage: 2,
    lifePercent: 38,
    lifespanDays: 180,
    installedDate: '2024-08-20',
    lastReplacedDate: '2025-10-20'
  },
  {
    id: '9',
    name: 'Lõi khoáng',
    type: 'mineral',
    purifierId: '3',
    purifierName: 'Máy lọc phòng ngủ',
    stage: 4,
    lifePercent: 52,
    lifespanDays: 365,
    installedDate: '2024-08-20',
    lastReplacedDate: '2025-02-20'
  },
  {
    id: '10',
    name: 'Lõi PP 5 micron',
    type: 'sediment',
    purifierId: '4',
    purifierName: 'Máy lọc văn phòng',
    stage: 1,
    lifePercent: 5,
    lifespanDays: 180,
    installedDate: '2022-05-10',
    lastReplacedDate: '2025-01-10'
  },
  {
    id: '11',
    name: 'Lõi than sau',
    type: 'post_carbon',
    purifierId: '4',
    purifierName: 'Máy lọc văn phòng',
    stage: 5,
    lifePercent: 8,
    lifespanDays: 365,
    installedDate: '2022-05-10',
    lastReplacedDate: '2025-01-10'
  },
  {
    id: '12',
    name: 'Lõi PP 5 micron',
    type: 'sediment',
    purifierId: '5',
    purifierName: 'Máy lọc sảnh',
    stage: 1,
    lifePercent: 8,
    lifespanDays: 180,
    installedDate: '2025-01-08',
    lastReplacedDate: '2025-07-08'
  },
  {
    id: '13',
    name: 'Lõi than GAC',
    type: 'carbon',
    purifierId: '5',
    purifierName: 'Máy lọc sảnh',
    stage: 2,
    lifePercent: 10,
    lifespanDays: 180,
    installedDate: '2025-01-08',
    lastReplacedDate: '2025-07-08'
  },
  {
    id: '14',
    name: 'Màng RO 75GPD',
    type: 'ro_membrane',
    purifierId: '5',
    purifierName: 'Máy lọc sảnh',
    stage: 3,
    lifePercent: 6,
    lifespanDays: 365,
    installedDate: '2025-01-08',
    lastReplacedDate: '2025-01-08'
  },
  {
    id: '15',
    name: 'Lõi khoáng',
    type: 'mineral',
    purifierId: '5',
    purifierName: 'Máy lọc sảnh',
    stage: 4,
    lifePercent: 22,
    lifespanDays: 365,
    installedDate: '2025-01-08',
    lastReplacedDate: '2025-01-08'
  }
]

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function resolvePurifierName(purifierId: string): string {
  return purifierNames[purifierId] ?? `Máy lọc #${purifierId}`
}

export async function listMockFilters(): Promise<Filter[]> {
  await delay()
  return store.map((item) => ({ ...item }))
}

export async function getMockFilter(id: string): Promise<Filter | null> {
  await delay()
  const item = store.find((f) => f.id === id)
  return item ? { ...item } : null
}

export async function createMockFilter(input: FilterCreateInput): Promise<Filter> {
  await delay()
  const filter: Filter = {
    id: String(nextId++),
    name: input.name,
    type: input.type,
    purifierId: input.purifierId,
    purifierName: resolvePurifierName(input.purifierId),
    stage: input.stage,
    lifePercent: input.lifePercent,
    lifespanDays: input.lifespanDays,
    installedDate: input.installedDate,
    lastReplacedDate: input.lastReplacedDate,
    notes: input.notes
  }
  store.unshift(filter)
  return { ...filter }
}

export async function updateMockFilter(id: string, input: FilterUpdateInput): Promise<Filter> {
  await delay()
  const index = store.findIndex((f) => f.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy lõi lọc.')
  }
  const current = store[index]
  if (!current) {
    throw new Error('Không tìm thấy lõi lọc.')
  }
  const purifierId = input.purifierId ?? current.purifierId
  const updated: Filter = {
    id: current.id,
    name: input.name ?? current.name,
    type: input.type ?? current.type,
    purifierId,
    purifierName: resolvePurifierName(purifierId),
    stage: input.stage ?? current.stage,
    lifePercent: input.lifePercent ?? current.lifePercent,
    lifespanDays: input.lifespanDays ?? current.lifespanDays,
    installedDate: input.installedDate ?? current.installedDate,
    lastReplacedDate: input.lastReplacedDate ?? current.lastReplacedDate,
    notes: input.notes ?? current.notes
  }
  store[index] = updated
  return { ...updated }
}

export async function deleteMockFilter(id: string): Promise<void> {
  await delay()
  const index = store.findIndex((f) => f.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy lõi lọc.')
  }
  store.splice(index, 1)
}

export async function replaceMockFilter(id: string): Promise<Filter> {
  await delay()
  const index = store.findIndex((f) => f.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy lõi lọc.')
  }
  const current = store[index]
  if (!current) {
    throw new Error('Không tìm thấy lõi lọc.')
  }
  const today = new Date().toISOString().slice(0, 10)
  const updated: Filter = {
    ...current,
    lifePercent: 100,
    lastReplacedDate: today
  }
  store[index] = updated
  return { ...updated }
}
