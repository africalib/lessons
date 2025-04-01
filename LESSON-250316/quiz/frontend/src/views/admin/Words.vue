<script setup lang="ts">
import { reactive } from "vue";
import type Word from '@/interface/Word';
import httpLib from "@/libs/httpLib";
import { useRouter } from 'vue-router';

interface State {
    words: {
        loaded: boolean,
        data: Array<Word>;
    };
}

const state = reactive<State>({
    words: {
        loaded: false,
        data: []
    }
});

const update = async (word: Word) => {
    if (!window.confirm('수정하시겠습니까?')) {
        return;
    }

    const res = await httpLib.put(`/v1/api/admin/words/${word._id}`, word);

    if (res.status === 200) {
        window.alert(res.data.message);
        load();
    }
};

const remove = async (id: string) => {
    if (!window.confirm('삭제하시겠습니까?')) {
        return;
    }

    const res = await httpLib.delete(`/v1/api/admin/words/${id}`);

    if (res.status === 200) {
        window.alert(res.data.message);
        load();
    }
};

const load = async () => {
    const res = await httpLib.get("/v1/api/admin/words");
    state.words.data = res.data.sort((a: Word, b: Word) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    });
};

(async function onCreated() {
    await load();
})();
</script>

<template>
    <div class="words">
        <table class="table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>단어</th>
                    <th>설명</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(w, idx) in state.words.data" :key="w._id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ w.title }}</td>
                    <td>{{ w.desc }}</td>
                    <td>
                        <i class="fa fa-trash" aria-hidden="true" @click="remove(w._id)"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <router-link to="/admin/word" class="btn btn-primary">+ 단어 추가하기</router-link>
            <router-link to="/admin/word" class="btn btn-primary">- 단어 수정하기</router-link>
        </div>
    </div>
</template>

<style scoped>
.words {
    table {
        th {
            background: #f7f7f7;
            border-top: var(--px1) solid #eee;
        }
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--px25);
    }
}
</style>