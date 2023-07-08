import { createApp } from "vue";
import { config } from "dotenv";
import App from "./App.vue";
import router from "./router";
import store from "./store";

config();

console.log(process.env.KEY_MERCADO_PAGO);

createApp(App).use(store).use(router).mount("#app");
