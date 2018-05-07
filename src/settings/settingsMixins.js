import Vue from 'vue';
import { GLOBAL, USER_LOGGED, USER_AUTH, FILTER, LOADING_OVERLAY } from '@/components/mixins';

// Add All App Mixins Globally
Vue.mixin({ ...USER_LOGGED });
Vue.mixin({ ...GLOBAL });
Vue.mixin({ ...USER_AUTH });
Vue.mixin({ ...LOADING_OVERLAY });
Vue.mixin({ ...FILTER });