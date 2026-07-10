import { z } from 'zod'

export const purifierFormSchema = z.object({
  name: z
    .string({ required_error: 'Vui lòng nhập tên máy lọc.' })
    .min(1, 'Vui lòng nhập tên máy lọc.')
    .max(100, 'Tên máy lọc tối đa 100 ký tự.'),
  model: z
    .string({ required_error: 'Vui lòng nhập model.' })
    .min(1, 'Vui lòng nhập model.')
    .max(50, 'Model tối đa 50 ký tự.'),
  location: z
    .string({ required_error: 'Vui lòng nhập vị trí.' })
    .min(1, 'Vui lòng nhập vị trí.')
    .max(200, 'Vị trí tối đa 200 ký tự.'),
  installDate: z.string({ required_error: 'Vui lòng chọn ngày lắp đặt.' }).min(1, 'Vui lòng chọn ngày lắp đặt.'),
  status: z.enum(['active', 'maintenance', 'inactive'], {
    required_error: 'Vui lòng chọn trạng thái.'
  }),
  filterLifePercent: z.coerce
    .number({ required_error: 'Vui lòng nhập % tuổi thọ lõi.' })
    .min(0, 'Giá trị tối thiểu là 0.')
    .max(100, 'Giá trị tối đa là 100.')
})

export type PurifierFormValues = z.infer<typeof purifierFormSchema>
