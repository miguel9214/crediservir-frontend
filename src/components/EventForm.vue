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
          <th>Lugar</th>
          <th>Capacidad</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Apertura de Inscripción</th>
          <th>Cierre de Inscripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in filteredEvents" :key="event.id">
          <td>{{ index + 1 }}</td>
          <td>{{ event.title }}</td>
          <td>{{ event.date }}</td>
          <td>{{ event.description }}</td>
          <td>{{ event.location }}</td>
          <td>{{ event.capacity }}</td>
          <td>{{ event.type }}</td>
          <td>{{ event.type === 'free' ? '0.00' : event.base_price }}</td>
          <td>{{ event.registration_open }}</td>
          <td>{{ event.registration_close }}</td>

          <td>
            <button class="btn btn-warning btn-sm" @click="editEvent(event)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteEvent(event.id)">Eliminar</button>
            <router-link to="/tickest" class="btn btn-success btn-sm">Comprar</router-link>
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
              <div class="mb-3">
                <label for="location" class="form-label">Lugar</label>
                <input v-model="eventData.location" type="text" class="form-control" id="location" required />
              </div>
              <div class="mb-3">
                <label for="capacity" class="form-label">Capacidad</label>
                <input v-model="eventData.capacity" type="number" class="form-control" id="capacity" required />
              </div>
              <div class="mb-3">
                <label for="type" class="form-label">Tipo</label>
                <select v-model="eventData.type" class="form-control" id="type" required>
                  <option value="free">Gratuito</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>
              <div class="mb-3" v-if="eventData.type === 'paid'">
                <label for="base_price" class="form-label">Precio Base</label>
                <input v-model="eventData.base_price" type="number" step="0.01" class="form-control" id="base_price" required />
              </div>
              <!-- Campo de Categoría -->
              <div class="mb-3">
                <label for="category_id" class="form-label">Categoría</label>
                <select v-model="eventData.category_id" class="form-control" id="category_id" required>
                  <option value="">Seleccione una categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <!-- Apertura y Cierre de Inscripción -->
              <div class="mb-3">
                <label for="registration_open" class="form-label">Apertura de Inscripción</label>
                <input v-model="eventData.registration_open" type="date" class="form-control" id="registration_open" required />
              </div>
              <div class="mb-3">
                <label for="registration_close" class="form-label">Cierre de Inscripción</label>
                <input v-model="eventData.registration_close" type="date" class="form-control" id="registration_close" required />
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
      categories: [], 
      eventData: {
        title: '',
        date: '',
        description: '',
        location: '',
        capacity: '',
        type: 'free',
        base_price: '',
        category_id: '', 
        registration_open: '', 
        registration_close: '' 
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
    this.fetchCategories();
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
    async fetchCategories() {
      try {
        const response = await axios.get('http://crediservir-api.test/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories', error);
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
        description: '',
        location: '',
        capacity: '',
        type: 'free',
        base_price: '',
        category_id: '', 
        registration_open: '',
        registration_close: ''
      };
    },
    async createEvent() {
      try {
        if (this.eventData.type === 'free') {
          this.eventData.base_price = 0;
        }
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
        if (this.eventData.type === 'free') {
          this.eventData.base_price = 0;
        }
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
    async deleteEvent(eventId) {
      try {
        await axios.delete(`http://crediservir-api.test/api/events/${eventId}`);
        this.events = this.events.filter(event => event.id !== eventId);
        Swal.fire('Éxito', 'Evento eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error deleting event', error);
        Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
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
  max-width: 1200px; 
}

.table {
  background-color: #ffffff; 
  border-radius: 0.5rem; 
  overflow: hidden; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
}

.thead-dark th {
  background-color: #343a40; 
  color: white;
}

.modal-content {
  border-radius: 0.5rem; 
}

.btn {
  transition: background-color 0.3s ease;
}

</style>
