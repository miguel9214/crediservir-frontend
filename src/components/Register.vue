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
        Inicia sesion <router-link to="/login">Aqui!</router-link>
      </p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
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
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        } catch (error) {
          console.error('Error registering', error);
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
  