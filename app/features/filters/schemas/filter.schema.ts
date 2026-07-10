import { z } from 'zod'

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
  lifePercent: z.coerce
    .number({ required_error: 'Vui lòng nhập % tuổi thọ.' })
    .min(0, 'Giá trị tối thiểu là 0.')
    .max(100, 'Giá trị tối đa là 100.'),
  lifespanDays: z.coerce
    .number({ required_error: 'Vui lòng nhập tuổi thọ (ngày).' })
    .min(30, 'Tuổi thọ tối thiểu 30 ngày.')
    .max(730, 'Tuổi thọ tối đa 730 ngày.'),
  installedDate: z
    .string({ required_error: 'Vui lòng chọn ngày lắp đặt.' })
    .min(1, 'Vui lòng chọn ngày lắp đặt.'),
  lastReplacedDate: z
    .string({ required_error: 'Vui lòng chọn ngày thay gần nhất.' })
    .min(1, 'Vui lòng chọn ngày thay gần nhất.'),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự.').optional()
})

export type FilterFormValues = z.infer<typeof filterFormSchema>
