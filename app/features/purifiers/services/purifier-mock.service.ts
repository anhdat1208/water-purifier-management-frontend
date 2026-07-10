import type { Purifier, PurifierCreateInput, PurifierUpdateInput } from '~/features/purifiers/types/purifier'

let nextId = 13

const store: Purifier[] = [
  {
    id: '1',
    name: 'Máy lọc phòng khách',
    model: 'RO-500',
    location: 'Phòng khách',
    installDate: '2024-03-15',
    status: 'active',
    filterLifePercent: 72
  },
  {
    id: '2',
    name: 'Máy lọc bếp',
    model: 'UF-300',
    location: 'Nhà bếp',
    installDate: '2023-11-02',
    status: 'maintenance',
    filterLifePercent: 15
  },
  {
    id: '3',
    name: 'Máy lọc phòng ngủ',
    model: 'RO-400',
    location: 'Tầng 2',
    installDate: '2024-08-20',
    status: 'active',
    filterLifePercent: 45
  },
  {
    id: '4',
    name: 'Máy lọc văn phòng',
    model: 'RO-600',
    location: 'Tầng 1',
    installDate: '2022-05-10',
    status: 'inactive',
    filterLifePercent: 5
  },
  {
    id: '5',
    name: 'Máy lọc sảnh',
    model: 'UF-250',
    location: 'Tầng trệt',
    installDate: '2025-01-08',
    status: 'maintenance',
    filterLifePercent: 8
  }
]

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function listMockPurifiers(): Promise<Purifier[]> {
  await delay()
  return store.map((item) => ({ ...item }))
}

export async function getMockPurifier(id: string): Promise<Purifier | null> {
  await delay()
  const item = store.find((p) => p.id === id)
  return item ? { ...item } : null
}

export async function createMockPurifier(input: PurifierCreateInput): Promise<Purifier> {
  await delay()
  const purifier: Purifier = {
    id: String(nextId++),
    ...input
  }
  store.unshift(purifier)
  return { ...purifier }
}

export async function updateMockPurifier(id: string, input: PurifierUpdateInput): Promise<Purifier> {
  await delay()
  const index = store.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy máy lọc.')
  }
  const current = store[index]
  if (!current) {
    throw new Error('Không tìm thấy máy lọc.')
  }
  const updated: Purifier = {
    id: current.id,
    name: input.name ?? current.name,
    model: input.model ?? current.model,
    location: input.location ?? current.location,
    installDate: input.installDate ?? current.installDate,
    status: input.status ?? current.status,
    filterLifePercent: input.filterLifePercent ?? current.filterLifePercent
  }
  store[index] = updated
  return { ...updated }
}

export async function deleteMockPurifier(id: string): Promise<void> {
  await delay()
  const index = store.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy máy lọc.')
  }
  store.splice(index, 1)
}
