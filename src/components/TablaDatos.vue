<template>
  <div class="container">
    <br />
    <h2>CASOS POR LOCALIDADES</h2>
    <br />
    <b-form-select v-model="provinciaSelect" :options="provincias" @change="filtraLocalidad()"></b-form-select>
    <hr />
      <b-form-input v-model="filtro" placeholder="Filtra por localidad" @keyup="filtraLocalidad()"></b-form-input>
    <br />
    <b-table
      class="tablaLocalidades"
      sticky-header
      :items="filtraLocalidad()"
      striped
      :fields="arrayCabecera"
      responsive
      head-variant="light"
    ></b-table>
    <hr />
    <p>
      Datos obtenidos de la web:
      <a
        href="https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios"
      >https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios</a>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as data from '../data/data.json'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component
export default class TablaDatos extends Vue {
  dataLocal: any
  arrayCabecera: Record<string, any>[] = [];
  cabecera: (string | number)[] = [];
  cuerpo: any[] = [];
  filtro = '';
  provinciaSelect = 'todas';
  provincias = [
    { value: 'todas', text: 'TODAS' },
    { value: 'Albacete', text: 'ALBACETE' },
    { value: 'Ciudad Real', text: 'CIUDAD REAL' },
    { value: 'Cuenca', text: 'CUENCA' },
    { value: 'Guadalajara', text: 'GUADALAJARA' },
    { value: 'Toledo', text: 'TOLEDO' }
  ];

  created () {
    this.dataLocal = data
    this.cabecera = this.preparaCabecera()
    this.cuerpo = this.preparaDatos()
  }

  preparaCabecera () {
    const semanas = this.dataLocal.default[0].lecturas.map((lec: { semana: { toString: () => any } }) => lec.semana.toString())
    const cabecera = [
      'Localidad',
      'Provincia',
      'Habitantes',
      this.dataLocal.default[0].lecturasAct[0].semana
    ]
      .concat(semanas)
      .concat('Acumulado')
      .concat('Tasa 14 dias')
      .flat()

    cabecera.forEach((propName, index) => {
      const objectCabecera: Record<string, any> = {}
      objectCabecera.key = propName.toString()
      objectCabecera.label = propName.toString()
      objectCabecera.sortable = true
      if (index === 0) {
        objectCabecera.stickyColumn = true
        objectCabecera.isRowHeader = true
      }
      this.arrayCabecera.push(objectCabecera)
    })
    return cabecera
  }

  preparaDatos () {
    const tablaLocCasosSemana: any[] = []
    this.dataLocal.default.forEach((loc: { lecturasAct: any[]; lecturas: string|any[]; habitantes: any; nombre: any; provincia: any }) => {
      const casos = loc.lecturasAct.map((lec) => lec.casos)
      const casoUltima = loc.lecturas[loc.lecturas.length - 1].casos
      const suma = casos.reduce((sum, caso) => sum + caso) + casoUltima
      const habi = loc.habitantes
      const casos14 = (casoUltima + casos[casos.length - 1]) * (100000 / habi)
      const fila: (string | number)[] = [
        loc.nombre,
        loc.provincia,
        parseInt(habi.toString())
      ]
        .concat(casos)
        .concat(casoUltima)
        .concat(suma)
        .concat(this.filterNumber(casos14))
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
    if (this.filtro === '' && this.provinciaSelect === 'todas') {
      return this.cuerpo
    } else if (this.filtro !== '' && this.provinciaSelect === 'todas') {
      const filtrado = this.cuerpo.filter((elem) => {
        return elem.Localidad.toUpperCase().includes(this.filtro.toUpperCase())
      })
      return filtrado
    } else if (this.filtro === '' && this.provinciaSelect !== 'todas') {
      const filtrado = this.cuerpo.filter((elem) => {
        return (
          elem.Provincia.toUpperCase() === this.provinciaSelect.toUpperCase()
        )
      })
      return filtrado
    } else {
      const filtrado = this.cuerpo.filter((elem) => {
        return (
          elem.Localidad.toUpperCase().includes(this.filtro.toUpperCase()) &&
          elem.Provincia.toUpperCase() === this.provinciaSelect.toUpperCase()
        )
      })
      return filtrado
    }
  }

  filterNumber (value: number) {
    return Math.round(value * 100) / 100
  }
}
</script>
<style lang="css" scoped>
.tablaLocalidades {
  max-height: 500px !important;
}
</style>
