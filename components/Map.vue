<style lang="scss">
$btn-color: lighten(#544090, 20%);
$map-pin-bg-color: transparentize(#000, 0.1);

.leaflet-container {
  font-family: $body-font;
  color: $body-color;
}

.is-rounded {
  border-radius: $border-radius;
}

.event-map {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;

  .btn {
    padding: 7px 14px;
    border: 1px solid transparent;
    background-color: transparent;
    font-size: 1.2rem;
    transition: all .2s;
  }

  address {
    font-style: normal;
    white-space: pre-line;
  }

  .address, .date {
    display: flex;
    align-items: center;
    justify-content: left;
    margin: 0.5rem 0;
    line-height: 1.1;
    color: darken($body-color, 20%);

    img {
      height: 1.5rem;
      margin-right: 0.5rem;
    }

    &:before {
      content: "";
      background-image: url("~/assets/images/map-pin.svg");
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      padding: 0.75rem;
    }
  }

  .date:before {
    background-image: url("~/assets/images/calendar.svg");
  }

  .leaflet-popup-close-button {
    color: $body-color;
    text-indent: 0;

    &:hover {
      background-color: transparent;
    }
  }

  .leaflet-popup-tip {
    border-top: 10px solid transparent;
  }

  .leaflet-popup-content {
    font-size: 1.3rem;
    line-height: 1.5;
    font-family: $body-font;
    color: $body-color;

    h5 {
      margin-bottom: 0;
    }

    .address {
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
    }
  }
}

// Themes
.theme-default {
  .btn {
    border-color: $btn-color;
    color:        $btn-color;

    &:hover {
      border-color: rgba($btn-color, 0.75);
      color:        rgba($btn-color, 0.75);
    }
  }

  .leaflet-popup-content-wrapper {
    background-color: #241e31;
  }

  .leaflet-popup-tip {
    border-top-color: #241e31;
  }
}

.theme-generic {
  .btn {
    border-color: $body-color;
    color:        $body-color;

    &:hover {
      border-color: transparentize($body-color, 0.25);
      color:        transparentize($body-color, 0.25);
    }
  }

  .leaflet-popup-content-wrapper {
    background-color: $map-pin-bg-color;
  }

  .leaflet-popup-tip {
    border-top-color: $map-pin-bg-color;
  }
}

</style>

<template>
  <div id="js-event-map"
       class="event-map"
       :class="[`theme-${theme}`, {'is-rounded': isStandalone}]">
  </div>
</template>

<script>
// SETUP:
//
// In store/index.js requires:
//
// ```
// map: {
//   zoom: null,
//   currentPin: null
// }
// ```
//
// In package.json dependencies requires: `"leaflet": "^1.3.1"`
//
// In the `map.yml` file add `${event.category}_cta` text for all categories

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
    events: Array,
    theme: {
      type: String,
      default: 'default'
    },
    isStandalone: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      mapCreated: false,
    }
  },

  mounted() {
    console.log('[Map mounted] events', this.events.length)
    if (!this.mapCreated && this.events.length) {
      this.createMap()
      this.addEventsToMap()
    }
  },

  watch: {
    events(newValue) {
      console.log('[Map watch] events', newValue.length)
      if(newValue.length) {
        if (!this.mapCreated) {
          this.createMap()
        }

        this.addEventsToMap()
      }
    },

    // Watchers for computed props
    // These do not cause a re-render when the values from the store change
    // because the props are not present in the template, if they were the map
    // tiles would unload
    currentPin(newValue, oldValue) {
      console.log('[Map watch] currentPin triggered')
      if (oldValue) {
        // Close popup only if the "new" current pin is legitimately different
        if (this.currentPin === null || this.currentPin.id !== oldValue.id) {
          console.log('[Map watch] currentPin new (triggers close)', this.currentPin, oldValue)
          this.closePopup(oldValue)
        }
      }
      if (newValue) {
        console.log('[Map watch] currentPin new (triggers open)', newValue)
        this.openPopup(newValue)
      }
    },

    zoomLevel(newValue) {
      if (newValue) {
        this.zoomMap(newValue)
      }
    }
  },

  computed: {
    zoomLevel: {
      get() {
        return this.$store.state.map.zoom
      },
      set(newVal) {
        this.$store.commit('setMapZoom', newVal)
      }
    },
    currentPin: {
      get() {
        console.log('[Map computed] get currentPin')
        return this.$store.state.map.currentPin
      },
      set(newVal) {
        console.log('[Map computed] set currentPin')
        this.$store.commit('setMapCurrentPin', newVal)
      }
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.map.${key}`)
    },

    createMap() {
      console.log('[Map methods] create map', this.mapCreated)
      L.mapbox.accessToken = settings.mapboxToken

      // see https://www.mapbox.com/api-documentation/#introduction
      const mapId = 'mapbox.light'

      const mapboxTiles = L.tileLayer(`https://api.mapbox.com/v4/${mapId}/{z}/{x}/{y}.png?access_token=${L.mapbox.accessToken}`, {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })

      map = L.map('js-event-map', {
          scrollWheelZoom: false
        })
        .addLayer(mapboxTiles)

      map.on('zoomend', e => zoomCount++)
      map.on('zoom', this.updateZoomLevel)
      map.on('popupclose', this.handlePopupClose)

      markers = []
      this.mapCreated = true
      console.log('[Map methods] create map, map created', this.mapCreated)
    },

    addEventsToMap() {
      console.log('[Map methods] add events to map', this.events)
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
      const ll = [event.latitude, event.longitude]

      let html = `<h5>${event.title}</h5>`

      if (event.category === 'event') {
        html += `<div class="date">${event.formatted_start_date }</div>`
      }

      html += `<div class="address"><address>${event.address}</address></div><a class="btn btn-small" href="${event.url}" target="_blank">${this.$lt(`${event.category}_cta`)}</a>`

      const marker = L.marker(ll)
        .addTo(map)
        .bindPopup(html)

      marker.eventId = event.id
      marker.on('click', this.clickMarker)
      markers.push(marker)
      this.bounds.extend(ll)
    },

    clickMarker(event) {
      console.log('[Map methods] click marker', event.target.eventId)
      this.$store.commit('setMapCurrentPin', {
        id: event.target.eventId,
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        type: 'map-marker' // NOTE: to indicate possible incomplete information from map marker
      })
    },

    openPopup({ id }) {
      console.log('[Map methods] open popup', id)
      const marker = markers.find(m => m.eventId === id)
      if (marker) marker.openPopup()
    },

    closePopup({ id }) {
      console.log('[Map methods] close popup', id)
      const marker = markers.find(m => m.eventId === id)
      if (marker) marker.closePopup()
    },

    handlePopupClose(event) {
      console.log('[Map methods] handle popup close', event)
      console.log('[Map methods] handle popup close - current pin', this.currentPin)
      // Set the current pin to null, unless the popup close was triggered by
      // this or another component updating the current pin value
      if (this.currentPin && (event.popup._source.eventId === this.currentPin.id)) {
        console.log('[Map methods] handle popup close - set to null', event.popup._source.eventId, this.currentPin, this.currentPin.id)
        this.$store.commit('setMapCurrentPin', null)
      }
    },

    updateZoomLevel() {
      console.log('[Map methods] updateZoomLevel')
      this.$store.commit('setMapZoom', map.getZoom())
    },

    zoomMap(newZoom) {
      console.log('[Map methods] zoomMap')
      // Center the map on the current pin (if one is selected) or the current map center
      const ll = this.currentPin ? [this.currentPin.latitude, this.currentPin.longitude] : map.getCenter()
      const zoom = newZoom

      map.setView(ll, zoom)
    }
  }
}
</script>
