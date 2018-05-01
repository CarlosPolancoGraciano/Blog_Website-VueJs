import Vue from 'vue';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import * as $ from 'jquery';
import BootstrapVue from 'bootstrap-vue';
import VueFroala from 'vue-froala-wysiwyg';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css';
import VueToastr from '@deveodk/vue-toastr';
import App from './App.vue';
import router from './router/router';
import store from './store/store';

import { GLOBAL, USER_LOGGED, USER_AUTH } from '@/components/mixins';

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

Vue.use(VueFroala);

/* Setting Bootstrap-Vue Component */
Vue.use(BootstrapVue);

/* Setting vue-toastr Component */
Vue.use(VueToastr,{ defaultPosition: 'toast-bottom-left' });

// Add All App Mixins Globally
Vue.mixin({ ...USER_LOGGED });
Vue.mixin({ ...GLOBAL });
Vue.mixin({ ...USER_AUTH });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
