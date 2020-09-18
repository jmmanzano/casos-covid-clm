<template>

  <div class="mapa">
    <l-map
      style="height: 80%; width: 100%"
      :zoom="zoom"
      :center="center"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-geo-json :geojson="municipiosLocal" :options="options" :options-style="styleFunction"></l-geo-json>
    </l-map>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { municipios } from '../data/municipios'
import { data } from '../data/data'
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
import { GeoJson } from '../interfaces/GeoJson'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'
import { Feature } from '@/interfaces/Feature'

@Component({
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  }
})
export default class MapaComponent extends Vue {
  municipiosLocal: GeoJson
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  zoom = 7
  center: number[] = [39.876019, -2.8]
  bounds = null
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

  get options () {
    return { onEachFeature: this.onEachFeatureFunction }
  }

  created () {
    this.municipiosLocal = municipios
    data.forEach(loc => {
      const semana = loc.listaSemanas[loc.listaSemanas.length - 1]
      const tasa14 = this.filterNumber((semana.casosSemanaActual + semana.casosSemanaAnterior) * (100000 / loc.habitantes))
      const municipios = this.municipiosLocal.features.find(mun => { return mun.properties.nomIne.trim().toLowerCase() === loc.nombre.trim().toLowerCase() })
      if (municipios !== undefined && loc.habitantes >= 1000) {
        municipios.properties.tasa14 = tasa14
      } else if (municipios !== undefined && loc.habitantes < 1000) {
        municipios.properties.tasa14 = -1
      } else {
        console.log(`Error en el nombre ${loc.nombre}`)
      }
    })
  }

  filterNumber (value: number) {
    return Math.round(value * 100) / 100
  }

  get onEachFeatureFunction () {
    return (feature: Feature, layer) => {
      if (feature.properties.tasa14 === undefined) {
        feature.properties.tasa14 = 'Sin datos'
      }
      layer.bindTooltip(`<div>Localidad: ${feature.properties.etiqueta}<hr/>Tasa contagios últimos 14 dias: ${feature.properties.tasa14}</div>`, { permanent: false, sticky: true })
    }
  }

  get styleFunction () {
    return (feature: Feature) => {
      const casos14 = feature.properties.tasa14
      let color = '#DBDBDB'
      if (casos14 === 0) {
        color = '#009AFA'
      } else if (casos14 > 0 && casos14 <= 50) {
        color = '#2df20c'
      } else if (casos14 > 50 && casos14 <= 100) {
        color = '#99d906'
      } else if (casos14 > 100 && casos14 <= 150) {
        color = '#ffc200'
      } else if (casos14 > 150 && casos14 <= 200) {
        color = '#ff6100'
      } else if (casos14 > 200 && casos14 <= 250) {
        color = '#ff3300'
      } else if (casos14 > 250 && casos14 <= 300) {
        color = '#ff0000'
      } else if (casos14 > 300 && casos14 <= 350) {
        color = '#ff003a'
      } else if (casos14 > 350 && casos14 <= 400) {
        color = '#ff0075'
      } else if (casos14 > 400 && casos14 <= 450) {
        color = '#ff009e'
      } else if (casos14 > 450 && casos14 <= 500) {
        color = '#74006d'
      } else if (casos14 > 500) {
        color = '#000000'
      }
      return {
        fillColor: color,
        color: color,
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
</style>
