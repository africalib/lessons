<script type="ts" setup>
import { useAccountStore } from "@/stores/account";

const accountStore = useAccountStore();

</script>

<template>
    {{ accountStore.loggedIn }}
</template>