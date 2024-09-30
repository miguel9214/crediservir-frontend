<template>
  <div id="app">
    <!-- Mostrar el Navbar solo si la ruta actual no es /login o /register -->
    <Navbar v-if="!isAuthRoute" />
    <div class="main-content">
      <router-view /> <!-- Aquí se mostrarán los componentes de las rutas -->
    </div>
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

/* Estilo para el contenedor principal */
.main-content {
  padding-top: 70px; /* Ajusta este valor según la altura de tu navbar */
}
</style>
