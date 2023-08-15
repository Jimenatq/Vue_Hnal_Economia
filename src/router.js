import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('./components/Home.vue')
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('./components/Dashboard.vue')
            },
            {
                path: '/formulario',
                name: 'formulario',
                component: () => import('./components/FormularioRegistro.vue'),
                props: true
            },
            {
                path: '/listregistroip',
                name: 'listregistroip',
                component: () => import('./components/ListaIngresosPropios.vue')
            },
            {
                path: '/listregistrofr',
                name: 'listregistrofr',
                component: () => import('./components/ListaFondoRotatorio.vue')
            },
            {
                path: '/guia',
                name: 'guia',
                component: () => import('./components/GuiaUsuario.vue')
            },
            {
                path: '/supervisor',
                name: 'supervisor',
                component: () => import('./components/ModoSupervisor.vue')
            },
            {
                path: '/modulo0',
                name: 'modulo0',
                component: () => import('./components/Modulo0.vue')
            },
            {
                path: '/modulo1',
                name: 'modulo1',
                component: () => import('./components/Modulo1.vue')
            },
            {
                path: '/modulo2',
                name: 'modulo2',
                component: () => import('./components/Modulo2.vue')
            },
            {
                path: '/modulo3',
                name: 'modulo3',
                component: () => import('./components/Modulo3.vue')
            },
            {
                path: '/modulo4',
                name: 'modulo4',
                component: () => import('./components/Modulo4.vue')
            },
            {
                path: '/modulo5',
                name: 'modulo5',
                component: () => import('./components/Modulo5.vue')
            },
            {
                path: '/modulo6',
                name: 'modulo6',
                component: () => import('./components/Modulo6.vue')
            },
            {
                path: '/modulo7',
                name: 'modulo7',
                component: () => import('./components/Modulo7.vue')
            },
            {
                path: '/modulo8',
                name: 'modulo8',
                component: () => import('./components/Modulo8.vue')
            },
            {
                path: '/modulo9',
                name: 'modulo9',
                component: () => import('./components/Modulo9.vue')
            },
            {
                path: '/modulo10',
                name: 'modulo10',
                component: () => import('./components/Modulo10.vue')
            },
            {
                path: '/modulo11',
                name: 'modulo11',
                component: () => import('./components/Modulo11.vue')
            },
            {
                path: '/modulo12',
                name: 'modulo12',
                component: () => import('./components/Modulo12.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Access.vue')
    }
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
});

export default router;
