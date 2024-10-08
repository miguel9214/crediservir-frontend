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
            <router-link to="/tickest" class="btn btn-primary w-100">Comprar</router-link>
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
  max-width: 1200px; 
}

.card {
  margin-bottom: 20px; 
  border-radius: 10px; 
  transition: transform 0.2s; 
}

.card:hover {
  transform: translateY(-5px); 
}

.card-title {
  font-weight: bold; 
}


.btn {
  transition: background-color 0.3s, border-color 0.3s;
}

.btn:hover {
  opacity: 0.9; 
}
</style>
