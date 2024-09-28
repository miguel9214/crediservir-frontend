import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Importar Bootstrap CSS (si lo estás usando)
import 'bootstrap/dist/css/bootstrap.min.css';

// Crear la aplicación Vue
const app = createApp(App);

// Usar Vue Router y Vuex
app.use(router);
app.use(store);

// Montar la aplicación en el elemento con id "app"
app.mount('#app');
