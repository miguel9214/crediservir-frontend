<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </form>
    <p class="mt-3">
      ¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // Estado para manejar el mensaje de error
    };
  },
  methods: {
    async login() {
      this.errorMessage = ''; // Reiniciar mensaje de error
      try {
        const response = await axios.post('http://crediservir-api.test/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        console.log('Login successful', response.data);
        // Almacenar el token (si lo necesitas)
        localStorage.setItem('access_token', response.data.access_token);
        
        // Redirigir a la ruta /admin
        this.$router.push('/admin');
      } catch (error) {
        console.error('Error logging in', error);
        // Establecer el mensaje de error
        this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
