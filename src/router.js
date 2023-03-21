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
                path: '/formlayout',
                name: 'formlayout',
                component: () => import('./components/FormLayoutDemo.vue')
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
            {
                path: '/input',
                name: 'input',
                component: () => import('./components/InputDemo.vue')
            },
            {
                path: '/floatlabel',
                name: 'floatlabel',
                component: () => import('./components/FloatLabelDemo.vue')
            },
            {
                path: '/invalidstate',
                name: 'invalidstate',
                component: () => import('./components/InvalidStateDemo.vue')
            },
            {
                path: '/button',
                name: 'button',
                component: () => import('./components/ButtonDemo.vue')
            },
            {
                path: '/table',
                name: 'table',
                component: () => import('./components/TableDemo.vue')
            },
            {
                path: '/list',
                name: 'list',
                component: () => import('./components/ListDemo.vue')
            },
            {
                path: '/tree',
                name: 'tree',
                component: () => import('./components/TreeDemo.vue')
            },
            {
                path: '/panel',
                name: 'panel',
                component: () => import('./components/PanelsDemo.vue')
            },
            {
                path: '/overlay',
                name: 'overlay',
                component: () => import('./components/OverlayDemo.vue')
            },
            {
                path: '/media',
                name: 'media',
                component: () => import('./components/MediaDemo.vue')
            },
            {
                path: '/menu',
                component: () => import('./components/MenuDemo.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('./components/menu/PersonalDemo.vue')
                    },
                    {
                        path: '/menu/seat',
                        component: () => import('./components/menu/SeatDemo.vue')
                    },
                    {
                        path: '/menu/payment',
                        component: () => import('./components/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/menu/confirmation',
                        component: () => import('./components/menu/ConfirmationDemo.vue')
                    },
                ],
            },
            {
                path: '/messages',
                name: 'messages',
                component: () => import('./components/MessagesDemo.vue')
            },
            {
                path: '/file',
                name: 'file',
                component: () => import('./components/FileDemo.vue')
            },
            {
                path: '/chart',
                name: 'chart',
                component: () => import('./components/ChartDemo.vue')
            },
            {
                path: '/misc',
                name: 'misc',
                component: () => import('./components/MiscDemo.vue')
            },
            {
                path: '/crud',
                name: 'crud',
                component: () => import('./pages/CrudDemo.vue')
            },
            {
                path: '/nuevo-registro',
                name: 'registro',
                component: () => import('./pages/CrudDemo1.vue')
            },
            {
                path: '/timeline',
                name: 'timeline',
                component: () => import('./pages/TimelineDemo.vue')
            },
            {
                path: '/empty',
                name: 'empty',
                component: () => import('./components/EmptyPage.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('./components/Documentation.vue')
            },
            {
                path: '/blocks',
                name: 'blocks',
                component: () => import('./components/BlocksDemo.vue')
            },
            {
                path: '/icons',
                name: 'icons',
                component: () => import('./components/IconsDemo.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('./pages/LandingDemo.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./pages/Error.vue')
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: () => import('./pages/NotFound.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Access.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
