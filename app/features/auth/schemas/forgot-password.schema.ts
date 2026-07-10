import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Vui long nhap email.' })
    .min(1, 'Vui long nhap email.')
    .email('Email khong hop le.')
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
