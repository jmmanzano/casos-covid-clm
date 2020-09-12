<template>
  <div class="container">
    <table class="table table-bordered table-striped table-responsive">
      <thead>
        <tr>
          <th v-for="cell in preparaCabecera()" :key="cell">{{cell}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(loc, idx) in preparaDatos()" :key="loc['nombre']">
          <td v-for="(cell, index) in loc" :key="idx+''+index">{{cell}}</td>
          <td></td>
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
export default class TablaProvincias extends Vue {
  preparaCabecera () {
    const semanas = data[0].lecturas.map(lec => lec.semana)
    const cabecera = ['Provincia', data[0].lecturasAct[0].semana].concat(semanas).concat('Detalle').flat()
    return cabecera
  }

  preparaDatos () {
    const tablaProvincias: any[] = []
    const provincias = [...new Set(data.map(lec => lec.provincia))]
    provincias.forEach(prov => {
      const arrayProvincia: any[] = []
      const localidadesProv = data.filter(loc => { return loc.provincia === prov })
      localidadesProv.forEach(loc => {
        const casos: any[] = loc.lecturasAct.map(lec => lec.casos)
        const casoUltima: any = loc.lecturas[loc.lecturas.length - 1].casos
        const fila: any[] = [loc.provincia].concat(casos).concat(casoUltima).flat()
        arrayProvincia.push(fila)
      })
      const arrayProvSuma: any[] = [prov]
      arrayProvincia.forEach(loc => {
        for (let i = 1; i < loc.length; i++) {
          if (arrayProvSuma[i] !== undefined) {
            arrayProvSuma[i] += parseInt(loc[i])
          } else {
            arrayProvSuma[i] = parseInt(loc[i])
          }
        }
      })
      tablaProvincias.push(arrayProvSuma)
    })
    return tablaProvincias
  }
}
</script>
