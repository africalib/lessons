<script setup lang="ts">
import cookieLib from "@/libs/cookieLib";
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

interface Quiz {
    question: string;
    quizId: string;
    options: Array<string>;
}

interface State {
    quiz: Quiz;
    selectedIndex: number;
}

const accountStore = useAccountStore();
const router = useRouter();

const state = reactive<State>({
    quiz: {
        question: "",
        quizId: "",
        options: [],
    },
    selectedIndex: 0,
});

const resultMessage = ref("");
const showNextButton = ref(false);

const startQuiz = async () => {
    resultMessage.value = "";
    showNextButton.value = false;
    state.selectedIndex = 0;

    if (!accountStore.loggedIn) {
        if (window.confirm("로그인이 필요한 기능입니다. 로그인하시겠습니까?")) {
            router.push("/login");
        }
        return;
    }

    const res = await httpLib.get("/v1/api/question/random");
    state.quiz = res.data;
};

const submit = async () => {
    const selectedIndexNumber = Number(state.selectedIndex);

    const res = await httpLib.post(
        `/v1/api/quizzes/${state.quiz.quizId}/answer`,
        {
            selectedIndex: selectedIndexNumber,
            options: state.quiz.options,
        }
    );

    if (res?.data) {
        const isCorrect = res.data.isCorrect;

        resultMessage.value = isCorrect
            ? "✅ 정답입니다!"
            : `❌ 오답입니다. 정답은 "${res.data.answer}"`;

        if (isCorrect) {
            setTimeout(() => {
                startQuiz();
            }, 3000);
        } else {
            showNextButton.value = true;
        }
    } else {
        resultMessage.value = "서버와의 통신에 실패했습니다.";
    }
};
</script>

<template>
    <div class="home">
        <button type="button" class="btn btn-primary" @click="startQuiz">
            퀴즈 풀기!
        </button>

        <template v-if="state.quiz.quizId">
            <hr />
            <form @submit.prevent="submit">
                <div class="question">
                    {{ state.quiz.question }}
                </div>
                <ul>
                    <li v-for="(o, idx) in state.quiz.options" :key="idx">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="quizOption"
                                :id="`quizOption${idx}`"
                                :value="idx"
                                v-model="state.selectedIndex"
                            />
                            <label
                                class="form-check-label"
                                :for="`quizOption${idx}`"
                            >
                                {{ o }}
                            </label>
                        </div>
                    </li>
                </ul>

                <div class="action mt-3">
                    <button type="submit" class="btn btn-primary w-100">
                        제출하기
                    </button>
                </div>

                <p class="mt-3" v-if="resultMessage">
                    {{ resultMessage }}
                </p>

                <div v-if="showNextButton" class="mt-2">
                    <button
                        class="btn btn-outline-secondary w-100"
                        @click="startQuiz"
                    >
                        다음 문제 ▶
                    </button>
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
}
</style>
