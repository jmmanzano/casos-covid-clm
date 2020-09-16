<template>
  <div class="container">
    <br>
    <h2>CASOS POR PROVINCIA</h2>
    <br>
    <b-table  :items="cuerpo" striped :fields="arrayCabecera" responsive head-variant="light"></b-table>
    <hr>
    <p>Datos obtenidos de la web: <a href="https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios">https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios</a></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { data } from '../data/data'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component
export default class TablaProvincias extends Vue {
  arrayCabecera: Record<string, any>[] = []
  cabecera: (string | number)[] = []
  cuerpo: any[] = []

  created () {
    this.cabecera = this.preparaCabecera()
    this.cuerpo = this.preparaDatos()
  }

  preparaCabecera () {
    const semanas = data[0].lecturas.map(lec => lec.semana)
    const cabecera = [
      'Provincia',
      'Habitantes',
      data[0].lecturasAct[0].semana]
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
    const tablaProvincias: any[] = []
    const provincias = [...new Set(data.map(lec => lec.provincia))]
    provincias.forEach(prov => {
      const arrayProvincia: any[] = []
      const localidadesProv = data.filter(loc => { return loc.provincia === prov })
      localidadesProv.forEach(loc => {
        const casos: any[] = loc.lecturasAct.map(lec => lec.casos)
        const casoUltima: any = loc.lecturas[loc.lecturas.length - 1].casos
        const suma = casos.reduce((sum, caso) => sum + caso) + casoUltima
        const habi = loc.habitantes.toString().includes('.') ? loc.habitantes * 1000 : loc.habitantes
        const casos14 = (casoUltima + casos[casos.length - 1])
        const fila: (string | number)[] = [
          loc.provincia]
          .concat(habi.toString())
          .concat(casos)
          .concat(casoUltima)
          .concat(suma)
          .concat(this.filterNumber(casos14).toString())
          .flat()
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
      const habitantesAcum = arrayProvSuma[1]
      const casos14Acum = arrayProvSuma[arrayProvSuma.length - 1]
      arrayProvSuma[arrayProvSuma.length - 1] = this.filterNumber(casos14Acum * (100000 / habitantesAcum))
      const filaObject: Record<string, any> = {}
      this.cabecera.forEach((propName, index) => {
        filaObject[propName] = arrayProvSuma[index]
      })
      tablaProvincias.push(filaObject)
      // tablaProvincias.push(arrayProvSuma)
    })
    // calculo el total
    const total: Record<string, any> = {}
    Object.assign(total, tablaProvincias[0])
    total['Tasa 14 dias'] = total['Tasa 14 dias'] * total.Habitantes
    for (let i = 1; i < tablaProvincias.length; i++) {
      const prov = tablaProvincias[i]
      this.cabecera.forEach((propName) => {
        if (propName === 'Tasa 14 dias') {
          total[propName] += prov[propName] * prov.Habitantes
        } else {
          total[propName] += prov[propName]
        }
      })
    }
    total.Provincia = 'TOTAL'
    total['Tasa 14 dias'] = this.filterNumber((total['Tasa 14 dias'] / total.Habitantes))
    tablaProvincias.push(total)
    return tablaProvincias
  }

  filterNumber (value: number) {
    return Math.round(value * 100) / 100
  }
}
</script>
