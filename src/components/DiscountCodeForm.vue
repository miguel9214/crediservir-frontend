<template>
  <div class="container mt-5">
    <h2>Codigos de descuentos</h2>

    <!-- Buscador -->
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Buscar codigo por nombre..."
      />
    </div>

    <!-- Botón para abrir el modal de crear categoría -->
    <button class="btn btn-success mb-3" @click="openModal">
      Crear nuevo codigo
    </button>

    <!-- Tabla de categorías -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Codigo</th>
          <th>Porcentaje de descueto</th>
          <th>Desde</th>
          <th>Hasta</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(discount, index) in filteredDiscounts" :key="discount.id">
          <td>{{ index + 1 }}</td>
          <td>{{ discount.code }}</td>
          <td>{{ discount.discount_percentage }}</td>
          <td>{{ discount.valid_from }}</td>
          <td>{{ discount.valid_until }}</td>
          <td>{{ discount.status }}</td>

          <td>
            <button
              class="btn btn-warning me-2"
              @click="editDiscount(discount)"
            >
              Editar
            </button>
            <button class="btn btn-danger" @click="deleteDiscount(discount.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar categorías -->
    <div
      class="modal fade"
      id="discountModal"
      tabindex="-1"
      aria-labelledby="discountModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="discountModalLabel">
              {{ isEditing ? "Editar codigo" : "Crear codigo" }}
            </h5>
            <!-- El botón de cierre ya no tiene aria-hidden -->
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="isEditing ? updateDiscount() : createDiscount()"
            >
              <div class="mb-3">
                <label for="Code" class="form-label">Nombre del codigo</label>
                <input
                  type="text"
                  id="Code"
                  v-model="Code"
                  class="form-control"
                  required
                />
                <label for="Percentage" class="form-label"
                  >Porcentaje de descuento</label
                >
                <input
                  type="number"
                  id="Percentage"
                  v-model="Percentage"
                  class="form-control"
                  required
                />
                <label for="ValidFrom" class="form-label">Valido desde</label>
                <input
                  type="date"
                  id="ValidFrom"
                  v-model="ValidFrom"
                  class="form-control"
                  required
                />
                <label for="ValidUntil" class="form-label">Valido hasta</label>
                <input
                  type="date"
                  id="ValidUntil"
                  v-model="ValidUntil"
                  class="form-control"
                  required
                />

                <div class="mb-3">
                  <label for="Status" class="form-label">Estado</label>
                  <select v-model="Status" class="form-select" required>
                    <option value="1">ACTIVO</option>
                    <option value="0">INACTIVO</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Actualizar" : "Crear" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      discounts: [], // Lista de categorías
      Code:"",
      Percentage: "",
      ValidFrom: "",
      ValidUntil: "",
      Status: "", // Nombre de la categoría actual
      isEditing: false, // Estado de si se está editando o creando
      currentDiscountId: null, // ID de la categoría actual
      searchQuery: "", // Texto de búsqueda para el filtro
    };
  },
  mounted() {
    this.fetchDiscounts(); // Cargar categorías al montar el componente
  },
  computed: {
    filteredDiscounts() {
      // Filtra las categorías según el texto de búsqueda
      return this.discounts.filter((discount) =>
        discount.code.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchDiscounts() {
      try {
        const response = await axios.get(
          "http://crediservir-api.test/api/discounts"
        );
        this.discounts = response.data;
      } catch (error) {
        console.error("Error fetching discounts", error);
      }
    },
    openModal() {
      // Reinicia el formulario y abre el modal para crear una nueva categoría
      this.discountName = "";
      this.isEditing = false;
      const modalElement = document.getElementById("discountModal");
      const modal = new Modal(modalElement);
      modal.show();
    },
    async createDiscount() {
      try {
        const response = await axios.post(
          "http://crediservir-api.test/api/discounts",
          {
           code: this.Code,
           discount_percentage:this.Percentage,
           valid_from:this.ValidFrom,
           valid_until: this.ValidUntil,
           status:this.Status,
          }
        );
        this.discounts.push(response.data.discount); // Agrega la nueva categoría a la tabla
        this.closeModal();
        Swal.fire("Éxito", "Codigo creada con éxito", "success");
      } catch (error) {
        console.error("Error creating code", error);
        Swal.fire("Error", "No se pudo crear el codigo", "error");
      }
    },
    editDiscount(descount) {
      // Llena el formulario con los datos de la categoría seleccionada para editar
      this.discountName = descount.name;
      this.isEditing = true;
      this.currentDescountId = descount.id;
      const modalElement = document.getElementById("discountModal");
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateDiscount() {
      try {
        const response = await axios.put(
          `http://crediservir-api.test/api/discounts/${this.currentDescountId}`,
          {
            name: this.descountName,
          }
        );
        const index = this.descounts.findIndex(
          (c) => c.id === this.currentDescountId
        );
        this.discounts[index] = response.data.discount; // Actualiza la categoría en la tabla
        this.closeModal();
        Swal.fire("Éxito", "Codigo actualizado con éxito", "success");
      } catch (error) {
        console.error("Error updating Code", error);
        Swal.fire("Error", "No se pudo actualizar la categoría", "error");
      }
    },
    async deleteDiscount(id) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás recuperar esta codigo después de eliminarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://crediservir-api.test/api/discounts/${id}`);
          this.discounts = this.discounts.filter((c) => c.id !== id); // Elimina la categoría de la tabla
          Swal.fire("Eliminado!", "El codigo ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error deleting code", error);
          Swal.fire("Error", "No se pudo eliminar el codigo", "error");
        }
      }
    },
    closeModal() {
      // Cierra el modal
      const modalElement = document.getElementById("discountModal");
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
