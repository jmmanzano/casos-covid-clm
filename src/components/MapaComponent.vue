<template>
  <div class="mapa container-fluid">

    <l-map style="height: 80%; width: 100%" :zoom="zoom" :center="center">
      <l-geo-json
        :geojson="municipiosLocal.default"
        :options="options"
        :options-style="styleFunction"
      ></l-geo-json>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
    <div class="container">
        <h5>Leyenda</h5>
        <span class="cuadro p-1" style="background-color: #DBDBDB"><small>Sin datos</small></span>
        <span class="cuadro p-1" style="background-color: #5abd30"><small>Tasa = 0</small></span>
        <span class="cuadro p-1" style="background-color: #80c82a"><small>0&lt;Tasa&lt;50</small></span>
        <span class="cuadro p-1" style="background-color: #aed324"><small>50&lt;Tasa&lt;100</small></span>
        <span class="cuadro p-1" style="background-color: #c8d820"><small>100&lt;Tasa&lt;150</small></span>
        <span class="cuadro p-1" style="background-color: #ded81c"><small>150&lt;Tasa&lt;200</small></span>
        <span class="cuadro p-1" style="background-color: #e4c418"><small>200&lt;Tasa&lt;250</small></span>
        <span class="cuadro p-1" style="background-color: #e9ae14"><small>250&lt;Tasa&lt;300</small></span>
        <span class="cuadro p-1" style="background-color: #ee960f"><small>300&lt;Tasa&lt;350</small></span>
        <span class="cuadro p-1" style="background-color: #f47a0a"><small>350&lt;Tasa&lt;400</small></span>
        <span class="cuadro p-1" style="background-color: #fa5d05"><small>400&lt;Tasa&lt;450</small></span>
        <span class="cuadro p-1" style="background-color: #ff3c00"><small>450&lt;Tasa&lt;500</small></span>
        <span class="cuadro p-1" style="background-color: #fa0528"><small>Tasa&gt;500</small></span>
        <hr style="clear: both" />
        <div >
    <p>Las localidades menores de 1000 habitantes solo cuentan con datos desde la semana 37</p>
    <p>
      Datos obtenidos de la web:
      <a
        href="https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios"
      >https://sanidad.castillalamancha.es/ciudadanos/enfermedades-infecciosas/coronavirus/evolucion-de-coronavirus-covid-19-en-castilla-la-mancha/evolucion-por-municipios</a>
    </p>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as municipios from '../data/municipios.json'
import * as data from '../data/data.json'
import { LMap, LTileLayer, LGeoJson, LControl } from 'vue2-leaflet'
import { GeoJson } from '../interfaces/GeoJson'
import { Feature } from '../interfaces/Feature'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'

@Component({
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  }
})
export default class MapaComponent extends Vue {
  municipiosLocal: any;
  dataLocal: any;
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  zoom = 7;
  center: number[] = [39.876019, -2.8];
  bounds = null;
  attribution =
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  get options () {
    return { onEachFeature: this.onEachFeatureFunction }
  }

  created () {
    this.municipiosLocal = municipios
    this.dataLocal = data
    this.dataLocal.default.forEach(
      (loc: {
        listaSemanas: string | any[];
        habitantes: number;
        nombre: string;
      }) => {
        const semana = loc.listaSemanas[loc.listaSemanas.length - 1]
        const tasa14 = this.filterNumber(
          (semana.casosSemanaActual + semana.casosSemanaAnterior) *
            (100000 / loc.habitantes)
        )
        const municipios = this.municipiosLocal.default.features.find(
          (mun: { properties: { nomIne: string } }) => {
            return (
              mun.properties.nomIne.trim().toLowerCase() ===
              loc.nombre.trim().toLowerCase()
            )
          }
        )
        if (municipios !== undefined && loc.habitantes >= 500) {
          municipios.properties.tasa14 = tasa14
          municipios.properties.pob2014 = loc.habitantes
          municipios.properties.ultimaSemana = semana
          if (semana.casosSemanaActual > semana.casosSemanaAnterior) {
            municipios.properties.estado = 'Los casos suben con respecto a la semana anterior'
          } else if (semana.casosSemanaActual < semana.casosSemanaAnterior) {
            municipios.properties.estado = 'Los casos bajan con respecto a la semana anterior'
          } else {
            municipios.properties.estado = 'Los casos se mantienen igual que la semana anterior'
          }
        } else if (municipios !== undefined && loc.habitantes < 500) {
          municipios.properties.tasa14 = -1
          municipios.properties.ultimaSemana = { semana: 'nd', casos: -1 }
        } else {
          console.log(`Error en el nombre ${loc.nombre}`)
        }
      }
    )
  }

  filterNumber (value: number) {
    return Math.round(value * 100) / 100
  }

  get onEachFeatureFunction () {
    return (feature: Feature, layer: any) => {
      if (feature.properties.tasa14 === undefined) {
        feature.properties.tasa14 = 'Sin datos'
      }
      if (feature.properties.ultimaSemana === undefined) {
        layer.bindTooltip(
          `<div><h5>${feature.properties.etiqueta}</h5><br/>Datos no proporcionados</div>`,
          { permanent: false, sticky: true }
        )
      } else {
        layer.bindTooltip(
          `<div><h5>${feature.properties.etiqueta}</h5>
     <b>${feature.properties.estado}<br></b>
        Habitantes: ${feature.properties.pob2014}<br>
        Casos última semana: ${feature.properties.ultimaSemana.casosSemanaActual}<br>
        Casos semana anterior: ${feature.properties.ultimaSemana.casosSemanaAnterior}
        <br>Tasa contagios últimos 14 dias: ${feature.properties.tasa14}</div>`,
          { permanent: false, sticky: true }
        )
      }
    }
  }

  get styleFunction () {
    return (feature: Feature) => {
      const casos14 = feature.properties.tasa14
      let color = '#DBDBDB'
      if (casos14 === 0) {
        color = '#5abd30'
      } else if (casos14 > 0 && casos14 <= 50) {
        color = '#80c82a'
      } else if (casos14 > 50 && casos14 <= 100) {
        color = '#aed324'
      } else if (casos14 > 100 && casos14 <= 150) {
        color = '#c8d820'
      } else if (casos14 > 150 && casos14 <= 200) {
        color = '#ded81c'
      } else if (casos14 > 200 && casos14 <= 250) {
        color = '#e4c418'
      } else if (casos14 > 250 && casos14 <= 300) {
        color = '#e9ae14'
      } else if (casos14 > 300 && casos14 <= 350) {
        color = '#ee960f'
      } else if (casos14 > 350 && casos14 <= 400) {
        color = '#f47a0a'
      } else if (casos14 > 400 && casos14 <= 450) {
        color = '#fa5d05'
      } else if (casos14 > 450 && casos14 <= 500) {
        color = '#ff3c00'
      } else if (casos14 > 500) {
        color = '#fa0528'
      }
      return {
        fillColor: color,
        color: '#000000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.5
      }
    }
  }
}
</script>
<style lang="css" scoped>
.mapa {
  height: 700px !important;
}
.cuadro{
float: left;
  border: 1px solid black
}
</style>
