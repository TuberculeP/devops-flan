<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";
import UserProfil from "../components/UserProfil.vue";
// import UserProducts from './UserProducts.vue'
// import UserComments from './UserComments.vue'

const authStore = useAuthStore();
</script>

<template>
  <div class="container">
    <h1>Dashboard de {{ authStore.user?.firstName }}</h1>

    <UserProfil />
    <!-- <UserProducts />
    <UserComments /> -->
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
</style>
