<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiClient from "../lib/utils/apiClient";
import type { Comment, Product } from "../lib/utils/types";
import { useRoute } from "vue-router";
import AddCommentComponent from "./AddCommentComponent.vue";
import { useAuthStore } from "../stores/authStore";

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const product = ref<Product>();

const title = ref("");
const description = ref("");

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

    title.value = product.value.title;
    description.value = product.value.description;
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

async function updateProduct() {
  const { data, error } = await apiClient.put("/product/update", {
    id: product.value?.id,
    title: title.value,
    description: description.value,
  });

  if (!data || error) {
    console.error("Failed to update product:", error);
    return;
  } else {
    console.log("Product updated successfully");
  }
}

function isCreator() {
  return product.value?.user.id != authStore.user.id;
}

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div>
    <router-link to="/products"
      ><button class="bouton route">Retour</button></router-link
    >

    <p v-if="loading">Chargement...</p>
    <div v-else-if="product" class="columns">
      <section class="form-section">
        <div class="form-container">
          <form @submit.prevent="updateProduct" class="form">
            <img :src="product.image" alt="" />
            <h2>{{ product.title }}</h2>
            <p>
              Créé par {{ product.user.firstName }}
              {{ product.user.lastName }}
            </p>
            <input
              type="text"
              v-model="title"
              :disabled="isCreator()"
              :placeholder="product.title"
            />
            <input
              type="text"
              v-model="description"
              :disabled="isCreator()"
              :placeholder="product.description"
            />
            <button type="submit">Ajouter un produit</button>
          </form>
        </div>

        <div class="form-container">
          <div class="form">
            <h2>Commentaires</h2>
            <AddCommentComponent @comment-added="addComment" />
            <p v-if="product.comments.length === 0">
              Aucun commentaire pour ce produit.
            </p>
            <div v-else>
              <div v-for="comment in product.comments" :key="comment.id">
                <strong
                  >{{ comment.user.firstName }}
                  {{ comment.user.lastName }}</strong
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
      </section>
    </div>
    <p v-else>Pas de produit pour l'id {{ route.params.id }}</p>
  </div>
</template>

<style scoped>
.form-image {
  width: 100%;
  height: auto;
  display: block;
}

/* form */
.form-section {
  display: flex;
  width: 100%;
  gap: 20px;
}

.form-container {
  flex: 1;
  box-sizing: border-box;
}

.form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form h2 {
  margin-top: 0;
  color: #333;
}

.form input[type="text"],
.form input[type="file"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.form button:hover {
  background-color: #0056b3;
}

.bouton {
  display: inline-block;
  padding: 10px 20px;
  color: white;
  text-align: center;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.route {
  background-color: #007bff;
  &:hover {
    background-color: #3c91ec;
    transform: scale(1.05);
  }
}

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
