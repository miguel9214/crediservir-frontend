<template>
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" v-model="name" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <p class="mt-3">
        Inicia sesión <router-link to="/login">Aquí!</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://crediservir-api.test/api/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log('Registration successful', response.data);

        // Mostrar mensaje de éxito con SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'Registro exitoso!',
          text: 'Ahora puedes iniciar sesión.',
        });

        // Aquí puedes redirigir al usuario a la página de inicio de sesión o donde quieras
        this.$router.push('/login');
      } catch (error) {
        console.error('Error registering', error);

        // Mostrar mensaje de error con SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: error.response.data.message || 'Por favor, inténtalo de nuevo.',
        });
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
