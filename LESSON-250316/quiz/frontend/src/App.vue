<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import cookieLib from './libs/cookieLib';
import { useAccountStore } from './stores/account';

const token = cookieLib.get("token");
const accountStore = useAccountStore();

if (token) {
  accountStore.setLoggedIn(true);
}
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
