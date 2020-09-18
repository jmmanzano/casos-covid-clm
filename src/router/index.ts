import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Mapa from '../views/Mapa.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Localidades',
    meta: { title: 'Casos por localidades' },
    component: Home
  },
  {
    path: '/provincias',
    name: 'Provincias',
    meta: { title: 'Casos por provincias' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Provincias.vue')
  },
  {
    path: '/mapa',
    name: 'Mapa',
    meta: { title: 'Mapa de casos' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Mapa
  }
]

const router = new VueRouter({
  routes
})

export default router
