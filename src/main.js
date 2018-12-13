import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

Vue.config.productionTip = false

const auth = require('./utils/api_helper.js').auth;
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth) && !store.state.user.isLogin) {
    auth().then((data) => {
      if (data.username)  {
        store.commit('CHANGE_USER', data);
        next({
          path: '/main'
        });
      } else {
        next( {
          path: '/login'
        });
      }
    })
  } else {
    next();
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
