<template>
  <div id="app">
    <!-- Mostrar el Navbar solo si la ruta actual no es /login o /register -->
    <Navbar v-if="!isAuthRoute" />
    <router-view /> <!-- Aquí se mostrarán los componentes de las rutas -->
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Navbar from './components/Navbar.vue'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();

    // Computed que revisa si la ruta actual es /login o /register
    const isAuthRoute = computed(() => {
      return route.path === '/login' || route.path === '/register';
    });

    return { isAuthRoute };
  },
};
</script>

<style>
/* Estilos globales (si los necesitas) */
</style>
