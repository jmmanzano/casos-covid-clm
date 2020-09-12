<template>
  <div >
    <TablaProvincias/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TablaProvincias from '@/components/TablaProvincias.vue' // @ is an alias to /src

@Component({
  components: {
    TablaProvincias
  }
})
export default class Provincias extends Vue {}
</script>
