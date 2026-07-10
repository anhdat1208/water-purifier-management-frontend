import type { DashboardOverview } from '~/features/dashboard/types/dashboard'

export function getDashboardMockOverview(): DashboardOverview {
  return {
    stats: {
      totalDevices: 12,
      activeDevices: 9,
      maintenanceDevices: 2,
      filtersDueSoon: 3
    },
    filterLifeTrend: [
      { label: 'T2', value: 82 },
      { label: 'T3', value: 78 },
      { label: 'T4', value: 74 },
      { label: 'T5', value: 70 },
      { label: 'T6', value: 66 },
      { label: 'T7', value: 62 },
      { label: 'CN', value: 58 }
    ],
    statusDistribution: {
      active: 9,
      maintenance: 2,
      inactive: 1
    },
    devicesNeedingAttention: [
      {
        id: '2',
        name: 'Máy lọc bếp',
        location: 'Nhà bếp',
        filterLifePercent: 15,
        status: 'maintenance',
        reason: 'Mức lõi lọc dưới 20%'
      },
      {
        id: '5',
        name: 'Máy lọc phòng ngủ',
        location: 'Tầng 2',
        filterLifePercent: 22,
        status: 'active',
        reason: 'Sắp đến hạn thay lõi'
      },
      {
        id: '8',
        name: 'Máy lọc sảnh',
        location: 'Tầng trệt',
        filterLifePercent: 8,
        status: 'maintenance',
        reason: 'Cần bảo trì gấp'
      }
    ],
    recentActivities: [
      {
        id: '1',
        title: 'Nhắc thay lõi lọc',
        description: 'Máy lọc bếp còn 15% tuổi thọ lõi.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'filter'
      },
      {
        id: '2',
        title: 'Bảo trì định kỳ',
        description: 'Máy lọc phòng khách đã hoàn tất kiểm tra.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        type: 'maintenance'
      },
      {
        id: '3',
        title: 'Cảnh báo chất lượng nước',
        description: 'Máy lọc sảnh có chỉ số TDS tăng nhẹ.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'alert'
      }
    ]
  }
}
