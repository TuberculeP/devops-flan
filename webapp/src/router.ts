import { createRouter, createWebHistory } from "vue-router";

import LoginView from "./views/auth/LoginView.vue";
import RegisterView from "./views/auth/RegisterView.vue";

import { useAuthStore } from "./stores/authStore";
import apiClient from "./lib/utils/apiClient";
import type { User } from "./lib/utils/types";
import Main from "./views/Main.vue";
import ProductView from "./views/ProductView.vue";
import DashboardUser from "./views/DashboardUser.vue";
import ProductDetailView from "./views/ProductDetailView.vue";

async function authGuard(to: any, from: any, next: any) {
  const authStore = useAuthStore();
  const check = await apiClient.get<{ user: User }>("/auth/check");
  if (check.error) {
    next({ name: "app-login", query: { redirect: to.path } });
    return;
  }
  if (check.data && check.data.user) {
    authStore.user = check.data.user;
    next();
  } else {
    next({ name: "app-login", query: { redirect: to.path } });
    window.location.reload(); // Reload to reset state
  }
}

const routes = [
  { path: "/", redirect: "/app", name: "home-redirect" },
  { path: "/app", component: Main, name: "landing-main" },
  { path: "/dashboard", component: DashboardUser, name: "dashborad-user" },
  { path: "/login", component: LoginView, name: "app-login" },
  { path: "/register", component: RegisterView, name: "app-register" },
  { path: "/products", component: ProductView, name: "product-page" },
  { path: "/detail/:id", component: ProductDetailView, name: "product-detail" },
];

const getGuardedRoutes = () => {
  const guardedMatches = ["app", "dashboard", "products", "detail"];
  return routes.map((route) => {
    if (guardedMatches.some((match) => route.path.includes(match))) {
      return {
        ...route,
        beforeEnter: authGuard,
      };
    }
    return route;
  });
};

export const router = createRouter({
  history: createWebHistory(),
  routes: getGuardedRoutes(),
});
