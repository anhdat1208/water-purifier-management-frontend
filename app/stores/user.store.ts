import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

interface UserState {
  currentUser: UserProfile | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null
  }),
  actions: {
    setCurrentUser(user: UserProfile | null) {
      this.currentUser = user
    }
  }
})
