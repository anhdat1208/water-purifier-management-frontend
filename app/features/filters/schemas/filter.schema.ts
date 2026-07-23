import { z } from 'zod'
import type { FilterCreateInput } from '~/features/filters/types/filter'

export const filterFormSchema = z.object({
  name: z
    .string({ required_error: 'Vui lòng nhập tên lõi lọc.' })
    .min(1, 'Vui lòng nhập tên lõi lọc.')
    .max(100, 'Tên lõi lọc tối đa 100 ký tự.'),
  type: z.enum(['sediment', 'carbon', 'ro_membrane', 'mineral', 'post_carbon'], {
    required_error: 'Vui lòng chọn loại lõi lọc.'
  }),
  purifierId: z.string({ required_error: 'Vui lòng chọn máy lọc.' }).min(1, 'Vui lòng chọn máy lọc.'),
  stage: z.coerce
    .number({ required_error: 'Vui lòng nhập cấp lọc.' })
    .min(1, 'Cấp lọc tối thiểu là 1.')
    .max(10, 'Cấp lọc tối đa là 10.'),
  lifespanDays: z.coerce
    .number({ required_error: 'Vui lòng nhập tuổi thọ (ngày).' })
    .min(30, 'Tuổi thọ tối thiểu 30 ngày.')
    .max(730, 'Tuổi thọ tối đa 730 ngày.'),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự.').optional()
})

export type FilterFormValues = z.infer<typeof filterFormSchema>

/** Gắn giá trị mặc định cho các field ẩn trên form khi tạo mới. */
export function toFilterCreateInput(values: FilterFormValues): FilterCreateInput {
  const today = new Date().toISOString().slice(0, 10)
  return {
    name: values.name,
    type: values.type,
    purifierId: values.purifierId,
    stage: values.stage,
    lifespanDays: values.lifespanDays,
    notes: values.notes,
    lifePercent: 100,
    installedDate: today,
    lastReplacedDate: today
  }
}
