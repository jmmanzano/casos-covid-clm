<template>
  <div >
    <MapaComponent/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MapaComponent from '@/components/MapaComponent.vue' // @ is an alias to /src
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
@Component({
  components: {
    MapaComponent
  }
})
export default class Mapa extends Vue {}
</script>
