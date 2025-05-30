<script setup lang="ts">
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";

const accountStore = useAccountStore();

const logout = async () => {
    const res = await httpLib.post("/v1/api/auth/logout");

    if (res.status === 200) {
        window.location.reload();
    }
};
</script>

<template>
    <header class="">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-2">
                <router-link to="/" class="logo fs-4">Quiz</router-link>
                <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    <template v-if="accountStore.loggedIn">
                        <a @click="logout">로그아웃</a>
                    </template>
                    <template v-else>
                        <router-link to="join" class="me-3 py-2 text-dark text-decoration-none">회원가입</router-link>
                        <router-link to="/login" class="py-2 text-dark text-decoration-none">로그인</router-link>
                    </template>
                </nav>
            </div>
            <div class="nav">
                <router-link class="btn btn-primary" to="/quizzes">
                    퀴즈 풀기!
                </router-link>
                <router-link class="btn btn-secondary" to="/my-answers">
                    내가 풀이한 문제
                </router-link>
            </div>
            <hr />
        </div>
    </header>
</template>

<style scoped>
header {
    padding-top: var(--px20);

    .container {
        a {
            text-decoration: none;
            color: inherit;
        }

        .logo {
            font-weight: bold;
        }

        .nav {
            display: flex;
            justify-content: space-between;
            color: #fff;
        }

        hr {
            margin: var(--px30) 0;
        }
    }
}
</style>