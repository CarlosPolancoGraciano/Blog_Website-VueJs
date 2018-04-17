import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* Setting Vue Froala Component */
// Setting jQuery in Window
import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)
/* END Setting Vue Froala Component */

/* Setting Bootstrap-Vue Component */
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
/* END Setting Bootstrap-Vue Component */

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
