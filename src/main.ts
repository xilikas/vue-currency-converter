import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import VueCookies from 'vue-cookies';

import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueCookies);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
