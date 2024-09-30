<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Compra de Boletos</h2>

    <!-- Selección del evento -->
    <div class="mb-3">
      <label for="eventSelect" class="form-label">Selecciona un evento:</label>
      <select
        v-model="selectedEventId"
        id="eventSelect"
        class="form-select shadow-sm"
      >
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.title }} - Capacidades restantes: {{ event.capacity }}
        </option>
      </select>
    </div>

    <!-- Detalles del evento -->
    <div v-if="selectedEvent" class="card mt-4 shadow-lg border-light">
      <div class="card-body">
        <h3 class="card-title text-primary">{{ selectedEvent.title }}</h3>
        <p class="card-text">
          <strong>Descripción:</strong> {{ selectedEvent.description }}
        </p>
        <p class="card-text">
          <strong>Fecha:</strong> {{ selectedEvent.date }}<br />
          <strong>Ubicación:</strong> {{ selectedEvent.location }}<br />
          <strong>Precio Base:</strong>
          <span class="text-success">{{ selectedEvent.base_price }} USD</span>
        </p>

        <!-- Selección de asistente -->
        <div class="mb-3">
          <label for="attendeeSelect" class="form-label"
            >Selecciona un asistente:</label
          >
          <select
            v-model="selectedAttendeeId"
            id="attendeeSelect"
            class="form-select shadow-sm"
          >
            <option
              v-for="attendee in attendees"
              :key="attendee.id"
              :value="attendee.id"
            >
              {{ attendee.first_name }} - {{ attendee.email }}
            </option>
          </select>
        </div>

        <!-- Selección de tipo de boleto -->
        <div class="mb-3">
          <label for="ticketType" class="form-label">Tipo de boleto:</label>
          <select
            v-model="ticketType"
            id="ticketType"
            class="form-select shadow-sm"
            :disabled="isFreeTicket"
          >
            <option value="free">Gratis</option>
            <option value="general">General</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <!-- Código de descuento -->
        <div class="mb-3">
          <label for="discountSelect" class="form-label"
            >Código de descuento (opcional):</label
          >
          <select
            v-model="selectedDiscountId"
            id="discountSelect"
            class="form-select shadow-sm"
          >
            <option
              v-for="discount in discounts"
              :key="discount.id"
              :value="discount.id"
            >
              {{ discount.code }} - {{ discount.discount_percentage }}%
            </option>
          </select>
        </div>

        <!-- Resumen de compra -->
        <div v-if="calculatedTotal !== null" class="mt-3 border-top pt-3">
          <h5>Resumen de Compra</h5>
          <p>
            Valor Base: <strong>{{ selectedEvent.base_price }} USD</strong>
          </p>
          <p v-if="ticketType !== 'free'">
            Valor Adicional: <strong>{{ additionalCost }} USD</strong>
          </p>
          <p v-if="selectedDiscountId">
            Descuento: <strong>{{ appliedDiscountPercentage }}%</strong>
          </p>
          <p>
            <strong>Total: {{ calculatedTotal }} USD</strong>
          </p>
        </div>

        <!-- Botón de compra -->
        <button
          @click="purchaseTicket"
          class="btn btn-primary btn-lg mt-3 w-100"
        >
          Comprar Boleto
        </button>

        <!-- Mensaje de compra -->
        <div
          v-if="purchaseMessage"
          class="alert alert-success mt-3"
          role="alert"
        >
          {{ purchaseMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      events: [],
      discounts: [],
      selectedDiscountId: null,
      selectedEventId: null,
      selectedEvent: null,
      attendees: [],
      selectedAttendeeId: null,
      ticketType: "free",
      discountCode: "",
      purchaseMessage: "",
      additionalCost: 0,
      calculatedTotal: null,
      appliedDiscountPercentage: 0, // Para mostrar el porcentaje de descuento
    };
  },
  mounted() {
    this.fetchEvents();
    this.fetchAttendees();
    this.fetchDiscounts();
  },
  watch: {
    selectedEventId(newVal) {
      this.getEventDetails(newVal);
    },
    ticketType() {
      this.calculateTotal();
    },
    selectedDiscountId() {
      this.calculateTotal();
    },
  },
  computed: {
    isFreeTicket() {
      return this.selectedEvent && this.selectedEvent.base_price === 0;
    },
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get(
          "http://crediservir-api.test/api/events"
        );
        this.events = response.data;
      } catch (error) {
        console.error("Error fetching events", error);
        Swal.fire("Error", "No se pudo cargar los eventos", "error");
      }
    },
    async fetchAttendees() {
      try {
        const response = await axios.get(
          "http://crediservir-api.test/api/attendees"
        );
        this.attendees = response.data;
      } catch (error) {
        console.error("Error fetching attendees", error);
        Swal.fire("Error", "No se pudo cargar los asistentes", "error");
      }
    },
    async getEventDetails(eventId) {
      try {
        const response = await axios.get(
          `http://crediservir-api.test/api/events/${eventId}/details`
        );
        this.selectedEvent = response.data;
        this.calculateTotal(); // Calcular el total al seleccionar un evento
      } catch (error) {
        console.error("Error fetching event details", error);
        Swal.fire(
          "Error",
          "No se pudo cargar los detalles del evento",
          "error"
        );
      }
    },
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
    calculateTotal() {
      if (!this.selectedEvent) return;

      const basePrice = parseFloat(this.selectedEvent.base_price);
      if (isNaN(basePrice)) {
        this.calculatedTotal = null; // Restablecer total si basePrice es inválido
        return;
      }

      let additional = 0;

      if (this.ticketType === "general") {
        additional = basePrice * 0.15; // 15% adicional
      } else if (this.ticketType === "vip") {
        additional = basePrice * 0.3; // 30% adicional
      }

      let total = basePrice + additional;

      // Validar y aplicar el descuento seleccionado
      if (this.selectedDiscountId) {
        const selectedDiscount = this.discounts.find(
          (discount) => discount.id === this.selectedDiscountId
        );
        if (selectedDiscount) {
          const discountPercentage = selectedDiscount.discount_percentage;
          this.appliedDiscountPercentage = discountPercentage;
          total -= total * (discountPercentage / 100);
        }
      }

      // Asegurarse de que el total no sea menor al 70% del valor base
      this.additionalCost = additional;
      this.calculatedTotal = Math.max(total, basePrice * 0.7).toFixed(2);
    },
    async purchaseTicket() {
      if (!this.selectedEventId || !this.selectedAttendeeId) {
        Swal.fire(
          "Error",
          "Por favor, selecciona un evento y un asistente.",
          "error"
        );
        return;
      }

      try {
        const payload = {
          attendee_id: this.selectedAttendeeId,
          ticket_type: this.ticketType,
          discount_code: this.selectedDiscountId
            ? this.discounts.find(
                (discount) => discount.id === this.selectedDiscountId
              ).code
            : null,
        };

        const response = await axios.post(
          `http://crediservir-api.test/api/events/${this.selectedEventId}/purchase`,
          payload
        );

        this.purchaseMessage = response.data.message;
        Swal.fire("Éxito", this.purchaseMessage, "success");

        // Actualiza la capacidad restante del evento
        this.getEventDetails(this.selectedEventId);
      } catch (error) {
        console.error("Error purchasing ticket", error);
        const errorMessage =
          error.response?.data?.message || "No se pudo completar la compra";
        Swal.fire("Error", errorMessage, "error");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.02);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
