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
          <span class="text-success">{{ selectedEvent.base_price }} COP</span>
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
          <label for="discountSelect" class="form-label">Códigos de descuento (opcional):</label>
          <select v-model="selectedDiscountIds" id="discountSelect" class="form-select shadow-sm" multiple>
            <option v-for="discount in discounts" :key="discount.id" :value="discount.id">
              {{ discount.code }} - {{ discount.discount_percentage }}%
            </option>
          </select>
        </div>

        <!-- Resumen de compra -->
        <div v-if="calculatedTotal !== null" class="mt-3 border-top pt-3">
          <h5>Resumen de Compra</h5>
          <p>
            Valor Base: <strong>{{ selectedEvent.base_price }} COP</strong>
          </p>
          <p v-if="ticketType !== 'free'">
            Valor Adicional: <strong>{{ additionalCost }} COP</strong>
          </p>
          <p v-if="selectedDiscountIds.length">
            Descuento Total: <strong>{{ appliedDiscountPercentage }}%</strong>
          </p>
          <p>
            <strong>Total: {{ calculatedTotal }} COP</strong>
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      events: [],
      discounts: [],
      selectedDiscountIds: [],
      selectedEventId: null,
      selectedEvent: null,
      attendees: [],
      selectedAttendeeId: null,
      ticketType: "free",
      purchaseMessage: "",
      additionalCost: 0,
      calculatedTotal: null,
      appliedDiscountPercentage: 0,
    };
  },
  mounted() {
    this.fetchEvents();
    this.fetchAttendees();
    this.fetchDiscounts();
  },
  watch: {
    selectedEventId(newVal) {
      if (newVal) {
        this.getEventDetails(newVal);
      } else {
        this.selectedEvent = null;
      }
    },
    ticketType() {
      this.calculateTotal();
    },
    selectedDiscountIds() {
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
        Swal.fire("Error", "No se pudo cargar los eventos", "error");
      }
    },
    async fetchAttendees() {
      try {
        const response = await axios.get("http://crediservir-api.test/api/attendees");
        this.attendees = response.data;
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar los asistentes", "error");
      }
    },
    async getEventDetails(eventId) {
      try {
        const response = await axios.get(`http://crediservir-api.test/api/events/${eventId}/details`);
        this.selectedEvent = response.data;
        this.calculateTotal();
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar los detalles del evento", "error");
      }
    },
    async fetchDiscounts() {
      try {
        const response = await axios.get("http://crediservir-api.test/api/discounts");
        this.discounts = response.data;
      } catch (error) {
        console.error("Error fetching discounts", error);
      }
    },
    calculateTotal() {
      if (!this.selectedEvent) return;

      const basePrice = parseFloat(this.selectedEvent.base_price);
      if (isNaN(basePrice)) {
        this.calculatedTotal = null;
        return;
      }

      let additional = 0;

      if (this.ticketType === "general") {
        additional = basePrice * 0.15;
      } else if (this.ticketType === "vip") {
        additional = basePrice * 0.3;
      }

      let total = basePrice + additional;
      let totalDiscountPercentage = 0;

      // Aplicar múltiples descuentos si se seleccionan varios códigos
      if (this.selectedDiscountIds.length > 0) {
        this.selectedDiscountIds.forEach((discountId) => {
          const selectedDiscount = this.discounts.find((discount) => discount.id === discountId);
          if (selectedDiscount) {
            totalDiscountPercentage += parseFloat(selectedDiscount.discount_percentage);
          }
        });
      }

      this.appliedDiscountPercentage = totalDiscountPercentage;

      // Aplicar descuento acumulado
      total -= total * (totalDiscountPercentage / 100);

      this.additionalCost = additional;
      this.calculatedTotal = Math.max(total, basePrice * 0.7).toFixed(2);
    },
    async purchaseTicket() {
      if (!this.selectedEventId || !this.selectedAttendeeId) {
        Swal.fire("Error", "Por favor, selecciona un evento y un asistente.", "error");
        return;
      }

      try {
        const payload = {
          attendee_id: this.selectedAttendeeId,
          ticket_type: this.ticketType,
          discount_codes: this.selectedDiscountIds.map(
            (discountId) => this.discounts.find((discount) => discount.id === discountId).code
          ),
        };

        const response = await axios.post(
          `http://crediservir-api.test/api/events/${this.selectedEventId}/purchase`,
          payload
        );

        this.purchaseMessage = response.data.message;
        await this.generatePDFReceipt(); // Generar el PDF
        Swal.fire("Éxito", this.purchaseMessage, "success");

        // Recargar los eventos y asistentes después de la compra
        await this.fetchEvents();
        await this.fetchAttendees();
        this.resetForm(); // Limpiar el formulario después de la compra
      } catch (error) {
        console.error("Error purchasing ticket", error);
        const errorMessage =
          error.response?.data?.message || "No se pudo completar la compra";
        Swal.fire("Error", errorMessage, "error");
      }
    },
    async generatePDFReceipt() {
      const doc = new jsPDF();
      const element = document.body;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 180, 160);
      doc.save("recibo.pdf");
    },
    resetForm() {
      this.selectedEventId = null;
      this.selectedAttendeeId = null;
      this.ticketType = "free";
      this.selectedDiscountIds = [];
      this.purchaseMessage = "";
      this.calculatedTotal = null;
      this.appliedDiscountPercentage = 0;
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
