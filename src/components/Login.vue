<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-lg p-4" style="width: 400px;">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="custom-input form-control"
            placeholder="name@example.com"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="custom-input form-control"
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
        
        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
          {{ errorMessage }}
        </div>
      </form>

      <p class="text-center mt-3">
        ¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
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
        
        // Redirigir a la ruta /home
        this.$router.push('/home');
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
.d-flex {
  min-height: 100vh;
}

.card {
  border-radius: 10px;
}

h2 {
  font-weight: bold;
  color: #333;
}

p {
  font-size: 0.9rem;
}

/* Estilos personalizados para los inputs */
.custom-input {
  border: 2px solid #ced4da;
  border-radius: 10px;
  background-color: #f8f9fa;
  padding: 12px;
  font-size: 1rem;
  color: #495057;
  transition: all 0.3s ease;
}

/* Cambio de estilo cuando el input está enfocado */
.custom-input:focus {
  border-color: #6cbf8a; /* Color al hacer foco */
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(108, 191, 138, 0.5);
  outline: none;
}

/* Estilo para el placeholder */
.custom-input::placeholder {
  color: #adb5bd;
}

/* Mejorando el aspecto del botón */
.btn {
  padding: 12px;
  font-size: 1.1rem;
}
</style>
