/**
 * Vue Router configuration for the application.
 * This file defines the routes and their corresponding components.
 * It uses the `createRouter` and `createWebHistory` functions from Vue Router.
 */
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import('../components/HomePage.vue'), // using lazy loading for the component
    },
    {
        path: "/containers",
        name: "Containers",
        component: () => import('../components/ContainersPage.vue'),
    },
    {
        path: "/containers/:containerId",
        name: "ContainerDetail",
        component: () => import('../components/ContainerDetail.vue'),
    },
    {
        path: "/images",
        name: "Images",
        component: () => import('../components/ImagesPage.vue'),
    },
    {
        path: "/images/:imageId",
        name: "ImageDetail",
        component: () => import('../components/ImageDetail.vue'),
        props: true, // allows passing route params as props to the component
    },
    {
        path: "/volumes",
        name: "Volumes",
        component: () => import('../components/VolumesPage.vue'),
    },
    {
        path: "/networks",
        name: "Networks",
        component: () => import('../components/NetworksPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
