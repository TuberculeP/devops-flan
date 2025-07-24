<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";
import type { Comment, Product } from "../lib/utils/types";
import { useRoute } from "vue-router";
import AddCommentComponent from "./AddCommentComponent.vue";

const route = useRoute();

const loading = ref(false);
const product = ref<Product>();

async function loadProduct() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ product: Product }>(
    `product/${route.params.id}`,
  );
  if (!data || error) {
    console.error("Failed to load product:", error);
  } else {
    product.value = data.product;
    loading.value = false;
  }
}

async function addComment(comment: string) {
  if (!product.value) return;

  const { data, error } = await apiClient.post<{ comment: Comment }>(
    `product/${product.value.id}/comment`,
    { text: comment },
  );

  if (data && !error) {
    product.value.comments.push(data.comment);
  } else {
    console.error("Failed to add comment:", error);
  }
}

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div>
    <router-link to="/products">Retour à la liste des produits</router-link>
    <hr />
    <p v-if="loading">Chargement...</p>
    <div v-else-if="product" class="columns">
      <div>
        <h1>{{ product.title }}</h1>
        <p>Créé par {{ product.user.firstName }} {{ product.user.lastName }}</p>
        <p>{{ product.description }}</p>
        <img :src="product.image" alt="" />
      </div>
      <div>
        <h2>Commentaires</h2>
        <AddCommentComponent @comment-added="addComment" />
        <p v-if="product.comments.length === 0">
          Aucun commentaire pour ce produit.
        </p>
        <div v-else>
          <div v-for="comment in product.comments" :key="comment.id">
            <strong
              >{{ comment.user.firstName }} {{ comment.user.lastName }}</strong
            >: {{ comment.text }} ({{
              new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            }})
          </div>
        </div>
      </div>
    </div>
    <p v-else>Pas de produit pour l'id {{ route.params.id }}</p>
  </div>
</template>

<style scoped>
img {
  max-width: 50%;
  max-height: 300px;
  margin: 0 auto;
  display: block;
}
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
  > div {
    border: 1px solid black;
    padding: 10px;
  }
}
</style>
