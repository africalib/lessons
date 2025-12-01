<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAccountStore } from './stores/account';

const accountStore = useAccountStore();

(async () => {
  await accountStore.fetchInfo();
})();
</script>

<template>
  <template v-if="accountStore.feched">
    <Header />
    <main>
      <div class="container">
        <RouterView />
      </div>
    </main>
    <Footer />
  </template>
</template>

<style scoped></style>
