<template>
  <div class="container">
    <br>
    <h2>CASOS POR LOCALIDADES</h2>
    <br>
    <b-form-input v-model="filtro" placeholder="Filtra por localidad" keyup="filtraLocalidad()"></b-form-input>
    <br>
    <b-table  :items="filtraLocalidad()" striped :fields="arrayCabecera" responsive head-variant="light"></b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { data } from '../data/data'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component({
  filters: {
    filterNumber (value: number) {
      return Math.round(value * 100) / 100
    }
  }
})
export default class TablaDatos extends Vue {
  arrayCabecera: Record<string, any>[] = []
  cabecera: (string | number)[] = []
  cuerpo: any[] = []
  filtro = ''

  created () {
    this.cabecera = this.preparaCabecera()
    this.cuerpo = this.preparaDatos()
  }

  preparaCabecera () {
    const semanas = data[0].lecturas.map((lec) => lec.semana.toString())
    const cabecera = [
      'Localidad',
      'Provincia',
      'Habitantes',
      data[0].lecturasAct[0].semana
    ]
      .concat(semanas)
      .concat('Acumulado')
      .concat('Tasa 15 dias')
      .flat()

    cabecera.forEach((propName, index) => {
      const objectCabecera: Record<string, any> = {}
      objectCabecera.key = propName.toString()
      objectCabecera.label = propName.toString()
      objectCabecera.sortable = true
      this.arrayCabecera.push(objectCabecera)
    })
    return cabecera
  }

  preparaDatos () {
    const tablaLocCasosSemana: any[] = []
    data.forEach((loc) => {
      const casos = loc.lecturasAct.map((lec) => lec.casos)
      const casoUltima = loc.lecturas[loc.lecturas.length - 1].casos
      const suma = casos.reduce((sum, caso) => sum + caso) + casoUltima
      const habi = loc.habitantes.toString().includes('.') ? loc.habitantes * 1000 : loc.habitantes
      const casos15 = (casoUltima + casos[casos.length - 1]) * (100000 / habi)
      const fila: (string | number)[] = [loc.nombre, loc.provincia, parseInt(habi.toString())]
        .concat(casos)
        .concat(casoUltima)
        .concat(suma)
        .concat(this.filterNumber(casos15))
        .flat()
      const filaObject: Record<string, any> = {}
      this.cabecera.forEach((propName, index) => {
        filaObject[propName] = fila[index]
      })
      tablaLocCasosSemana.push(filaObject)
    })
    return tablaLocCasosSemana
  }

  filtraLocalidad () {
    if (this.filtro === '') {
      return this.cuerpo
    } else {
      console.log(this.cuerpo)
      const filtrado = this.cuerpo.filter(elem => { return elem.Localidad.toUpperCase().includes(this.filtro.toUpperCase()) })
      console.log(filtrado)
      return filtrado
    }
  }

  filterNumber (value: number) {
    return Math.round(value * 100) / 100
  }
}
</script>
