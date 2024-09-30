<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand text-white fw-bold" href="#">Admin Panel</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/tickest">Purchase Tickets</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/attendees">Attendees</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/events">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/categories">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/discounts">Discount Codes</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a href="#" class="nav-link text-white" @click="logout">Logout</a>
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
      localStorage.removeItem('access_token');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
/* Estilo del navbar */
.navbar {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important; /* Degradado verde */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para profundidad */
}

/* Estilos del texto */
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: color 0.3s ease, transform 0.3s ease; /* Transición suave */
  padding: 0.5rem 1rem; /* Mejora del padding para una mejor usabilidad */
}

.nav-link:hover {
  color: #d4edda !important; /* Color al pasar el mouse */
  transform: translateY(-3px); /* Efecto de elevarse un poco al pasar el mouse */
}

/* Sombra en el botón de navegación cuando está colapsado */
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.navbar-toggler:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Aumentar el contraste del icono al colapsar */
.navbar-toggler-icon {
  filter: invert(1);
}
</style>
