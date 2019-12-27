import Vue from 'vue'
import Router from 'vue-router'
import Map from './views/Map.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'map',
      component: Map
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/mapEditor',
      name: 'MapEditor',
      component: () => import('./views/MapEditor.vue')
    }
  ]
})
