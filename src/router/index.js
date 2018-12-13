import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login', 
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/main',
      meta: {
        requireAuth: true,
      },
      component: () => import('@/views/main.vue'),
      redirect: '/filmManager/1',
      children: [
        {
          path: '/recommandManager',
          component: () => import('@/components/recommandManager.vue'),
        },
        {
          path: '/filmManager/:type',
          component: () => import('@/components/filmManager.vue'),
        },
        {
          path: '/cinemasManager',
          component: () => import('@/components/cinemasManager.vue'),
        }
      ]
    },
  ]
})

export default router;
