<script lang="ts" setup>
import type { MyAnswer } from "@/interfaces/MyAnswer";
import { reactive } from "vue";
interface State {
    answers: Array<MyAnswer>;
}

const state = reactive<State>({
    answers: []
});
</script>

<template>
    <div class="my-answers">
        <div class="container">
            <div class="title">내 답변 내역</div>
            <div class="answers">
                {{ state.answers }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-answers {
    .title {
        font-weight: bold;
        margin-bottom: var(--px25);
    }
}
</style>