<script setup lang="ts">
import { reactive } from "vue";
import type { Word } from "@/interfaces/Word";
import httpLib from "@/libs/httpLib";

interface State {
    words: {
        loaded: boolean;
        data: Array<Word>;
    };
    editingId: string | null;
}

const state = reactive<State & { editingId: string | null }>({
    words: {
        loaded: false,
        data: [],
    },
    editingId: null,
});

const startEdit = (id: string) => {
    state.editingId = id;
};

const cancelEdit = () => {
    state.editingId = null;
};

const saveEdit = async (word: Word) => {
    if (!window.confirm("수정하시겠습니까?")) return;

    try {
        const res = await httpLib.put(`/v1/api/admin/words/${word._id}`, {
            title: word.title,
            desc: word.desc,
        });

        if (res.status === 200) {
            window.alert(res.data.message);
            await load();
            state.editingId = null;
        } else {
            window.alert("수정 실패");
        }
    } catch (err) {
        console.error(err);
        window.alert("오류 발생");
    }
};

const remove = async (id: string) => {
    if (!window.confirm("삭제하시겠습니까?")) {
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
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(w, idx) in state.words.data" :key="w._id">
                    <td>{{ idx + 1 }}</td>
                    <td v-if="state.editingId === w._id">
                        <input v-model="w.title" />
                    </td>
                    <td v-else>
                        {{ w.title }}
                    </td>
                    <td v-if="state.editingId === w._id">
                        <input v-model="w.desc" />
                    </td>
                    <td v-else>
                        {{ w.desc }}
                    </td>
                    <td>
                        <template v-if="state.editingId === w._id">
                            <i
                                class="fa fa-check"
                                @click="saveEdit(w)"
                                title="저장"
                            ></i>
                            <i
                                class="fa fa-times"
                                @click="cancelEdit"
                                title="취소"
                            ></i>
                        </template>
                        <template v-else>
                            <i
                                class="fa fa-pencil"
                                @click="startEdit(w._id)"
                                title="수정"
                            ></i>
                        </template>
                    </td>
                    <td>
                        <i class="fa fa-trash" @click="remove(w._id)"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <router-link to="/admin/word" class="btn btn-primary"
                >+ 단어 추가하기</router-link
            >
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
