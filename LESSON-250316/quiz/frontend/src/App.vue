<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAccountStore } from './stores/account';
import { onMounted } from 'vue';

const accountStore = useAccountStore();

onMounted(async () => {
  try {
    await accountStore.fetchInfo();
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    // API呼び出しが失敗しても画面は表示されるようにする
    accountStore.feched = true;
  }
});
</script>

<template>
  <Header />
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
  <Footer />
</template>

<style scoped></style>
