<template>
  <div class="container mt-5">
    <h2 class="mb-4">Compra de Boletos</h2>

    <!-- Selección del evento -->
    <div class="mb-3">
      <label for="eventSelect" class="form-label">Selecciona un evento:</label>
      <select v-model="selectedEventId" id="eventSelect" class="form-select">
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.title }} - Capacidades restantes: {{ event.capacity }}
        </option>
      </select>
    </div>

    <!-- Detalles del evento -->
    <div v-if="selectedEvent" class="card mt-4">
      <div class="card-body">
        <h3 class="card-title">Detalles del Evento</h3>
        <p class="card-text">
          Título: <strong>{{ selectedEvent.title }}</strong>
        </p>
        <p class="card-text">Descripción: {{ selectedEvent.description }}</p>
        <p class="card-text">Fecha: {{ selectedEvent.date }}</p>
        <p class="card-text">Ubicación: {{ selectedEvent.location }}</p>
        <p class="card-text">Precio Base: {{ selectedEvent.base_price }} USD</p>

        <!-- Selección de asistente -->
        <div class="mb-3">
          <label for="attendeeSelect" class="form-label">Selecciona un asistente:</label>
          <select v-model="selectedAttendeeId" id="attendeeSelect" class="form-select">
            <option v-for="attendee in attendees" :key="attendee.id" :value="attendee.id">
              {{ attendee.name }} - {{ attendee.email }}
            </option>
          </select>
        </div>

        <!-- Selección de tipo de boleto -->
        <div class="mb-3">
          <label for="ticketType" class="form-label">Tipo de boleto:</label>
          <select v-model="ticketType" id="ticketType" class="form-select" :disabled="isFreeTicket">
            <option value="free">Gratis</option>
            <option value="general">General</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <!-- Código de descuento -->
        <div class="mb-3">
          <label for="discountCode" class="form-label">Código de descuento (opcional):</label>
          <input v-model="discountCode" type="text" id="discountCode" class="form-control" />
        </div>

        <!-- Resumen de compra -->
        <div v-if="calculatedTotal !== null" class="mt-3">
          <h5>Resumen de Compra</h5>
          <p>Valor Base: {{ selectedEvent.base_price }} USD</p>
          <p v-if="ticketType !== 'free'">
            Valor Adicional: {{ additionalCost }} USD
          </p>
          <p>Total: {{ calculatedTotal }} USD</p>
        </div>

        <!-- Botón de compra -->
        <button @click="purchaseTicket" class="btn btn-primary">
          Comprar Boleto
        </button>

        <!-- Mensaje de compra -->
        <div v-if="purchaseMessage" class="alert alert-success mt-3" role="alert">
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
      selectedEventId: null,
      selectedEvent: null,
      attendees: [],
      selectedAttendeeId: null,
      ticketType: "free",
      discountCode: "",
      purchaseMessage: "",
      additionalCost: 0,
      calculatedTotal: null,
    };
  },
  mounted() {
    this.fetchEvents();
    this.fetchAttendees();
  },
  watch: {
    selectedEventId(newVal) {
      this.getEventDetails(newVal);
    },
    ticketType() {
      this.calculateTotal();
    },
    discountCode() {
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
        const response = await axios.get("http://crediservir-api.test/api/events");
        this.events = response.data;
      } catch (error) {
        console.error("Error fetching events", error);
        Swal.fire("Error", "No se pudo cargar los eventos", "error");
      }
    },
    async fetchAttendees() {
      try {
        const response = await axios.get("http://crediservir-api.test/api/attendees");
        this.attendees = response.data;
      } catch (error) {
        console.error("Error fetching attendees", error);
        Swal.fire("Error", "No se pudo cargar los asistentes", "error");
      }
    },
    async getEventDetails(eventId) {
      try {
        const response = await axios.get(`http://crediservir-api.test/api/events/${eventId}/details`);
        this.selectedEvent = response.data;
        this.calculateTotal(); // Calcular el total al seleccionar un evento
      } catch (error) {
        console.error("Error fetching event details", error);
        Swal.fire("Error", "No se pudo cargar los detalles del evento", "error");
      }
    },
    calculateTotal() {
      if (!this.selectedEvent) return;

      // Asegúrate de que base_price sea un número
      const basePrice = parseFloat(this.selectedEvent.base_price); // Convertir a float
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

      // Validar el código de descuento
      this.validateDiscountCode().then((discountedPrice) => {
        total = Math.max(discountedPrice, basePrice * 0.7); // Ajustar mínimo al 70%
        this.additionalCost = additional;
        this.calculatedTotal = total.toFixed(2); // Formatear el total a 2 decimales
      });
    },
    async validateDiscountCode() {
      let discount = 0;
      if (this.discountCode) {
        try {
          const response = await axios.post(`http://crediservir-api.test/api/discounts/validate`, {
            code: this.discountCode,
            event_id: this.selectedEventId,
          });
          discount = response.data.discount_percentage;
        } catch (error) {
          console.error("Error validating discount code", error);
          Swal.fire("Error", "Código de descuento no válido", "error");
        }
      }
      const basePrice = parseFloat(this.selectedEvent.base_price); // Asegúrate de convertir a float
      const additional = this.ticketType === "general" ? basePrice * 0.15 : this.ticketType === "vip" ? basePrice * 0.3 : 0;
      const discountedPrice = (basePrice + additional) * (1 - discount / 100);
      return discountedPrice;
    },
    async purchaseTicket() {
      if (!this.selectedEventId || !this.selectedAttendeeId) {
        Swal.fire("Error", "Por favor, selecciona un evento y un asistente.", "error");
        return;
      }

      try {
        // Realiza la petición de compra de ticket
        const response = await axios.post(`http://crediservir-api.test/api/events/${this.selectedEventId}/purchase`, {
          attendee_id: this.selectedAttendeeId,
          ticket_type: this.ticketType,
          discount_code: this.discountCode,
        });

        this.purchaseMessage = response.data.message;
        Swal.fire("Éxito", this.purchaseMessage, "success");

        // Actualiza la capacidad restante del evento
        this.getEventDetails(this.selectedEventId);

      } catch (error) {
        console.error("Error purchasing ticket", error);
        const errorMessage = error.response?.data?.message || "No se pudo completar la compra";
        Swal.fire("Error", errorMessage, "error");
      }
    }
  },
};
</script>

<style>
/* Puedes agregar aquí los estilos personalizados para el componente */
</style>
