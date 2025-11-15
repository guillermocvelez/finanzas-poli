import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/tabs/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/dashboard",
  },
  {
    path: "/tabs/",
    component: TabsPage,
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

export default router;
