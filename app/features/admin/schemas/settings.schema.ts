import { z } from 'zod'

export const systemSettingsSchema = z
  .object({
    siteName: z
      .string({ required_error: 'Vui lòng nhập tên hệ thống.' })
      .min(1, 'Vui lòng nhập tên hệ thống.')
      .max(100, 'Tên hệ thống tối đa 100 ký tự.'),
    maintenanceMode: z.boolean(),
    filterWarningThreshold: z.coerce
      .number({ required_error: 'Vui lòng nhập ngưỡng cảnh báo.' })
      .min(1, 'Giá trị tối thiểu là 1.')
      .max(99, 'Giá trị tối đa là 99.'),
    filterCriticalThreshold: z.coerce
      .number({ required_error: 'Vui lòng nhập ngưỡng nguy hiểm.' })
      .min(1, 'Giá trị tối thiểu là 1.')
      .max(99, 'Giá trị tối đa là 99.'),
    notificationEmail: z
      .string({ required_error: 'Vui lòng nhập email thông báo.' })
      .email('Email không hợp lệ.'),
    autoNotifyFilterDue: z.boolean()
  })
  .refine((data) => data.filterCriticalThreshold < data.filterWarningThreshold, {
    message: 'Ngưỡng nguy hiểm phải nhỏ hơn ngưỡng cảnh báo.',
    path: ['filterCriticalThreshold']
  })

export type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>
