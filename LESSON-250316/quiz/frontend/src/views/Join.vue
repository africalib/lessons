<script lang="ts" setup>
import { reactive } from "vue";
import commonLib from "@/libs/commonLib";
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

const router = useRouter();

const submit = async () => {
    commonLib.log(state.form);
    // await res = httpLib.post("/v1/account/join", state.form);

    // if (res.statusCode === 200) {
    //     window.alert("회원가입을 완료했습니다.");
    //     router.push("/");
    // }
};
</script>

<template>
    <div class="join">
        <div class="container">
            <form @submit.prevent="submit">
                <h1 class="h6 mb-3 fw-bold">회원가입</h1>
                <div class="form-floating">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
                        v-model="state.form.loginId">
                    <label for="floatingInput">이메일 주소</label>
                </div>
                <div class="form-floating mt-2">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                        v-model="state.form.loginPw">
                    <label for="floatingPassword">패스워드</label>
                </div>
                <button class="w-100 btn btn-lg btn-primary mt-3" type="submit">회원가입</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.join {
    .btn {
        font-size: var(--px14);
        padding: var(--px15);
    }
}
</style>