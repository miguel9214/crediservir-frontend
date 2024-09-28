<template>
  <div id="app">
    <!-- Mostrar el Navbar solo si la ruta actual no es /login o /register -->
    <Navbar v-if="!isAuthRoute" />
    <router-view /> <!-- Este es el lugar donde se mostrarán los componentes de las rutas -->
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'; // Asegúrate de que la ruta sea correcta
import { computed } from 'vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const isAuthRoute = computed(() => {
      const currentRoute = window.location.pathname;
      return currentRoute === '/login' || currentRoute === '/register';
    });

    return { isAuthRoute };
  },
};
</script>

<style>
/* Estilos globales (si los necesitas) */
</style>
