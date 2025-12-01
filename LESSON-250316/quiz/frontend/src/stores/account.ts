import httpLib from "@/libs/httpLib";
import { defineStore } from "pinia";

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    userId: "",
    role: "",
    feched: false,
    loggedIn: false,
  }),
  actions: {
    async fetchInfo() {
      const res = await httpLib.get("/v1/api/auth/info");
      const userInfo = res.data;

      this.feched = true;
      
      if (userInfo && typeof userInfo === 'object') {
        this.loggedIn = !!userInfo.userId;
        this.userId = userInfo.userId || "";
        this.role = userInfo.role || "";
      } else if (userInfo) {
        // 後方互換性: userIdのみが返される場合
        this.loggedIn = !!userInfo;
        this.userId = userInfo || "";
        this.role = "";
      } else {
        this.loggedIn = false;
        this.userId = "";
        this.role = "";
      }
    },
    setLoggedIn(value: boolean) {
      this.loggedIn = value;
    },
  },
});
