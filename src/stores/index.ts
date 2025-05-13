import { defineStore } from 'pinia';
import type { UserInfo } from '@/api/entity';

export const useStore = defineStore('main', {
  state: () => ({
    currentUser: null as UserInfo | null,
    token: null as string | null,
    remberme: false,
  }),
  actions: {
    setCurrentUser(user: UserInfo) {
      this.currentUser = user;
    },

    setToken(token: string) {
      this.token = token;
    },

    getToken(){
      return this.token;
    },

    clear() {
      this.currentUser = null;
      this.token = null;
      this.remberme = false;
    },
  },
  persist: {
    storage: localStorage,
  },
});