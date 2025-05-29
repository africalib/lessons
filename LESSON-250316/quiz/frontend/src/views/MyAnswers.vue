<script lang="ts" setup>
import type { MyAnswer } from "@/interfaces/MyAnswer";
import commonLib from "@/libs/commonLib";
import httpLib from "@/libs/httpLib";
import { useAccountStore } from "@/stores/account";
import type { AxiosResponse } from "axios";
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Answers {
    count: number,
    data: Array<MyAnswer>;
}

interface State {
    answers: Answers,
    args: {
        num: number,
        take: number;
    };
}

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();

const state = reactive<State>({
    answers: {
        count: 0,
        data: []
    },
    args: {
        num: 1,
        take: 5
    }
});

const computedPageLength = computed(() => {
    return Math.ceil(state.answers.count / state.args.take);
});

const getPageUrl = (num: number) => {
    const query = commonLib.renew(route.query);
    let queryStr = `?page=${num}`;

    if (query["page"]) {
        delete query["page"];
    }

    if (Object.keys(query)) {
        for (let key in query) {
            queryStr += '&' + key + '=' + query[key];
        }
    }

    return queryStr;
};

const load = async () => {
    state.args.num = Number.parseInt(route.query.page?.toString() || "1");
    const res: AxiosResponse<Answers> = await httpLib.get(`/v1/api/users/${accountStore.userId}/answers`, state.args);
    state.answers = res.data;
};

watch(() => route.query.page, () => {
    load();
});

(async () => {
    if (!accountStore.loggedIn) {
        const output = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
        return router.replace(output ? "/login" : "/");
    }

    load();
})();
</script>

<template>
    <div class="my-answers">
        <div class="container">
            <div class="title d-flex justify-content-between">
                <div>내 답변 내역</div>
                <div>{{ state.answers.count }}개</div>
            </div>
            <div class="answers">
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>나의 답변</th>
                            <th>정답</th>
                            <th>정답 여부</th>
                            <th>제출 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(a, idx) in state.answers.data" :key="a._id">
                            <td>{{ state.answers.data.length - idx }}</td>
                            <td>{{ a.submittedContent }}</td>
                            <td>{{ a.correctContent }}</td>
                            <td>{{ a.isCorrect ? 'O' : 'X' }}</td>
                            <td>{{ commonLib.getDateFormatted(a.createdAt, 'yy-MM-dd HH:mm') }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <div class="btn-group">
                        <router-link :to="getPageUrl(p)" class="btn"
                            :class="state.args.num === p ? 'btn-primary' : 'btn-light'" v-for="p in computedPageLength">
                            {{ p }}
                        </router-link>
                    </div>
                </div>
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

    .pagination {
        display: flex;
        margin-top: var(--px30);
        justify-content: center;
    }
}
</style>