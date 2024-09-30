<template>
  <div class="container mt-5">
    <!-- Buscador -->
    <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-4 shadow-sm"
      placeholder="Buscar evento..."
    />
    <h2 class="mb-4">Eventos</h2>
    <button class="btn btn-success mb-3" @click="openModal">
      Crear Nuevo Evento
    </button>

    <table class="table table-striped table-responsive">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Título</th>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in filteredEvents" :key="event.id">
          <td>{{ index + 1 }}</td>
          <td>{{ event.title }}</td>
          <td>{{ event.date }}</td>
          <td>{{ event.description }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editEvent(event)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteEvent(event.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar eventos -->
    <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventModalLabel">{{ isEditing ? 'Editar Evento' : 'Crear Evento' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateEvent() : createEvent()">
              <div class="mb-3">
                <label for="title" class="form-label">Título</label>
                <input v-model="eventData.title" type="text" class="form-control" id="title" required />
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Fecha</label>
                <input v-model="eventData.date" type="date" class="form-control" id="date" required />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <textarea v-model="eventData.description" class="form-control" id="description" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      events: [],
      eventData: {
        title: '',
        date: '',
        description: ''
      },
      isEditing: false,
      currentEventId: null,
      searchQuery: ''
    };
  },
  computed: {
    filteredEvents() {
      if (!this.searchQuery) {
        return this.events;
      }
      return this.events.filter(event =>
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get('http://crediservir-api.test/api/events');
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events', error);
      }
    },
    openModal() {
      this.resetEventData();
      this.isEditing = false;
      const modalElement = document.getElementById('eventModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    resetEventData() {
      this.eventData = {
        title: '',
        date: '',
        description: ''
      };
    },
    async createEvent() {
      try {
        const response = await axios.post('http://crediservir-api.test/api/events', this.eventData);
        this.events.push(response.data.event);
        this.closeModal();
        Swal.fire('Éxito', 'Evento creado con éxito', 'success');
      } catch (error) {
        console.error('Error creating event', error);
        Swal.fire('Error', 'No se pudo crear el evento', 'error');
      }
    },
    editEvent(event) {
      this.eventData = { ...event };
      this.isEditing = true;
      this.currentEventId = event.id;
      const modalElement = document.getElementById('eventModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateEvent() {
      try {
        const response = await axios.put(`http://crediservir-api.test/api/events/${this.currentEventId}`, this.eventData);
        const index = this.events.findIndex(e => e.id === this.currentEventId);
        this.events[index] = response.data.event;
        this.closeModal();
        Swal.fire('Éxito', 'Evento actualizado con éxito', 'success');
      } catch (error) {
        console.error('Error updating event', error);
        Swal.fire('Error', 'No se pudo actualizar el evento', 'error');
      }
    },
    async deleteEvent(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este evento después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://crediservir-api.test/api/events/${id}`);
          this.events = this.events.filter(e => e.id !== id);
          Swal.fire('Eliminado!', 'El evento ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting event', error);
          Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
        }
      }
    },
    closeModal() {
      const modalElement = document.getElementById('eventModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px; /* Ancho máximo para el contenedor */
}

.table {
  background-color: #ffffff; /* Color de fondo de la tabla */
  border-radius: 0.5rem; /* Bordes redondeados */
  overflow: hidden; /* Esconde el desbordamiento */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.thead-dark th {
  background-color: #343a40; /* Fondo oscuro para el encabezado */
  color: white; /* Color de texto blanco */
}

.modal-content {
  border-radius: 0.5rem; /* Bordes redondeados para el modal */
}

.btn {
  transition: background-color 0.3s ease; /* Efecto de transición suave */
}
</style>
