
<template>
  <div id="app">
      <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Casos Covid CLM</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <router-link class="nav-item nav-link" to="/">Localidades</router-link>
        <router-link class="nav-item nav-link" to="/provincias">Provincias</router-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default class App extends Vue {}
</script>
