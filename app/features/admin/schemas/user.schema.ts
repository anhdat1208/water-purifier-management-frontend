import { z } from 'zod'

export const adminUserFormSchema = z.object({
  email: z
    .string({ required_error: 'Vui lòng nhập email.' })
    .email('Email không hợp lệ.'),
  fullName: z
    .string({ required_error: 'Vui lòng nhập họ tên.' })
    .min(1, 'Vui lòng nhập họ tên.')
    .max(100, 'Họ tên tối đa 100 ký tự.'),
  role: z.enum(['admin', 'user'], { required_error: 'Vui lòng chọn vai trò.' }),
  status: z.enum(['active', 'inactive'], { required_error: 'Vui lòng chọn trạng thái.' }),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự.')
    .max(100, 'Mật khẩu tối đa 100 ký tự.')
    .optional()
    .or(z.literal(''))
})

export const adminUserCreateSchema = adminUserFormSchema.extend({
  password: z
    .string({ required_error: 'Vui lòng nhập mật khẩu.' })
    .min(6, 'Mật khẩu tối thiểu 6 ký tự.')
    .max(100, 'Mật khẩu tối đa 100 ký tự.')
})

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>
export type AdminUserCreateFormValues = z.infer<typeof adminUserCreateSchema>
