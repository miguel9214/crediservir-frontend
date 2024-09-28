<template>
  <div class="container mt-5">
    <h1 class="text-center">Bienvenido a TuBoleta</h1>
    <p class="text-center lead">
      Una plataforma diseñada para facilitar la gestión de eventos y asistencia.
    </p>

    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card">
          <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Gestión de Eventos" />
          <div class="card-body">
            <h5 class="card-title">Gestión de Eventos</h5>
            <p class="card-text">
              Organiza y gestiona tus eventos de manera sencilla. Crea, edita y elimina eventos
              con solo unos clics.
            </p>
            <router-link to="/events/new" class="btn btn-primary">Crear Evento</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Gestión de Asistentes" />
          <div class="card-body">
            <h5 class="card-title">Gestión de Asistentes</h5>
            <p class="card-text">
              Administra la asistencia de los participantes en tus eventos. Mantén un control
              efectivo y fácil de acceder.
            </p>
            <router-link to="/attendees/new" class="btn btn-primary">Registrar Asistente</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Acerca de Nosotros" />
          <div class="card-body">
            <h5 class="card-title">Acerca de Nosotros</h5>
            <p class="card-text">
              Descubre más sobre nuestra misión y cómo estamos ayudando a las comunidades a
              organizar eventos exitosos.
            </p>
            <router-link to="/about" class="btn btn-primary">Leer Más</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.container {
  max-width: 800px; /* Ancho máximo para el contenedor */
}

.card {
  margin-bottom: 20px; /* Espaciado entre tarjetas */
}
</style>
