<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-success">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tickest">Purchase tickets</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/attendees">Attendees</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/categories">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/discounts">Discount codes</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a href="#" class="nav-link" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    logout() {
      // Elimina el token de localStorage
      localStorage.removeItem('access_token');
      // Redirige a la página de login
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px; /* Espacio inferior */
}

.nav-link {
  color: white !important; /* Color de los enlaces */
}
</style>
