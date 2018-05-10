import Vue from 'vue';
// Vue Froala Wysiwyg
import VueFroala from 'vue-froala-wysiwyg';
// Bootstrap-Vue
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css';
// Loading overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';
// Vue pagination
import VuePaginate from 'vue-paginate';
// Vue toastr
import VueToastr from '@deveodk/vue-toastr';
// My own components
import AppIcon from '../components/app/AppIcon.vue';
// import AppFilter from '../components/app/AppFilter.vue';

/* Setting Vue Froala Component */
require('froala-editor/js/froala_editor.pkgd.min')
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

Vue.use(VueFroala);

/* Setting Bootstrap-Vue Component */
Vue.use(BootstrapVue);

/* Setting vue-toastr Component */
Vue.use(VueToastr,{ defaultPosition: 'toast-bottom-left' });

/* Setting Vue-Paginate */
Vue.use(VuePaginate);

/* Setting Vue-Loading-Overlay Component */
Vue.component('loading', Loading);

// Add globally AppIcon component
Vue.component('AppIcon', AppIcon);