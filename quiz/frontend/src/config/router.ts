import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/join',
      component: () => import('../views/Join.vue'),
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/quizzes',
      component: () => import('../views/Quizzes.vue'),
    },
    {
      path: '/my-answers',
      component: () => import('../views/MyAnswers.vue'),
    },
    {
      path: '/admin/words',
      component: () => import('../views/admin/Words.vue'),
    },
    {
      path: '/admin/word',
      component: () => import('../views/admin/Word.vue'),
    },
  ],
});

export default router;
