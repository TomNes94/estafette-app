import Vue from "nativescript-vue";

import App from "./App.vue";

import RadListView from "nativescript-ui-listview/vue";
Vue.use(RadListView);

Vue.registerElement("PullToRefresh", () => require("@nstudio/nativescript-pulltorefresh").PullToRefresh);
let ngrok = "://9d8f50176b79.ngrok.io";

Vue.config.supressRenderLogs = true;
Vue.config.silent = false;
Vue.prototype.$ngrokUrl = "https" + ngrok;

new Vue({
	render: h => h(App)
}).$start();
