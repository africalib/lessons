import { defineStore } from 'pinia';

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    loggedIn: false
  }),
  actions: {
    setLoggedIn(value: boolean) {
      this.loggedIn = value;
    },
  }
});