<template>
  <div class="container mt-5">
    <!-- Buscador -->
    <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-4 shadow-sm"
      placeholder="Buscar asistente..."
    />
    <h2 class="mb-4">Asistentes</h2>
    <button class="btn btn-success mb-3" @click="openModal">
      Crear Nuevo Asistente
    </button>

    <table class="table table-striped table-responsive table-bordered">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(attendee, index) in filteredAttendees" :key="attendee.id">
          <td>{{ index + 1 }}</td>
          <td>{{ attendee.first_name }}</td>
          <td>{{ attendee.last_name }}</td>
          <td>{{ attendee.email }}</td>
          <td>{{ attendee.phone }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editAttendee(attendee)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteAttendee(attendee.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar asistentes -->
    <div class="modal fade" id="attendeeModal" tabindex="-1" aria-labelledby="attendeeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="attendeeModalLabel">{{ isEditing ? 'Editar Asistente' : 'Crear Asistente' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateAttendee() : createAttendee()">
              <div class="mb-3">
                <label for="first_name" class="form-label">Nombre</label>
                <input v-model="attendeeData.first_name" type="text" class="form-control" id="first_name" required />
              </div>
              <div class="mb-3">
                <label for="last_name" class="form-label">Apellido</label>
                <input v-model="attendeeData.last_name" type="text" class="form-control" id="last_name" required />
              </div>
              <div class="mb-3">
                <label for="birth_date" class="form-label">Fecha de Nacimiento</label>
                <input v-model="attendeeData.birth_date" type="date" class="form-control" id="birth_date" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Correo</label>
                <input v-model="attendeeData.email" type="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Teléfono</label>
                <input v-model="attendeeData.phone" type="text" class="form-control" id="phone" required />
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
      attendees: [],
      attendeeData: {
        first_name: '',
        last_name: '',
        birth_date: '',
        email: '',
        phone: ''
      },
      isEditing: false,
      currentAttendeeId: null,
      searchQuery: ''
    };
  },
  computed: {
    filteredAttendees() {
      if (!this.searchQuery) {
        return this.attendees;
      }
      return this.attendees.filter(attendee =>
        attendee.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        attendee.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchAttendees();
  },
  methods: {
    async fetchAttendees() {
      try {
        const response = await axios.get('http://crediservir-api.test/api/attendees');
        this.attendees = response.data;
      } catch (error) {
        console.error('Error fetching attendees', error);
      }
    },
    openModal() {
      this.resetAttendeeData();
      this.isEditing = false;
      const modalElement = document.getElementById('attendeeModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    resetAttendeeData() {
      this.attendeeData = {
        first_name: '',
        last_name: '',
        birth_date: '',
        email: '',
        phone: ''
      };
    },
    async createAttendee() {
      try {
        const response = await axios.post('http://crediservir-api.test/api/attendees', this.attendeeData);
        this.attendees.push(response.data.attendee);
        this.closeModal();
        Swal.fire('Éxito', 'Asistente creado con éxito', 'success');
      } catch (error) {
        console.error('Error creating attendee', error);
        Swal.fire('Error', 'No se pudo crear el asistente', 'error');
      }
    },
    editAttendee(attendee) {
      this.attendeeData = { ...attendee };
      this.isEditing = true;
      this.currentAttendeeId = attendee.id;
      const modalElement = document.getElementById('attendeeModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateAttendee() {
      try {
        const response = await axios.put(`http://crediservir-api.test/api/attendees/${this.currentAttendeeId}`, this.attendeeData);
        const index = this.attendees.findIndex(a => a.id === this.currentAttendeeId);
        this.attendees[index] = response.data.attendee;
        this.closeModal();
        Swal.fire('Éxito', 'Asistente actualizado con éxito', 'success');
      } catch (error) {
        console.error('Error updating attendee', error);
        Swal.fire('Error', 'No se pudo actualizar el asistente', 'error');
      }
    },
    async deleteAttendee(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este asistente después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://crediservir-api.test/api/attendees/${id}`);
          this.attendees = this.attendees.filter(a => a.id !== id);
          Swal.fire('Eliminado!', 'El asistente ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting attendee', error);
          Swal.fire('Error', 'No se pudo eliminar el asistente', 'error');
        }
      }
    },
    closeModal() {
      const modalElement = document.getElementById('attendeeModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px; 
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
