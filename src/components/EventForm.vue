<template>
    <div class="container mt-5">
      <!-- Buscador -->
      <input type="text" v-model="searchQuery" class="form-control mb-3" placeholder="Buscar evento..." />
      <h2>Eventos</h2>
      <button class="btn btn-success mb-3" @click="openModal">Crear Nuevo Evento</button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in filteredEvents" :key="event.id">
            <td>{{ index + 1 }}</td>
            <td>{{ event.title }}</td>
            <td>{{ event.description }}</td>
            <td>{{ event.date }}</td>
            <td>{{ event.location }}</td>
            <td>{{ event.capacity }}</td>
            <td>
              <button class="btn btn-warning" @click="editEvent(event)">Editar</button>
              <button class="btn btn-danger" @click="deleteEvent(event.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal para crear/editar eventos -->
      <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="eventModalLabel">{{ isEditing ? 'Editar Evento' : 'Crear Evento' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="isEditing ? updateEvent() : createEvent()">
                <div class="mb-3">
                  <label for="title" class="form-label">Título</label>
                  <input type="text" v-model="eventData.title" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Descripción</label>
                  <textarea v-model="eventData.description" class="form-control" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="date" class="form-label">Fecha</label>
                  <input type="date" v-model="eventData.date" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="location" class="form-label">Lugar</label>
                  <input type="text" v-model="eventData.location" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="capacity" class="form-label">Capacidad</label>
                  <input type="number" v-model="eventData.capacity" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="type" class="form-label">Tipo</label>
                  <select v-model="eventData.type" class="form-select" required>
                    <option value="free">Gratuito</option>
                    <option value="paid">Pagado</option>
                  </select>
                </div>
                <div v-if="eventData.type === 'paid'" class="mb-3">
                  <label for="base_price" class="form-label">Precio Base</label>
                  <input type="number" v-model="eventData.base_price" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="category_id" class="form-label">Categoría</label>
                  <select v-model="eventData.category_id" class="form-select" required>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="registration_open" class="form-label">Apertura de Inscripción</label>
                  <input type="date" v-model="eventData.registration_open" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="registration_close" class="form-label">Cierre de Inscripción</label>
                  <input type="date" v-model="eventData.registration_close" class="form-control" required />
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
  import { Modal } from 'bootstrap';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        events: [],
        categories: [],
        eventData: {
          title: '',
          description: '',
          date: '',
          location: '',
          capacity: 0,
          type: 'free',
          base_price: null,
          category_id: null,
          registration_open: '',
          registration_close: ''
        },
        isEditing: false,
        currentEventId: null,
        searchQuery: '' // Inicializa searchQuery aquí
      };
    },
    mounted() {
      this.fetchEvents();
      this.fetchCategories();
    },
    computed: {
      filteredEvents() {
        if (!this.searchQuery) {
          return this.events;
        }
        return this.events.filter(event => 
          event.title && event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) // Verifica que title no sea undefined
        );
      }
    },
    methods: {
      async fetchEvents() {
        try {
          const response = await axios.get('http://crediservir-api.test/api/events');
          this.events = response.data;
        } catch (error) {
          console.error('Error fetching events', error);
          Swal.fire('Error', 'No se pudo cargar los eventos', 'error');
        }
      },
      async fetchCategories() {
        try {
          const response = await axios.get('http://crediservir-api.test/api/categories');
          this.categories = response.data;
        } catch (error) {
          console.error('Error fetching categories', error);
          Swal.fire('Error', 'No se pudo cargar las categorías', 'error');
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
          description: '',
          date: '',
          location: '',
          capacity: 0,
          type: 'free',
          base_price: null,
          category_id: null,
          registration_open: '',
          registration_close: ''
        };
      },
      async createEvent() {
        try {
          const response = await axios.post('http://crediservir-api.test/api/events', this.eventData);
          this.events.push(response.data.event); // Agrega el nuevo evento a la tabla
          this.closeModal();
          Swal.fire('Éxito', response.data.message, 'success');
        } catch (error) {
          console.error('Error creating event', error);
          const errorMessage = error.response?.data?.message || 'No se pudo crear el evento';
          Swal.fire('Error', errorMessage, 'error');
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
          this.events[index] = response.data.event; // Actualiza el evento en la tabla
          this.closeModal();
          Swal.fire('Éxito', response.data.message, 'success');
        } catch (error) {
          console.error('Error updating event', error);
          const errorMessage = error.response?.data?.message || 'No se pudo actualizar el evento';
          Swal.fire('Error', errorMessage, 'error');
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
            const response = await axios.delete(`http://crediservir-api.test/api/events/${id}`);
            this.events = this.events.filter(e => e.id !== id); // Elimina el evento de la tabla
            Swal.fire('Eliminado!', response.data.message, 'success');
          } catch (error) {
            console.error('Error deleting event', error);
            const errorMessage = error.response?.data?.message || 'No se pudo eliminar el evento';
            Swal.fire('Error', errorMessage, 'error');
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
  /* Puedes agregar estilos personalizados aquí */
  </style>
  