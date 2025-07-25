<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <div>
        <input type="text" v-model="form.email" placeholder="Email" />
        <input
          type="password"
          v-model="form.password"
          placeholder="Mot de passe"
        />
        <button @click="submitForm">Envoyer</button>
        <router-link :to="{ name: 'app-register' }">
          Inscrivez-vous
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import apiClient from "../../lib/utils/apiClient";
import { useRouter } from "vue-router";
import type { User } from "../../lib/utils/types";

const router = useRouter();

// retrieve redirect path from query params
const redirect = router.currentRoute.value.query.redirect as string;
const form = reactive({
  email: "",
  password: "",
});

async function submitForm() {
  const result = await apiClient.post<{ user: User }>("/auth/login", form);
  if (!result.error) {
    router.push({ name: redirect ?? "landing-main" });
  } else {
    console.error("Erreur lors de la connexion :", result.error);
  }
}
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-card h2 {
  margin-top: 0;
  color: #333;
}

.login-card input[type="text"],
.login-card input[type="password"] {
  width: calc(100% - 22px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-card button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-card button:hover {
  background-color: #0056b3;
}

.login-card p {
  margin-top: 15px;
}

.login-card a {
  color: #007bff;
  text-decoration: none;
}

.login-card a:hover {
  text-decoration: underline;
}
</style>
