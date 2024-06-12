// main.js

import Vue from 'vue';
import App from './App.vue';
import router from './router'; // Import the router

new Vue({
  router, // Use the router
  render: h => h(App),
}).$mount('#app');
