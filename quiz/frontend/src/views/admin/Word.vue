<script setup lang="ts">
import { reactive } from "vue";
import httpLib from "@/libs/httpLib";
import { useRouter } from "vue-router";

interface State {
  form: {
    title: string;
    desc: string;
  };
}

const state = reactive<State>({
  form: {
    title: "",
    desc: "",
  },
});

const router = useRouter();

const submit = async () => {
  const res = await httpLib.post(`/v1/api/admin/words`, state.form);

  if (res.status === 201) {
    window.alert(res.data.message);
    router.push("/admin/words");
  }
};
</script>

<template>
  <form class="word" @submit.prevent="submit">
    <div class="mb-3">
      <label for="title" class="form-label">単語</label>
      <input
        type="text"
        class="form-control"
        id="title"
        placeholder="単語を入力してください。"
        v-model="state.form.title"
      />
    </div>
    <div class="mb-3">
      <label for="desc" class="form-label">単語の意味</label>
      <textarea
        class="form-control"
        id="desc"
        v-model="state.form.desc"
      ></textarea>
    </div>
    <div class="actions">
      <router-link to="/admin/words" class="btn btn-secondary"
        >キャンセル</router-link
      >
      <button type="submit" to="/admin/word" class="btn btn-primary">
        + 単語を保存
      </button>
    </div>
  </form>
</template>

<style scoped>
.word {
  .actions {
    display: flex;
    justify-content: space-between;
    padding-top: var(--px25);
    margin-top: var(--px25);
    border-top: var(--px1) solid #eee;
  }
}
</style>
