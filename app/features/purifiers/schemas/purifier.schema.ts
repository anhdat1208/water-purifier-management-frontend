import { z } from 'zod'
import type { PurifierCreateInput } from '~/features/purifiers/types/purifier'

export const purifierFormSchema = z.object({
  name: z
    .string({ required_error: 'Vui lòng nhập tên máy lọc.' })
    .min(1, 'Vui lòng nhập tên máy lọc.')
    .max(100, 'Tên máy lọc tối đa 100 ký tự.'),
  model: z
    .string({ required_error: 'Vui lòng nhập model.' })
    .min(1, 'Vui lòng nhập model.')
    .max(50, 'Model tối đa 50 ký tự.')
})

export type PurifierFormValues = z.infer<typeof purifierFormSchema>

/** Gắn giá trị mặc định cho các field ẩn trên form khi tạo mới. */
export function toPurifierCreateInput(values: PurifierFormValues): PurifierCreateInput {
  return {
    name: values.name,
    model: values.model,
    location: '—',
    installDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    filterLifePercent: 100
  }
}
