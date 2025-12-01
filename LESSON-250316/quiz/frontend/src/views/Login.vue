<script lang="ts" setup>
import { reactive } from "vue";
import commonLib from "@/libs/commonLib";
import cookieLib from "@/libs/cookieLib";
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";
import { useRouter } from 'vue-router';

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
    }
});

const accountStore = useAccountStore();

const router = useRouter();

const submit = async () => {
    const res = await httpLib.post("/v1/api/auth/login", state.form);

    if (res.status === 200) {
        window.alert(res.data.message);
        accountStore.fetchInfo();
        router.push("/");
    }
};
</script>

<template>
    <div class="login">
        <div class="container">
            <form @submit.prevent="submit">
                <h1 class="h6 mb-3 fw-bold">로그인</h1>
                <div class="form-floating">
                    <input type="email" class="form-control" id="loginId" placeholder="name@example.com"
                        v-model="state.form.loginId">
                    <label for="loginId">이메일 주소</label>
                </div>
                <div class="form-floating mt-2">
                    <input type="password" class="form-control" id="loginPw" placeholder="Password"
                        v-model="state.form.loginPw">
                    <label for="loginPw">패스워드</label>
                </div>
                <button class="w-100 btn btn-lg btn-primary mt-3" type="submit">로그인</button>
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