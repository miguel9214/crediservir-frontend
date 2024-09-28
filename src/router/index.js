import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import AdminPanel from '../components/AdminPanel.vue';
import EventForm from '../components/EventForm.vue';
import AttendeeForm from '../components/AttendeeForm.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

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
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    meta: { requiresAuth: true },
  },
  {
    path: '/events/new',
    name: 'new-event',
    component: EventForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/attendees/new',
    name: 'new-attendee',
    component: AttendeeForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
];
// Crear el router
const router = createRouter({
  history: createWebHistory(),  // Cambia a createWebHistory para eliminar el hash
  routes
});

// En tu archivo de configuración del router
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null; // Verifica si hay un token almacenado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' }); // Redirige a la página de inicio de sesión si no está autenticado
  } else {
    next(); // Continúa a la ruta solicitada
  }
});


export default router;