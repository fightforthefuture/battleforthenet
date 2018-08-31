<style lang="scss">
.event-map {
  position: absolute;
  top: 80px; // FIXME
  left: 0;
  bottom: 0;
  right: 0;
  width: 70%; // FIXME
}
</style>

<template>
  <div class="event-map" id="event-map"></div>
</template>

<script>
import settings from '~/config.json'

// the production build breaks when this stuff isn't global
// TODO: figure out why that is
let markers = []
let map
let zoomCount = 0

export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css'
        }
      ],
      script: [
        {
          src: 'https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js'
        }
      ]
    }
  },

  props: {
    events: Array
  },

  mounted() {
    console.log(this.events.length)
    this.createMap()
  },

  watch: {
    events() {
      this.addEventsToMap()
    },

    currentPin(newValue, oldValue) {
      console.log('Old currentPin:', oldValue)
      if (oldValue) {
        this.closePopup(oldValue)
      }
      console.log('New currentPin:', newValue)
      if (newValue) {
        this.openPopup(newValue)
      }
    },

    zoomLevel(newValue) {
      console.log('New zoom:', newValue)
      if (newValue) {
        this.zoomMap(newValue)
      }
    }
  },

  computed: {
    zoomLevel: {
      get() {
        console.log('getting zoomLevel:', this.$store.state.map.zoom)
        return this.$store.state.map.zoom
      },
      set(newVal) {
        console.log('setting zoomLevel:', newVal)
        this.$store.commit('setMapZoom', newVal)
      }
    },
    currentPin: {
      get() {
        console.log('getting currentPin:', this.$store.state.map.currentPin)
        return this.$store.state.map.currentPin
      },
      set(newVal) {
        console.log('setting currentPin:', newVal)
        this.$store.commit('setMapCurrentPin', newVal)
      }
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.map.${key}`)
    },

    createMap() {
      L.mapbox.accessToken = settings.mapboxToken

      // see https://www.mapbox.com/api-documentation/#introduction
      const mapId = 'mapbox.light'

      const mapboxTiles = L.tileLayer(`https://api.mapbox.com/v4/${mapId}/{z}/{x}/{y}.png?access_token=${L.mapbox.accessToken}`, {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })

      map = L.map('event-map', {
          scrollWheelZoom: false
        })
        .addLayer(mapboxTiles)

      map.on('zoomend', e => zoomCount++)
      map.on('zoom', this.updateZoomLevel)
      map.on('popupclose', this.clearCurrentPin)

      markers = []

      this.addEventsToMap()
    },

    addEventsToMap() {
      // TODO: check initial bounds on full page map
      if (this.events.length === 0) {
        map.setView([42.35, -71.08], 13)
        return
      }

      this.bounds = L.latLngBounds()

      for (let event of this.events) {
        this.addMarker(event)
      }

      map.fitBounds(this.bounds)
    },

    addMarker(event) {
      console.log('Add marker:', event)
      const ll = [event.latitude, event.longitude]

      let html = `<h5>${event.title}</h5>`

      if (event.category === 'event') {
        html += `<div class="date">${event.formatted_start_date }</div>`
      }

      html += `<div class="address"><address>${event.address}</address></div><a class="btn rsvp-btn" href="${event.url}" target="_blank">${this.$lt(`${event.category}_cta`)}</a>`

      const marker = L.marker(ll)
        .addTo(map)
        .bindPopup(html)

      marker.eventId = event.id
      marker.on('click', this.clickMarker)
      markers.push(marker)
      this.bounds.extend(ll)
    },

    clickMarker(event) {
      console.log('Click marker:', event)
      this.$store.commit('setMapCurrentPin', {
        id: event.target.eventId,
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        type: 'map-marker' // NOTE: to indicate possible incomplete information from map marker
      })
    },

    openPopup({ id }) {
      console.log('Open popup:', id)
      const marker = markers.find(m => m.eventId === id)
      if (marker) marker.openPopup()
    },

    closePopup({ id }) {
      console.log('Close popup:', id)
      const marker = markers.find(m => m.eventId === id)
      if (marker) marker.closePopup()
    },

    clearCurrentPin() {
      this.$store.commit('setMapCurrentPin', null)
    },

    updateZoomLevel() {
      this.$store.commit('setMapZoom', map.getZoom())
      console.log('updated zoom level', this.zoomLevel)
    },

    zoomMap(newZoom) {
      console.log('zooming map:', newZoom)
      // TODO: should this always center on the pin?
      const ll = this.currentPin ? [this.currentPin.latitude, this.currentPin.longitude] : map.getCenter()
      const zoom = newZoom

      console.log('set zoom:', ll, zoom)
      map.setView(ll, zoom)
    }
  }
}
</script>
