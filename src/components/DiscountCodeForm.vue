<template>
  <div class="container mt-5">
    <h2>Códigos de descuento</h2>

    <!-- Buscador -->
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Buscar código por nombre..."
      />
    </div>

    <!-- Botón para abrir el modal de crear código -->
    <button class="btn btn-success mb-3" @click="openModal">
      Crear nuevo código
    </button>

    <!-- Tabla de códigos -->
    <table class="table table-striped table-responsive">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Código</th>
          <th>Porcentaje de descuento</th>
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
          <td>{{ discount.discount_percentage }}%</td>
          <td>{{ discount.valid_from }}</td>
          <td>{{ discount.valid_until }}</td>
          <td>{{ discount.status ? 'ACTIVO' : 'INACTIVO' }}</td>
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

    <!-- Modal para crear/editar código -->
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
              {{ isEditing ? "Editar código" : "Crear código" }}
            </h5>
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
                <label for="Code" class="form-label">Código</label>
                <input
                  type="text"
                  id="Code"
                  v-model="Code"
                  class="form-control"
                  required
                />
                <label for="Percentage" class="form-label">Porcentaje de descuento</label>
                <input
                  type="number"
                  id="Percentage"
                  v-model="Percentage"
                  class="form-control"
                  required
                />
                <label for="ValidFrom" class="form-label">Válido desde</label>
                <input
                  type="date"
                  id="ValidFrom"
                  v-model="ValidFrom"
                  class="form-control"
                  required
                />
                <label for="ValidUntil" class="form-label">Válido hasta</label>
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
      discounts: [],
      Code: "",
      Percentage: "",
      ValidFrom: "",
      ValidUntil: "",
      Status: "1", // Por defecto, el estado es "ACTIVO"
      isEditing: false,
      currentDiscountId: null,
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchDiscounts();
  },
  computed: {
    filteredDiscounts() {
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
      this.resetForm();
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
            discount_percentage: this.Percentage,
            valid_from: this.ValidFrom,
            valid_until: this.ValidUntil,
            status: this.Status,
          }
        );
        this.discounts.push(response.data.discount);
        this.closeModal();
        Swal.fire("Éxito", "Código creado con éxito", "success");
      } catch (error) {
        console.error("Error creating code", error);
        Swal.fire("Error", "No se pudo crear el código", "error");
      }
    },
    editDiscount(discount) {
      this.Code = discount.code;
      this.Percentage = discount.discount_percentage;
      this.ValidFrom = discount.valid_from;
      this.ValidUntil = discount.valid_until;
      this.Status = discount.status;
      this.isEditing = true;
      this.currentDiscountId = discount.id;
      const modalElement = document.getElementById("discountModal");
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateDiscount() {
      try {
        const response = await axios.put(
          `http://crediservir-api.test/api/discounts/${this.currentDiscountId}`,
          {
            code: this.Code,
            discount_percentage: this.Percentage,
            valid_from: this.ValidFrom,
            valid_until: this.ValidUntil,
            status: this.Status,
          }
        );
        const index = this.discounts.findIndex(
          (c) => c.id === this.currentDiscountId
        );
        this.discounts[index] = response.data.discount;
        this.closeModal();
        Swal.fire("Éxito", "Código actualizado con éxito", "success");
      } catch (error) {
        console.error("Error updating code", error);
        Swal.fire("Error", "No se pudo actualizar el código", "error");
      }
    },
    async deleteDiscount(id) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás recuperar este código después de eliminarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://crediservir-api.test/api/discounts/${id}`);
          this.discounts = this.discounts.filter((c) => c.id !== id);
          Swal.fire("Eliminado!", "El código ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error deleting code", error);
          Swal.fire("Error", "No se pudo eliminar el código", "error");
        }
      }
    },
    resetForm() {
      this.Code = "";
      this.Percentage = "";
      this.ValidFrom = "";
      this.ValidUntil = "";
      this.Status = "1";
    },
    closeModal() {
      const modalElement = document.getElementById("discountModal");
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    },
  },
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
