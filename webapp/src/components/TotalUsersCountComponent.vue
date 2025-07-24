<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";

const loading = ref(false);
const userCount = ref<number>();

async function loadUserCount() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ count: number }>(
    "all-users-count",
  );
  if (!data || error) {
    console.error("Failed to load user count:", error);
  } else {
    userCount.value = data.count;
    loading.value = false;
  }
}

onMounted(() => {
  loadUserCount();
});
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <p v-else-if="userCount || userCount == 0">
      Total des utilisateurs inscrits : {{ userCount }}
    </p>
    <p v-else>Pas de réponse du serveur</p>
  </div>
</template>
