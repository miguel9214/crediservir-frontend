<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Bienvenido a TuBoleta</h1>
    <p class="text-center lead mb-5">
      Una plataforma diseñada para facilitar la gestión de eventos y asistencia.
    </p>

    <div class="row">
      <div class="col-md-4">
        <div class="card shadow border-0">
          <img
            src="../assets/tickets.jpg"
            class="card-img-top rounded-top"
            alt="Gestión de Eventos"
          />
          <div class="card-body">
            <h5 class="card-title text-primary">Comprar Ticket</h5>
            <p class="card-text">
              Disfruta de los mejores eventos y vive experiencias únicas. 
              ¡No esperes más para comprar tu entrada!
            </p>
            <router-link to="/tickets" class="btn btn-primary w-100">Comprar</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow border-0">
          <img
            src="../assets/events.jpg"
            class="card-img-top rounded-top"
            alt="Gestión de Eventos"
          />
          <div class="card-body">
            <h5 class="card-title text-success">Gestión de Eventos</h5>
            <p class="card-text">
              Organiza y gestiona tus eventos de manera sencilla. 
              Crea, edita y elimina eventos con solo unos clics.
            </p>
            <router-link to="/events" class="btn btn-success w-100">Crear Evento</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow border-0">
          <img
            src="../assets/attendee.jpg"
            class="card-img-top rounded-top"
            alt="Gestión de Asistentes"
          />
          <div class="card-body">
            <h5 class="card-title text-warning">Gestión de Asistentes</h5>
            <p class="card-text">
              Administra la asistencia de los participantes en tus eventos. 
              Mantén un control efectivo y fácil de acceder.
            </p>
            <router-link to="/attendees" class="btn btn-warning w-100">Registrar Asistente</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.container {
  max-width: 1200px; /* Ampliar el ancho máximo para un diseño más amplio */
}

.card {
  margin-bottom: 20px; /* Espaciado entre tarjetas */
  border-radius: 10px; /* Bordes redondeados */
  transition: transform 0.2s; /* Suavizar la transición al hacer hover */
}

.card:hover {
  transform: translateY(-5px); /* Efecto de elevación al pasar el mouse */
}

.card-title {
  font-weight: bold; /* Negrita para los títulos */
}

/* Cambios en botones para un efecto de hover más atractivo */
.btn {
  transition: background-color 0.3s, border-color 0.3s;
}

.btn:hover {
  opacity: 0.9; /* Efecto de desvanecimiento al pasar el mouse */
}
</style>
