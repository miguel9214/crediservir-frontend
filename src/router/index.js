import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import EventForm from '../components/EventForm.vue';
import AttendeeForm from '../components/AttendeeForm.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import CategoryForm from '@/components/CategoryForm.vue';
import TicketsForm from '@/components/PurchaseTicket.vue';
import DiscountCodeForm from '@/components/DiscountCodeForm.vue';
import TicketsList from '@/components/PurchaseList.vue';
import WaitingList from '@/components/WaitingList.vue';


const routes = [
  {
    path: '/',
    redirect: '/login', // Redirigir la ruta raíz a la página de login
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/events',
    name: 'events',
    component: EventForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/attendees',
    name: 'attendees',
    component: AttendeeForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories', // Ruta para crear una nueva categoría
    name: 'categories',
    component: CategoryForm,
    meta: { requiresAuth: true }, // Si necesitas autenticación
  },
  {
    path: '/discounts', // Ruta para crear una nueva categoría
    name: 'discounts',
    component: DiscountCodeForm,
    meta: { requiresAuth: true }, // Si necesitas autenticación
  },
  {
    path: '/tickest', // Ruta para crear una nueva categoría
    name: 'tickest',
    component: TicketsForm,
    meta: { requiresAuth: true }, // Si necesitas autenticación
  },
  {
    path: '/tickestList', // Ruta para crear una nueva categoría
    name: 'tickestList',
    component: TicketsList,
    meta: { requiresAuth: true }, // Si necesitas autenticación
  },
  {
    path: '/waitingList', // Ruta para crear una nueva categoría
    name: 'waitingList',
    component: WaitingList,
    meta: { requiresAuth: true }, // Si necesitas autenticación
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
];
// Crear el router
const router = createRouter({
  history: createWebHistory(), 
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null; // Verifica si hay un token almacenado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' }); // Redirige a la página de inicio de sesión si no está autenticado
  } else {
    next(); // Continúa a la ruta solicitada
  }
});


export default router;
