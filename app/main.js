import Vue from "nativescript-vue";

import Navigator from "nativescript-vue-navigator";
import { routes } from "./routes";
Vue.use(Navigator, { routes });
import App from "./App.vue";

import RadListView from "nativescript-ui-listview/vue";

Vue.use(RadListView);

let ngrok = "://tomvannes.nl";
Vue.config.supressRenderLogs = true;
Vue.config.silent = false;
Vue.prototype.$ngrokUrl = "https" + ngrok;

new Vue({
	render: h => h(App)
}).$start();
