import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/welcome',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                {
                    path: '/login',
                    name: 'welcome-login',
                    component: () => import('@/views/welcome/LoginPage.vue')
                }, {
                    path: '/register',
                    name: 'welcome-register',
                    component: () => import('@/views/welcome/RegisterPage.vue')
                }, {
                    path: '/forget',
                    name: 'welcome-forget',
                    component: () => import('@/views/welcome/ForgetPage.vue')
                }
            ]
        },
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
            children: [
                {
                    path: '/manager',
                    name: 'manager',
                    component: () => import('@/views/manager/ServerManageView.vue')
                },
                {
                    path: '/add',
                    name: 'add',
                    component: () => import('@/views/manager/AddServerView.vue')
                },
                {
                    path: '/terminal',
                    name: 'terminal',
                    component: () => import('@/views/manager/TerminalView.vue')
                },
                {
                    path: "/serverDetails",
                    name: "serverDetails",
                    component: () => import("@/views/manager/ServerDetailsView.vue")
                },
                {
                    path: "userManager",
                    name: "userManager",
                    component: () => import("@/views/userManager/UserManagerView.vue")
                }
            ]
        }
    ],
})

export default router
