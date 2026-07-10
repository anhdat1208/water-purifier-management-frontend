import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Vui long nhap ho ten.' })
      .min(2, 'Ho ten phai co it nhat 2 ky tu.'),
    email: z
      .string({ required_error: 'Vui long nhap email.' })
      .min(1, 'Vui long nhap email.')
      .email('Email khong hop le.'),
    password: z
      .string({ required_error: 'Vui long nhap mat khau.' })
      .min(8, 'Mat khau phai co it nhat 8 ky tu.'),
    confirmPassword: z.string({ required_error: 'Vui long xac nhan mat khau.' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mat khau xac nhan khong khop.',
    path: ['confirmPassword']
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
