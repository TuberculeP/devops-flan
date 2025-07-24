<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";
import type { Product } from "../lib/utils/types";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const productList = ref<Product[]>();

async function loadProductList() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ products: Product[] }>(
    "products-list",
  );
  if (!data || error) {
    console.error("Failed to load product list:", error);
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
        <router-link :to="'/detail/' + product.id" class="product-link">
          <h2>{{ product.title }}</h2>
          <p>{{ product.description }}</p>
          <img :src="product.image" alt="" style="width: 200px" />
          <div v-if="product.comments" v-for="comment in product.comments">
            <div>
              <p>{{ comment.user.firstName }} :</p>
              <p>{{ comment.text }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <p v-else>Pas de produits</p>
  </div>
</template>

<style scoped>
.product-link {
  text-decoration: none;
  color: inherit;
}
</style>
