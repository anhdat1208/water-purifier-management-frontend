import { defineStore } from 'pinia'

type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: Theme
  locale: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    locale: 'vi-VN'
  }),
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
    },
    setLocale(locale: string) {
      this.locale = locale
    }
  }
})
