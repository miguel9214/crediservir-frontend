<template>
  <div id="app">
    <!-- Mostrar el Navbar solo si la ruta actual no es /login o /register -->
    <Navbar v-if="!isAuthRoute" />
    <!-- Mostrar el main-content solo si la ruta actual no es /login o /register -->
    <div class="main-content" v-if="!isAuthRoute">
      <router-view /> 
    </div>
    <!-- Mostrar el contenido de las rutas de autenticación sin el main-content -->
    <router-view v-if="isAuthRoute" />
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();

    // Revisa si la ruta actual es /login o /register
    const isAuthRoute = computed(() => {
      return route.path === '/login' || route.path === '/register';
    });

    return { isAuthRoute };
  },
};
</script>

<style>
/* Estilo para el contenedor principal */
.main-content {
  padding-top: 70px; 
}
</style>
