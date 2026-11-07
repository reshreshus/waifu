import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import './styles/tailwind.css'
import "./style.sass";

const app = createApp(App);

app.use(createPinia());

app.mount("#app");
