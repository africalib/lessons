<script setup lang="ts">
import { useAccountStore } from "@/stores/account";

const accountStore = useAccountStore();
</script>

<template>
    <header class="">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4">
                <span class="fs-4">Quiz</span>
                <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    <template v-if="accountStore.loggedIn">
                        <a>로그아웃</a>
                    </template>
                    <template v-else>
                        <router-link to="join" class="me-3 py-2 text-dark text-decoration-none">회원가입</router-link>
                        <router-link to="/login" class="py-2 text-dark text-decoration-none">로그인</router-link>
                    </template>
                </nav>
            </div>
        </div>
    </header>
</template>