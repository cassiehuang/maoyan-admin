import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    CHANGE_USER(state, user) {
      state.user.isLogin = true;
      state.user.username = user.username;
      state.user.type = user.type;
    }
  },
  actions: {
    
  }
});

export default store;
