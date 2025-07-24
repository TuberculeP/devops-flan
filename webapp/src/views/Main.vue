<script setup lang="ts">
import TotalUsersComponent from "../components/TotalUsersCountComponent.vue";
import TotalProductsComponent from "../components/TotalProductsCountComponent.vue";
</script>

<template>
  <div class="container">
    <h1>Accueil</h1>
    <TotalUsersComponent />
    <TotalProductsComponent />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
</style>
