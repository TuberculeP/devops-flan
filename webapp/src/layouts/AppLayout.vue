<template>
  <section v-if="isAuthenticated">
    <div class="nav">
      <router-link
        to="/"
        class="product-link"
        style="text-decoration: none; color: black"
      >
        <h2>Devops-Flan</h2>
      </router-link>
      <div id="router">
        <router-link to="/" class="product-link">
          <button class="bouton route">Home</button>
        </router-link>

        <router-link to="/products" class="product-link">
          <button class="bouton route">Produits</button>
        </router-link>

        <router-link to="/dashboard" class="product-link">
          <button class="bouton route">Dashboard</button>
        </router-link>
        <button class="bouton disconnect" @click="disconnect">
          Déconnexion
        </button>
      </div>
    </div>
  </section>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import apiClient from "../lib/utils/apiClient";

const { user, isAuthenticated } = storeToRefs(useAuthStore());

async function disconnect() {
  const result = await apiClient.post("/auth/logout");
  if (result.data) {
    console.log("Déconnexion réussie");
    user.value = undefined; // Clear user data
    window.location.reload(); // Reload to reset state
  } else {
    console.error("Erreur lors de la déconnexion :", result.error);
  }
}
</script>

<style scoped>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2em;
  align-items: center;
  text-align: center;
  background-color: rgb(215, 237, 239);
  color: black;
  margin-bottom: 15px;

  height: 80px;
  width: 100vw;

  #router {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
.bouton {
  display: inline-block;
  padding: 10px 20px;
  background-color: rgb(215, 237, 239);
  color: #000000;
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
  background-color: rgb(215, 237, 239);
  &:hover {
    background-color: rgb(185, 215, 211);
    transform: scale(1.05);
  }
}

.disconnect {
  background-color: rgb(166, 218, 222);
  &:hover {
    background-color: rgb(131, 194, 199);
    transform: scale(1.05);
  }
}
</style>
