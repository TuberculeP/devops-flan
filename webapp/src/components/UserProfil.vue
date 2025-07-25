<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import apiClient from "../lib/utils/apiClient";
import type { Comment, Product, User } from "../lib/utils/types";
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
    file,
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
    },
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
    "products-list-user",
  );
  if (!data || error) {
    console.error("Failed to load product list:", error);
  } else {
    productList.value = data.products;
    loading.value = false;
  }
}

<<<<<<< HEAD
=======
async function loadCommentList() {
  loading.value = true;
  const { data, error } = await apiClient.get<{ comment: Comment[] }>(
    "comments-list-user",
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

>>>>>>> 908d9386ac0b970b11810663a971223d3298ebb3
onMounted(() => {
  loadProductList();
  loadCommentList();
});
</script>

<template>
  <section class="form-section">
    <div class="form-container">
      <form @submit.prevent="updateProfile" class="form">
        <h2>Infos Utilisateurs</h2>
        <input type="text" v-model="name" placeholder="Nom" />
        <input type="text" v-model="email" placeholder="Email" />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>

    <div class="form-container">
      <form @submit.prevent="createProduct" class="form">
        <h2>Produits</h2>
        <input type="text" v-model="title" placeholder="Title" />
        <input type="text" v-model="description" placeholder="Description" />
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
    </div>
  </section>

  <section>
    <p v-if="loading">Chargement...</p>
    <div v-else-if="productList && productList.length > 0">
      <h2 style="margin-bottom: 2em">Vos Produits :</h2>
      <div class="grid-container">
        <div v-for="product in productList" class="card">
          <router-link :to="'/detail/' + product.id" class="product-link">
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
  </section>

  <br /><br />
  <p v-if="loading">Chargement...</p>
  <div v-else-if="commentList && commentList.length > 0">
    <h3>Listes des commentaires créés par vous :</h3>
    <div v-for="comment in commentList">
      <div @click="goToDetail(comment.id)">
        <p>{{ comment.text }}</p>
      </div>
    </div>
  </div>
  <p v-else>Pas de commentaires</p>
</template>

<style scoped>
.product-link {
  text-decoration: none;
  color: inherit;
}

/* cards */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
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
</style>
