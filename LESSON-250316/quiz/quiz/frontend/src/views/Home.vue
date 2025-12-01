<script setup lang="ts"></script>

<template>
  <div class="home">
    <div class="image">
      <img src="/assets/img/bear.png" />
    </div>
    <div class="message">
      クイズを解くには、上の「クイズを解く！」ボタンをクリックしてください。
    </div>
  </div>
</template>

<style scoped>
.home {
  .image {
    text-align: center;
    margin-bottom: var(--px35);

    img {
      height: 200px;
    }
  }
}
</style>
