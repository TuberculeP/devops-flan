<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import apiClient from "../lib/utils/apiClient";

const authStore = useAuthStore();
const name = ref(authStore.user?.firstName || "");
const email = ref(authStore.user?.email || "");

async function updateProfile() {
  const { data, error } = await apiClient.put("/user/update", {
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
</template>
