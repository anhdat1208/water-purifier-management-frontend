export type PurifierStatus = 'active' | 'maintenance' | 'inactive'

export interface Purifier {
  id: string
  name: string
  model: string
  location: string
  installDate: string
  status: PurifierStatus
  filterLifePercent: number
}

export interface PurifierCreateInput {
  name: string
  model: string
  location: string
  installDate: string
  status: PurifierStatus
  filterLifePercent: number
}

export type PurifierUpdateInput = Partial<PurifierCreateInput>

export interface PurifierApi {
  id: number | string
  name: string
  model: string
  location: string
  install_date?: string
  installDate?: string
  status: PurifierStatus
  filter_life_percent?: number
  filterLifePercent?: number
}
