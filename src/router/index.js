import { createRouter, createWebHashHistory } from 'vue-router';
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = false; // Cambia esto según tu lógica de autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
