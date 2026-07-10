import { listMockFilters } from '~/features/filters/services/filter-mock.service'
import { listMockPurifiers } from '~/features/purifiers/services/purifier-mock.service'
import type {
  AssistantConversation,
  AssistantMessage,
  SendMessageInput,
  SendMessageResult
} from '~/features/ai-assistant/types/assistant'
import { getFilterLifeStatus } from '~/features/filters/constants/filter-labels'

let messageId = 100
let conversationId = 'conv-demo-1'

const conversations = new Map<string, AssistantConversation>()

function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createMessage(role: AssistantMessage['role'], content: string): AssistantMessage {
  return {
    id: String(messageId++),
    role,
    content,
    createdAt: new Date().toISOString()
  }
}

function getOrCreateConversation(id?: string): AssistantConversation {
  const convId = id ?? conversationId
  const existing = conversations.get(convId)
  if (existing) return existing

  const welcome: AssistantConversation = {
    id: convId,
    messages: [
      createMessage(
        'assistant',
        'Xin chào! Tôi là trợ lý AI của hệ thống quản lý máy lọc nước. Tôi có thể giúp bạn:\n\n• Kiểm tra lõi lọc cần thay\n• Tóm tắt trạng thái thiết bị\n• Hướng dẫn bảo trì và thay lõi\n\nBạn muốn hỏi gì?'
      )
    ],
    updatedAt: new Date().toISOString()
  }
  conversations.set(convId, welcome)
  return welcome
}

async function buildMockReply(userText: string): Promise<string> {
  const text = userText.toLowerCase()
  const [purifiers, filters] = await Promise.all([listMockPurifiers(), listMockFilters()])

  const criticalFilters = filters.filter((f) => getFilterLifeStatus(f.lifePercent) === 'critical')
  const warningFilters = filters.filter((f) => getFilterLifeStatus(f.lifePercent) === 'warning')
  const maintenanceDevices = purifiers.filter((p) => p.status === 'maintenance')

  if (text.includes('cần thay') || text.includes('thay gấp') || text.includes('sắp thay')) {
    if (criticalFilters.length === 0) {
      return 'Hiện không có lõi lọc nào ở mức cần thay gấp (< 20%). Bạn có thể theo dõi chi tiết tại mục Lõi lọc.'
    }
    const lines = criticalFilters.map(
      (f) => `• ${f.name} (${f.purifierName}) — còn ${f.lifePercent}%`
    )
    return `Có ${criticalFilters.length} lõi lọc cần thay gấp:\n\n${lines.join('\n')}\n\nNên lên lịch thay trong tuần này để đảm bảo chất lượng nước.`
  }

  if (text.includes('trạng thái') || text.includes('máy lọc') || text.includes('thiết bị')) {
    const active = purifiers.filter((p) => p.status === 'active').length
    const lines = purifiers.map((p) => {
      const statusLabel =
        p.status === 'active' ? 'Hoạt động' : p.status === 'maintenance' ? 'Bảo trì' : 'Ngưng'
      return `• ${p.name} (${p.location}) — ${statusLabel}, lõi còn ${p.filterLifePercent}%`
    })
    return `Hệ thống có ${purifiers.length} máy lọc:\n\n${lines.join('\n')}\n\nTổng quan: ${active} đang hoạt động, ${maintenanceDevices.length} cần bảo trì.`
  }

  if (text.includes('bảo trì')) {
    return `Hướng dẫn bảo trì máy lọc RO định kỳ:\n\n1. Kiểm tra áp suất nước đầu vào mỗi tháng\n2. Vệ sinh vỏ máy và khu vực lắp đặt\n3. Thay lõi PP và than hoạt tính mỗi 6 tháng\n4. Thay màng RO mỗi 12–24 tháng tùy chất lượng nước\n5. Xả nước bồn chứa nếu không dùng quá 3 ngày\n\nHiện có ${maintenanceDevices.length} máy đang ở trạng thái bảo trì.`
  }

  if (text.includes('lịch') || text.includes('bao lâu') || text.includes('định kỳ')) {
    return `Lịch thay lõi lọc khuyến nghị:\n\n• Lõi lọc thô (PP): 3–6 tháng\n• Lõi than hoạt tính: 6–9 tháng\n• Màng RO: 12–24 tháng\n• Lõi khoáng / than sau: 12 tháng\n\nTuổi thọ thực tế phụ thuộc chất lượng nước đầu vào và mức sử dụng. Hiện có ${warningFilters.length} lõi đang cần chú ý (20–40%).`
  }

  if (text.includes('lõi lọc') || text.includes('filter')) {
    const lowLife = filters.filter((f) => f.lifePercent <= 40)
    if (lowLife.length === 0) {
      return `Tất cả ${filters.length} lõi lọc đang ở mức tuổi thọ tốt. Tiếp tục theo dõi định kỳ qua mục Lõi lọc.`
    }
    const lines = lowLife.slice(0, 5).map((f) => `• ${f.name} — ${f.lifePercent}% (${f.purifierName})`)
    return `Có ${lowLife.length} lõi lọc đang ở mức thấp:\n\n${lines.join('\n')}\n\nBạn có thể xem chi tiết và ghi nhận thay lõi tại trang Lõi lọc.`
  }

  return `Tôi đã nhận câu hỏi của bạn. Trong chế độ demo, tôi có thể hỗ trợ về:\n\n• Lõi lọc cần thay\n• Trạng thái máy lọc\n• Hướng dẫn bảo trì\n• Lịch thay lõi định kỳ\n\nHãy thử một câu hỏi cụ thể hoặc chọn gợi ý bên dưới.`
}

export async function getMockConversation(id?: string): Promise<AssistantConversation> {
  await delay(200)
  return getOrCreateConversation(id)
}

export async function sendMockMessage(input: SendMessageInput): Promise<SendMessageResult> {
  await delay(900 + Math.random() * 600)
  const conversation = getOrCreateConversation(input.conversationId)
  const userMessage = createMessage('user', input.message.trim())
  const reply = await buildMockReply(input.message)
  const assistantMessage = createMessage('assistant', reply)

  conversation.messages.push(userMessage, assistantMessage)
  conversation.updatedAt = new Date().toISOString()

  return {
    userMessage,
    assistantMessage,
    conversationId: conversation.id
  }
}

export async function clearMockConversation(id?: string): Promise<AssistantConversation> {
  await delay(200)
  const convId = id ?? conversationId
  conversations.delete(convId)
  return getOrCreateConversation(convId)
}
