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
            <router-link class="nav-link text-white" to="/home" @click.native="closeNavbar">Menu principal</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/tickest" @click.native="closeNavbar">Compra de entradas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/tickestList" @click.native="closeNavbar">Historial de compras</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/attendees" @click.native="closeNavbar">Asistentes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/events" @click.native="closeNavbar">Eventos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/categories" @click.native="closeNavbar">Categorias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/discounts" @click.native="closeNavbar">Codigos de descuento</router-link>
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
    },
    closeNavbar() {
      // Cierra el navbar al hacer clic en un enlace
      const navbar = document.getElementById('navbarNav');
      if (navbar.classList.contains('show')) {
        navbar.classList.remove('show');
      }
    }
  }
};
</script>

<style scoped>

.navbar {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}


.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: color 0.3s ease, transform 0.3s ease; 
  padding: 0.5rem 1rem; 
}

.nav-link:hover {
  color: #d4edda !important; 
  transform: translateY(-3px); 
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.navbar-toggler:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-toggler-icon {
  filter: invert(1);
}
</style>
