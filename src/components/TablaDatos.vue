<template>
  <div class="container">
    <table class="table table-bordered table-striped table-responsive">
      <thead>
        <tr>
          <th v-for="cell in preparaCabecera()" :key="cell">{{cell}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(loc, idx) in preparaDatos()" :key="loc.nombre">
          <td v-for="(cell, index) in loc" :key="idx+''+index">{{cell}}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { data } from '../data/data'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component
export default class TablaDatos extends Vue {
  preparaCabecera () {
    const semanas = data[0].lecturas.map(lec => lec.semana)
    const cabecera = ['Localidad', 'Provincia', 'Habitantes', data[0].lecturasAct[0].semana].concat(semanas).concat('Acumulado').flat()
    return cabecera
  }

  preparaDatos () {
    const tablaLocCasosSemana: any[] = []
    data.forEach(loc => {
      const casos = loc.lecturasAct.map(lec => lec.casos)
      const casoUltima = loc.lecturas[loc.lecturas.length - 1].casos
      const suma = casos.reduce((sum, caso) => sum + caso) + casoUltima
      const fila = [loc.nombre, loc.provincia, loc.habitantes].concat(casos).concat(casoUltima).concat(suma).flat()
      tablaLocCasosSemana.push(fila)
    })
    return tablaLocCasosSemana
  }
}
</script>
