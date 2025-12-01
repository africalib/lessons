<script lang="ts" setup>
import { reactive } from "vue";
import commonLib from "@/libs/commonLib";
import cookieLib from "@/libs/cookieLib";
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";

interface State {
  form: {
    loginId: string;
    loginPw: string;
  };
}

const state = reactive<State>({
  form: {
    loginId: "",
    loginPw: "",
  },
});

const accountStore = useAccountStore();

const router = useRouter();

const submit = async () => {
  try {
    const res = await httpLib.post("/v1/api/auth/login", state.form);

    if (res.status === 200 && res.data.token) {
      // ✅ 토큰 저장
      const token = res.data.token;

      // 개발 환경에서는 secure: false
      const isSecure = location.protocol === "https:";
      cookieLib.set("token", token, 7, isSecure);

      // ✅ 상태 반영
      await accountStore.fetchInfo();
      router.push("/");
    } else {
      const message = res.data?.message || "ログインに失敗しました。";
      window.alert(message);
    }
  } catch (err: any) {
    console.error("ログインエラー:", err);
    const message = err?.response?.data?.message || "ログインに失敗しました。";
    window.alert(message);
  }
};
</script>

<template>
  <div class="login">
    <div class="container">
      <form @submit.prevent="submit">
        <h1 class="h6 mb-3 fw-bold">ログイン</h1>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="loginId"
            placeholder="name@example.com"
            v-model="state.form.loginId"
          />
          <label for="loginId">メールアドレス</label>
        </div>
        <div class="form-floating mt-2">
          <input
            type="password"
            class="form-control"
            id="loginPw"
            placeholder="Password"
            v-model="state.form.loginPw"
          />
          <label for="loginPw">パスワード</label>
        </div>
        <button class="w-100 btn btn-lg btn-primary mt-3" type="submit">
          ログイン
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  .btn {
    font-size: var(--px14);
    padding: var(--px15);
  }
}
</style>
