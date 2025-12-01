<script setup lang="ts">
import commonLib from "@/libs/commonLib";
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
  loading: boolean;
  quiz: Quiz;
  selectedIndex: number;
}

const accountStore = useAccountStore();
const router = useRouter();

const state = reactive<State>({
  loading: false,
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
    if (window.confirm("ログインが必要です。ログインページに移動しますか？")) {
      router.push("/login");
    }

    return;
  }

  const res = await httpLib.get("/v1/api/quizzes/random");
  state.quiz = res.data;
};

const submit = async () => {
  const selectedIndexNumber = Number(state.selectedIndex);

  state.loading = true;
  const res = await httpLib.post(
    `/v1/api/quizzes/${state.quiz.quizId}/answers`,
    {
      selectedIndex: selectedIndexNumber,
      options: state.quiz.options,
    }
  );

  if (res?.data) {
    const isCorrect = res.data.isCorrect;

    if (isCorrect) {
      resultMessage.value = "✅ 正解です！";
      await commonLib.wait(3);
      startQuiz();
    } else {
      resultMessage.value = `❌ 不正解です。正解は「${res.data.answer}」です。`;
      showNextButton.value = true;
    }

    state.loading = false;
  } else {
    resultMessage.value = "サーバーとの通信に失敗しました。";
  }
};

startQuiz();
</script>

<template>
  <div class="home">
    <template v-if="state.quiz.quizId">
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
                :disabled="state.loading"
              />
              <label class="form-check-label" :for="`quizOption${idx}`">
                {{ o }}
              </label>
            </div>
          </li>
        </ul>
        <div class="action mt-3">
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="state.loading"
          >
            {{ state.loading ? "ローディング中" : "提出する" }}
          </button>
        </div>
        <p class="mt-3" v-if="resultMessage">
          {{ resultMessage }}
        </p>
        <div v-if="showNextButton" class="mt-2">
          <button class="btn btn-outline-secondary w-100" @click="startQuiz">
            次の問題 ▶
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
.home {
  form {
    .question {
      font-weight: bold;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 20px 0 0 0;
    }
  }
}
</style>
