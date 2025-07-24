<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import apiClient from "../lib/utils/apiClient";
import type { Product, User } from "../lib/utils/types";
import { useRouter } from "vue-router";

const router = useRouter();

//user
const authStore = useAuthStore();
const name = ref(authStore.user?.firstName || "");
const email = ref(authStore.user?.email || "");

// product
const title = ref("");
const description = ref("");

const loading = ref(false);
const productList = ref<Product[]>();
const commentList = ref<Comment[]>();

// file
const file = ref<File | null>(null);
const message = ref<string | null>(null);
const uploadedFileUrl = ref<string | null>(null);

//updateProfile
async function updateProfile() {
  const { data, error } = await apiClient.put<User>("/user/update", {
    firstName: name.value,
    email: email.value,
  });

  if (!data || error) {
    console.error("Failed to update profile:", error);
    return;
  } else {
    authStore.user = data;
    console.log("Profile updated successfully");
  }
}

// createProduct
async function createProduct() {
  const { data, error } = await apiClient.post("/product/create", {
    user: authStore.user,
    title: title.value,
    description: description.value,
    image: uploadedFileUrl.value,
  });

  if (!data || error) {
    console.error("Failed to create product:", error);
    return;
  } else {
    console.log("Product created successfully");
  }
}

// uploadFile
const uploadFile = async () => {
  console.log(
    "\x1b[44m%s\x1b[0m",
    "webapp/src/views/TestView.vue:9 file",
    file
  );
  if (!file.value) {
    message.value = "Veuillez sélectionner un fichier.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);

  const response = await apiClient.post<{ url: string }>(
    "/shared/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.data && response.error === null) {
    uploadedFileUrl.value = response.data.url;
    message.value = "Fichier téléchargé avec succès.";
  } else {
    message.value = `Erreur: ${response.error}`;
  }
};

async function loadProductList() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ products: Product[] }>(
    "products-list-user"
  );
  if (!data || error) {
    console.error("Failed to load product list:", error);
  } else {
    productList.value = data.products;
    loading.value = false;
  }
}

async function loadCommentList() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ comments: Comment[] }>(
    "comments-list-user"
  );
  if (!data || error) {
    console.error("Failed to load comment list:", error);
  } else {
    commentList.value = data.comment;
    loading.value = false;
  }
}

function goToDetail(id: string) {
  router.push({ path: "detail", query: { id: id } });
}

onMounted(() => {
  loadProductList();
  loadCommentList();
});
</script>

<template>
  <section>
    <h2>Informations personnelles</h2>
    <form @submit.prevent="updateProfile">
      <label>Nom : <input v-model="name" /></label><br />
      <label>Email : <input v-model="email" /></label><br />
      <button type="submit">Mettre à jour</button>
    </form>
  </section>
  <br />

  <section>
    <h2>Produits</h2>
    <form @submit.prevent="createProduct">
      <label>Title : <input v-model="title" /></label><br />
      <label>Description : <input v-model="description" /></label><br />
      <input
        type="file"
        @change="
          (e: Event) => {
            const target = e.target as HTMLInputElement;
            file = target?.files?.[0] || null;
            uploadFile();
          }
        "
      /><br />
      <button type="submit">Ajouter un produit</button>
    </form>
  </section>

  <section>
    <p v-if="loading">Chargement...</p>
    <div v-else-if="productList && productList.length > 0">
      Listes des produits créés par vous :
      <div v-for="product in productList">
        <div @click="goToDetail(product.id)">
          <h2>{{ product.title }}</h2>
          <p>{{ product.description }}</p>
          <img :src="product.image" alt="" style="width: 200px" />
        </div>
      </div>
    </div>
    <p v-else>Pas de produits</p>
  </section>
  <br><br>
  <p v-if="loading">Chargement...</p>
  <div v-else-if="commentList && commentList.length > 0">
    Listes des produits créés par vous :
    <div v-for="comment in commentList">
      <div @click="goToDetail(comment.id)">
        <p>{{ comment.text }}</p>
      </div>
    </div>
  </div>
  <p v-else>Pas de commentaires</p>
</template>
