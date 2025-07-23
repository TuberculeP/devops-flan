<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";
import type { Product } from "../lib/utils/types";

const loading = ref(false);
const productList = ref<Product[]>();

async function loadProductList() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ products: Product[] }>(
    "products-list",
  );
  if (!data || error) {
    console.error("Failed to load user list:", error);
  } else {
    productList.value = data.products;
    loading.value = false;
  }
}

onMounted(() => {
  loadProductList();
});
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <div v-else-if="productList && productList.length > 0">
      Listes des produits créés :
      <div v-for="product in productList">
        <h2>{{ product.title }}</h2>
      </div>
    </div>
    <p v-else>Pas de produits</p>
  </div>
</template>
