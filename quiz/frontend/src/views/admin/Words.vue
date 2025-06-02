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
  if (!window.confirm("修正しますか？")) return;

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
      window.alert("修正に失敗しました。");
    }
  } catch (err) {
    console.error(err);
    window.alert("エラーが発生しました。");
  }
};

const remove = async (id: string) => {
  if (!window.confirm("削除しますか？")) {
    return;
  }

  try {
    const res = await httpLib.delete(`/v1/api/admin/words/${id}`);

    if (res.status === 200) {
      window.alert(res.data.message);
      await load();
    } else {
      window.alert("削除に失敗しました。");
    }
  } catch (err: any) {
    console.error(err);

    // 에러 메시지가 서버에서 온 경우
    const message =
      err?.response?.data?.message ??
      "エラーが発生しました。ログインしてください。";
    window.alert(message);
  }
};

const load = async () => {
  const res = await httpLib.get("/v1/api/admin/words");
  state.words.data = res.data.sort((a: Word, b: Word) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
          <th>番号</th>
          <th>単語</th>
          <th>説明</th>
          <th>修正</th>
          <th>削除</th>
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
              <i class="fa fa-check" @click="saveEdit(w)" title="保存"></i>
              <i class="fa fa-times" @click="cancelEdit" title="キャンセル"></i>
            </template>
            <template v-else>
              <i
                class="fa fa-pencil"
                @click="startEdit(w._id)"
                title="修正"
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
        >＋単語を追加する</router-link
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
