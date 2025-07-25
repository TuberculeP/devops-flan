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
      <div class="grid-container">
<<<<<<< HEAD
        <router-link
          :to="'/detail/' + product.id"
          v-for="product in productList"
          class="product-link card"
        >
          <div>
=======
        <div v-for="product in productList" class="card">
          <router-link :to="'/detail/' + product.id" class="product-link">
>>>>>>> 908d9386ac0b970b11810663a971223d3298ebb3
            <img :src="product.image" alt="" />
            <div class="card-content">
              <h2>{{ product.title }}</h2>
              <p>{{ product.description }}</p>
            </div>
          </router-link>
        </div>
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 100%;
  height: auto;
  display: block;
}

.card-content {
  padding: 15px;
}

.card-content h3 {
  margin-top: 0;
}

.card-content p {
  color: #666;
}
</style>
