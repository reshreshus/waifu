import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import './styles/tailwind.css'
import "./style.sass";
import router from "./router/index.ts";

const app = createApp(App);

app.use(createPinia());
app.use(router)

app.mount("#app");
