<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";
import type { Product } from "../lib/utils/types";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(false);
const product = ref<Product>();

async function loadProduct() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ product: Product }>(
    `products/${route.params.id}`,
  );
  if (!data || error) {
    console.error("Failed to load product:", error);
  } else {
    product.value = data.product;
    loading.value = false;
  }
}

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <div v-else-if="product">
      <p>{{ product.title }}</p>
    </div>
    <p v-else>Pas de produit pour l'id {{ route.query.id }}</p>
  </div>
</template>
