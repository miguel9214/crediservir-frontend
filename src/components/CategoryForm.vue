<template>
  <div class="container mt-5">
    <!-- Buscador -->
    <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-4 shadow-sm"
      placeholder="Buscar categoría por nombre..."
    />
    <h2 class="mb-4">Categorías</h2>
    
    <!-- Botón para abrir el modal de crear categoría -->
    <button class="btn btn-success mb-3" @click="openModal">Crear Nueva Categoría</button>

    <!-- Tabla de categorías -->
    <table class="table table-striped table-responsive table-bordered">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in filteredCategories" :key="category.id">
          <td>{{ index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editCategory(category)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteCategory(category.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar categorías -->
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categoryModalLabel">{{ isEditing ? 'Editar Categoría' : 'Crear Categoría' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateCategory() : createCategory()">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Nombre</label>
                <input type="text" id="categoryName" v-model="categoryName" class="form-control" required />
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
      categories: [], 
      categoryName: '', 
      isEditing: false, 
      currentCategoryId: null, 
      searchQuery: '', 
    };
  },
  mounted() {
    this.fetchCategories(); 
  },
  computed: {
    filteredCategories() {
      // Filtra las categorías según el texto de búsqueda
      return this.categories.filter((category) =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://crediservir-api.test/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    },
    openModal() {
      this.categoryName = '';
      this.isEditing = false;
      const modalElement = document.getElementById('categoryModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async createCategory() {
      try {
        const response = await axios.post('http://crediservir-api.test/api/categories', {
          name: this.categoryName,
        });
        this.categories.push(response.data.category);
        this.closeModal();
        Swal.fire('Éxito', 'Categoría creada con éxito', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo crear la categoría', 'error');
      }
    },
    editCategory(category) {
      this.categoryName = category.name;
      this.isEditing = true;
      this.currentCategoryId = category.id;
      const modalElement = document.getElementById('categoryModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateCategory() {
      try {
        const response = await axios.put(`http://crediservir-api.test/api/categories/${this.currentCategoryId}`, {
          name: this.categoryName,
        });
        const index = this.categories.findIndex((c) => c.id === this.currentCategoryId);
        this.categories[index] = response.data.category;
        this.closeModal();
        Swal.fire('Éxito', 'Categoría actualizada con éxito', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
      }
    },
    async deleteCategory(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar esta categoría después de eliminarla.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://crediservir-api.test/api/categories/${id}`);
          this.categories = this.categories.filter((c) => c.id !== id);
          Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
        }
      }
    },
    closeModal() {
      const modalElement = document.getElementById('categoryModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px; 
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
