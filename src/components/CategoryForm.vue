<template>
  <div class="container mt-5">
    <h2>Categorías</h2>
    
    <!-- Buscador -->
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Buscar categoría por nombre..."
      />
    </div>

    <!-- Botón para abrir el modal de crear categoría -->
    <button class="btn btn-success mb-3" @click="openModal">Crear Nueva Categoría</button>

    <!-- Tabla de categorías -->
    <table class="table table-striped">
      <thead>
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
            <button class="btn btn-warning me-2" @click="editCategory(category)">Editar</button>
            <button class="btn btn-danger" @click="deleteCategory(category.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar categorías -->
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categoryModalLabel">{{ isEditing ? 'Editar Categoría' : 'Crear Categoría' }}</h5>
            <!-- El botón de cierre ya no tiene aria-hidden -->
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
      categories: [], // Lista de categorías
      categoryName: '', // Nombre de la categoría actual
      isEditing: false, // Estado de si se está editando o creando
      currentCategoryId: null, // ID de la categoría actual
      searchQuery: '', // Texto de búsqueda para el filtro
    };
  },
  mounted() {
    this.fetchCategories(); // Cargar categorías al montar el componente
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
        console.log(this.categories);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    },
    openModal() {
      // Reinicia el formulario y abre el modal para crear una nueva categoría
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
        this.categories.push(response.data.category); // Agrega la nueva categoría a la tabla
        this.closeModal();
        Swal.fire('Éxito', 'Categoría creada con éxito', 'success');
      } catch (error) {
        console.error('Error creating category', error);
        Swal.fire('Error', 'No se pudo crear la categoría', 'error');
      }
    },
    editCategory(category) {
      // Llena el formulario con los datos de la categoría seleccionada para editar
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
        this.categories[index] = response.data.category; // Actualiza la categoría en la tabla
        this.closeModal();
        Swal.fire('Éxito', 'Categoría actualizada con éxito', 'success');
      } catch (error) {
        console.error('Error updating category', error);
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
          this.categories = this.categories.filter((c) => c.id !== id); // Elimina la categoría de la tabla
          Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
        } catch (error) {
          console.error('Error deleting category', error);
          Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
        }
      }
    },
    closeModal() {
      // Cierra el modal
      const modalElement = document.getElementById('categoryModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
