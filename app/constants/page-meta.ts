export interface PageMetaEntry {
  title: string
  description: string
}

const pageMetaMap: Record<string, PageMetaEntry> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Tổng quan tình trạng máy lọc và lõi lọc trong hệ thống.'
  },
  '/purifiers': {
    title: 'Máy lọc nước',
    description: 'Quản lý danh sách thiết bị, trạng thái và tuổi thọ lõi lọc.'
  },
  '/filters': {
    title: 'Lõi lọc',
    description: 'Quản lý lõi lọc theo từng máy, theo dõi tuổi thọ và lịch thay thế.'
  },
  '/ai-assistant': {
    title: 'Trợ lý AI',
    description: 'Hỏi đáp về máy lọc, lõi lọc và bảo trì thiết bị.'
  },
  '/admin': {
    title: 'Quản trị',
    description: 'Tổng quan người dùng, thiết bị và trạng thái hệ thống.'
  },
  '/admin/users': {
    title: 'Quản lý người dùng',
    description: 'Thêm, sửa và quản lý tài khoản trong hệ thống.'
  },
  '/admin/settings': {
    title: 'Cài đặt hệ thống',
    description: 'Cấu hình thông báo, ngưỡng cảnh báo và chế độ bảo trì.'
  },
  '/login': {
    title: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống quản lý máy lọc nước.'
  },
  '/register': {
    title: 'Đăng ký',
    description: 'Tạo tài khoản mới trong hệ thống.'
  },
  '/forgot-password': {
    title: 'Quên mật khẩu',
    description: 'Khôi phục mật khẩu tài khoản.'
  }
}

export function resolvePageMeta(path: string): PageMetaEntry | null {
  if (pageMetaMap[path]) return pageMetaMap[path]!

  if (path.startsWith('/purifiers/')) {
    return { title: 'Chi tiết máy lọc', description: 'Thông tin vận hành và trạng thái thiết bị.' }
  }
  if (path.startsWith('/filters/')) {
    return { title: 'Chi tiết lõi lọc', description: 'Thông tin tuổi thọ và lịch thay thế lõi lọc.' }
  }
  if (path.startsWith('/admin')) {
    return pageMetaMap['/admin']!
  }

  return null
}

export const APP_NAME = 'Water Purifier Management'
