<script setup lang="ts">
import cookieLib from "@/libs/cookieLib";
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";
import { reactive } from "vue";
import { useRouter } from "vue-router";

interface Quiz {
    question: string;
    quizId: string;
    options: Array<string>;
}

interface State {
    quiz: Quiz;
    answer: string;
}

const accountStore = useAccountStore();
const router = useRouter();

const state = reactive<State>({
    quiz: {
        question: "",
        quizId: "",
        options: []
    },
    answer: ""
});

const start = async () => {
    if (!accountStore.loggedIn) {
        if (window.confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) {
            router.push("/login");
        }
        return;
    }

    const res = await httpLib.get('/v1/api/question/random');

    state.quiz = res.data;
};

const submit = async () => {
    const res = await httpLib.post(`/quizzes/${state.quiz.quizId}/answer`, {
        content: state.answer
    });

    console.log(res);
};
</script>

<template>
    <div class="home">
        <button type="button" class="btn btn-primary" @click="start">퀴즈 풀기!</button>
        <template v-if=state.quiz.quizId>
            <hr />
            <form @submit.prevent="submit">
                <div class="question">
                    {{ state.quiz.question }}
                </div>
                <ul>
                    <li v-for="(o, idx) in state.quiz.options" :key="idx">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="quizOption" :id="`quizOption${idx}`"
                                :value="idx" v-model="state.selectedIndex">
                            <label class="form-check-label" :for="`quizOption${idx}`">{{ o }}</label>
                        </div>
                    </li>
                </ul>
                <div class="action">
                    <button type="submit" class="btn btn-primary w-100">제출하기</button>
                </div>
            </form>
        </template>
    </div>
</template>

<style scoped>
.home ul {
    list-style: none;
    padding: 0;
    margin: 20px 0 0 0;

    li {}
}
</style>
