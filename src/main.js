import Vue from "vue";
import App from "./App.vue";
import TDesign from "tdesign-vue";

Vue.config.productionTip = false;
Vue.use(TDesign);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
