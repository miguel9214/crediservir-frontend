<template>
  <div class="container mt-5">
    <!-- Buscador -->
    <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-4 shadow-sm"
      placeholder="Buscar compra por tipo de boleto..."
    />
    <h2 class="mb-4">Historial de Compras</h2>

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
            <th>Tipo Boleto</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Fecha Compra</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in filteredPurchases" :key="purchase.id">
            <td>{{ index + 1 }}</td>
            <td>{{ purchase.event.title }}</td>
            <td>{{ purchase.event.description }}</td>
            <td>{{ purchase.event.location }}</td>
            <td>{{ new Date(purchase.event.date).toLocaleDateString() }}</td>
            <td>{{ purchase.attendee.first_name }} {{ purchase.attendee.last_name }}</td>
            <td>{{ purchase.attendee.email }}</td>
            <td>{{ purchase.attendee.phone }}</td>
            <td>{{ purchase.ticket_type }}</td>
            <td>{{ purchase.price ? parseFloat(purchase.price).toFixed(2) : 'N/A' }} COP</td>
            <td>{{ purchase.discount_code || 'N/A' }}</td>
            <td>{{ new Date(purchase.purchase_date).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredPurchases.length === 0" class="alert alert-warning mt-3" role="alert">
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
      searchQuery: '', 
    };
  },
  mounted() {
    this.fetchPurchases();
  },
  computed: {
    filteredPurchases() {
      return this.purchases.filter((purchase) =>
        purchase.ticket_type.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchPurchases() {
      try {
        const response = await useApi('purchases');
        this.purchases = response;
      } catch (error) {
        console.error('Error fetching purchases', error);
        Swal.fire('Error', 'No se pudo cargar el historial de compras', 'error');
      }
    },
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
