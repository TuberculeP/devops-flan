<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";

const loading = ref(false);
const productCount = ref<number>();

async function loadProductCount() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ count: number }>(
    "all-products-count",
  );
  if (!data || error) {
    console.error("Failed to load user count:", error);
  } else {
    productCount.value = data.count;
    loading.value = false;
  }
}

onMounted(() => {
  loadProductCount();
});
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <p v-else-if="productCount || productCount == 0">
      Total des produits créés : {{ productCount }}
    </p>
    <p v-else>Pas de réponse du serveur</p>
  </div>
</template>
