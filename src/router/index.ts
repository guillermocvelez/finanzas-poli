import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/tabs/TabsPage.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginPage.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/tabs/",
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/tabs/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/DashboardPage.vue"),
      },
      {
        path: "transactions",
        component: () => import("@/views/transactions/TransactionsPage.vue"),
      },
      {
        path: "budgets",
        component: () => import("@/views/budgets/BudgetsPage.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/profile/ProfilePage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Ruta protegida y usuario no autenticado
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Ruta de invitado y usuario ya autenticado
    next("/tabs/dashboard");
  } else {
    next();
  }
});

export default router;
