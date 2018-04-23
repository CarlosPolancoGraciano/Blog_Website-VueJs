import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import * as $ from 'jquery';

/* Setting window values */
window["$"] = $;
window["jQuery"] = $;
window.swal = swal;
window.axios = axios;
window.moment = moment;

/* Setting Vue Froala Component */
require('froala-editor/js/froala_editor.pkgd.min')
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

import VueFroala from 'vue-froala-wysiwyg';
Vue.use(VueFroala);

/* Setting Bootstrap-Vue Component */

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

/* Setting vue-toastr Component */

import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css';

import VueToastr from '@deveodk/vue-toastr';
Vue.use(VueToastr,{ defaultPosition: 'toast-bottom-left' });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
