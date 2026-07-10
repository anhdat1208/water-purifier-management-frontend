export type FilterType = 'sediment' | 'carbon' | 'ro_membrane' | 'mineral' | 'post_carbon'

export type FilterLifeStatus = 'good' | 'warning' | 'critical'

export interface Filter {
  id: string
  name: string
  type: FilterType
  purifierId: string
  purifierName: string
  stage: number
  lifePercent: number
  lifespanDays: number
  installedDate: string
  lastReplacedDate: string
  notes?: string
}

export interface FilterCreateInput {
  name: string
  type: FilterType
  purifierId: string
  stage: number
  lifePercent: number
  lifespanDays: number
  installedDate: string
  lastReplacedDate: string
  notes?: string
}

export type FilterUpdateInput = Partial<FilterCreateInput>

export interface FilterApi {
  id: number | string
  name: string
  type: FilterType
  purifier_id?: string
  purifierId?: string
  purifier_name?: string
  purifierName?: string
  stage: number
  life_percent?: number
  lifePercent?: number
  lifespan_days?: number
  lifespanDays?: number
  installed_date?: string
  installedDate?: string
  last_replaced_date?: string
  lastReplacedDate?: string
  notes?: string
}

export interface PurifierOption {
  id: string
  name: string
}
