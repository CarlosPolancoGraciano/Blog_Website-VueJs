import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user.js';
import notifications from '@/store/modules/notifications.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    user,
    notifications
  }
});
