import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';

// All apps global settings are from here
import './settings';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
