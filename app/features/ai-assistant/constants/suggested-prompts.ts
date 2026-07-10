export interface SuggestedPrompt {
  id: string
  label: string
  prompt: string
}

export const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: 'filters-due',
    label: 'Lõi lọc cần thay',
    prompt: 'Lõi lọc nào đang cần thay gấp?'
  },
  {
    id: 'device-status',
    label: 'Trạng thái máy lọc',
    prompt: 'Tóm tắt trạng thái các máy lọc nước hiện tại.'
  },
  {
    id: 'maintenance-tips',
    label: 'Hướng dẫn bảo trì',
    prompt: 'Hướng dẫn bảo trì máy lọc nước RO định kỳ.'
  },
  {
    id: 'replacement-schedule',
    label: 'Lịch thay lõi',
    prompt: 'Lịch thay lõi lọc nên thực hiện bao lâu một lần?'
  }
]
