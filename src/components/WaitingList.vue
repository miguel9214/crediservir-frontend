<template>
    <div class="container mt-5">
      <!-- Buscador -->
      <input
        type="text"
        v-model="searchQuery"
        class="form-control mb-4 shadow-sm"
        placeholder="Busqueda por nombre de evento"
      />
      <h2 class="mb-4">Lista de espera</h2>
  
      <!-- Tabla de compras -->
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Evento</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Asistente</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(waiting, index) in filteredWaitings" :key="waiting.id">
              <td>{{ index + 1 }}</td>
              <td>{{ waiting.event.title }}</td>
              <td>{{ waiting.event.description }}</td>
              <td>{{ waiting.event.location }}</td>
              <td>{{ new Date(waiting.event.date).toLocaleDateString() }}</td>
              <td>{{ waiting.attendee.first_name }}</td>
              <td>{{ waiting.attendee.email }}</td>
              <td>{{ waiting.attendee.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="filteredWaitings.length === 0" class="alert alert-warning mt-3" role="alert">
        No hay compras registradas.
      </div>
    </div>
  </template>
  
  <script>
  import { useApi } from '@/composables/use-api';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        purchases: [],
        waitings:[],
        searchQuery: '', 
      };
    },
    mounted() {
      this.fetchWaiting();
    },
    computed: {
      filteredWaitings() {
        return this.waitings.filter((waiting) =>
          waiting.event.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {

      async fetchWaiting() {
        try {
          const response = await useApi('waitings');
          this.waitings = response;
        } catch (error) {
          console.error('Error fetching waiting list', error);
          Swal.fire('Error', 'No se pudo cargar la lista de espera', 'error');
        }
      }
    },
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
  
  .table td,
  .table th {
    font-size: 0.9rem; /* Tamaño reducido para que quepa mejor */
  }
  
  .thead-dark th {
    background-color: #343a40;
    color: white;
  }
  
  .table-responsive {
    max-height: 400px; /* Limita la altura máxima de la tabla */
    overflow-y: auto;
  }
  
  .alert {
    font-size: 1.2rem;
  }
  </style>
  