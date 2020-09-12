<template>
  <div >
    <TablaDatos/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TablaDatos from '@/components/TablaDatos.vue' // @ is an alias to /src
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
@Component({
  components: {
    TablaDatos
  }
})
export default class Home extends Vue {}
</script>
