import httpLib from '@/libs/httpLib';
import { defineStore } from 'pinia';

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    userId: "",
    feched: false,
    loggedIn: false
  }),
  actions: {
    async fetchInfo() {
      const res = await httpLib.get("/v1/api/auth/info");
      const userId = res.data;

      this.feched = true;
      this.loggedIn = !!userId;

      if (this.loggedIn) {
        this.userId = userId;
      }
    },
    setLoggedIn(value: boolean) {
      this.loggedIn = value;
    },
  }
});