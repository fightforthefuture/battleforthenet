<style lang="scss">
$btn-color: lighten(#544090, 20%);

body.map-page {
  padding-top: 80px;

  .bftn-footer {
    display: none;
  }
}

.map-page {
  .rsvp-btn {
    border: 1px solid $btn-color;
    color: $btn-color;
    background-color: transparent;
    transition: all .2s;

    &:hover {
      color: rgba($btn-color, 0.75);
      border-color: rgba($btn-color, 0.75);
    }
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

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #171629;

    .flex-center {
      height: 77px;
    }

    .divider {
      background-image: url('~/assets/images/top-bg.png');
      background-position: 0 0;
      background-size: 100% auto;
      background-repeat: no-repeat;
      height: 3px;
    }

    h2 {
      margin-right: 2rem;
    }

    input {
      width: auto;
    }
  }

  .event-map {
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 70%;
    height: 100%;
  }

  .event-list {
    width: 30%;
    height: 100%;
    text-align: left;
    float: right;

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 2rem;

      &:nth-child(odd) {
        background-color: #241e31;
      }

      img {
        border-radius: $border-radius;
      }

      .inner {
        border: 1px solid #544090;
        padding: 2rem;
        border-radius: $border-radius;
      }

      p {
        margin-top: 0;
      }

      h4 {
        margin: 0;
      }

      .details {
        font-size: 86%;
        margin-bottom: 1rem;
      }

      .description {
        margin: 1rem 0;
        font-size: 92%;
      }
    }
  }

  .leaflet-popup-close-button {
    color: $body-color;
    text-indent: 0;

    &:hover {
      background-color: transparent;
    }
  }

  .leaflet-popup-content-wrapper {
    background-color: #241e31;
  }

  .leaflet-popup-tip {
    border-top: 10px solid #241e31;
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
      margin-bottom: 1.5rem;
    }
  }

  @media only screen and (max-width: 699px) {
    h2 {
      font-size: 2.5rem;
    }
  }

  @include small-screen {
    .navbar {
      padding-top: 300px;

      h2 {
        font-size: 2rem;
        margin: 1rem;
      }

      input {
        width: 18rem;
      }
    }

    .event-map {
      bottom: auto;
      height: 300px;
      width: 100%;
      top: 0;
    }

    .event-list {
      width: auto;
      float: none;
      padding-top: 290px;
    }

    .bftn-footer {
      display: block !important;
    }
  }
}
</style>

<template>
  <div class="map-page">
    <nav class="navbar" ref="navbar">
      <div class="flex-center">
        <h2>{{ $lt('title') }}</h2>
        <input type="tel" :placeholder="$lt('zip_placeholder')" v-model="zipCode">
      </div>
      <div class="divider"></div>
    </nav>
    <div class="event-map" id="event-map" ref="map"></div>
    <div class="event-list">
      <ul>
        <li v-for="event in sortedEvents" :key="event.id" :id="`event-${event.id}`" @mouseover="openPopup(event)" @mouseout="closePopup(event)">
          <p v-if="event.image"><img :src="event.image" alt="[Event banner image]"></p>
          <h4>{{ event.title }}</h4>
          <div class="details">
            <div class="date">
              <span>{{ event.formatted_start_date }}</span>
            </div>
            <div class="address">
              <address>{{ event.address }}</address>
            </div>
          </div>
          <!-- <div class="description" v-html="event.description"></div> -->
          <a :href="event.url" class="btn rsvp-btn" target="_blank">{{ $lt('event_cta') }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import haversine from 'haversine'
import { smoothScrollTo } from '~/assets/js/helpers'
import settings from '~/config.json'

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

  data() {
    return {
      events: [],
      zipCode: null,
      coords: []
    }
  },

  async created() {
    if (this.$route.query.zip) {
      this.zipCode = this.$route.query.zip
    }

    this.fetchEvents()
  },

  mounted() {
    this.createMap()
    document.body.classList.add('map-page')
  },

  watch: {
    events() {
      this.bounds = L.latLngBounds()

      for (let event of this.events) {
        this.addMarker(event)
      }

      this.map.fitBounds(this.bounds)
      this.showNearestEvent()
    },

    async zipCode(newValue) {
      if (!newValue) {
        this.coords = []
      }
      else if (newValue.length >= 5) {
        if (this.$route.query.zip !== newValue) {
          this.$router.replace({
            name: 'map',
            query: {
              zip: newValue
            }
          })
        }

        await this.geocodeZip()
        this.showNearestEvent()
      }
    }
  },

  computed: {
    sortedEvents() {
      if (!this.coords) return this.events()

      const zipPoint = { latitude: this.coords[0], longitude: this.coords[1] }

      return this.events.slice().sort((a, b) => {
        const aDistance = haversine(zipPoint, a.location.location)
        const bDistance = haversine(zipPoint, b.location.location)

        if (aDistance < bDistance) {
          return -1
        }
        else if (aDistance > bDistance) {
          return 1
        }
        else {
          return 0
        }
      })
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.map.${key}`)
    },

    async fetchEvents() {
      try {
        const { data } = await axios.get('https://data.battleforthenet.com/events.json')
        this.events = data
      }
      catch (error) {
        this.events = []
      }
    },

    createMap() {
      L.mapbox.accessToken = settings.mapboxToken

      // see https://www.mapbox.com/api-documentation/#introduction
      const mapId = 'mapbox.light'

      const mapboxTiles = L.tileLayer(`https://api.mapbox.com/v4/${mapId}/{z}/{x}/{y}.png?access_token=${L.mapbox.accessToken}`, {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })

      this.map = L.map('event-map', {
          scrollWheelZoom: false
        })
        .addLayer(mapboxTiles)

      this.zoomCount = 0
      this.map.on('zoomend', e => this.zoomCount++)

      this.markers = []
    },

    addMarker(event) {
      const ll = [event.location.location.latitude, event.location.location.longitude]

      const marker = L.marker(ll)
        .addTo(this.map)
        .bindPopup(`<h5>${event.title}</h5><div class="date">${event.formatted_start_date }</div><div class="address"><address>${event.address}</address></div><a class="btn rsvp-btn" href="${event.url}" target="_blank">${this.$lt('event_cta')}</a>`)

      marker.eventId = event.id
      marker.on('click', this.clickMarker)
      this.markers.push(marker)
      this.bounds.extend(ll)
    },

    clickMarker(event) {
      const el = document.getElementById(`event-${event.target.eventId}`)
      const navbarHeight = this.$refs.navbar.clientHeight
      smoothScrollTo(el.offsetLeft, el.offsetTop - navbarHeight, 500)
    },

    openPopup({ id }) {
      this.markers.find(m => m.eventId === id).openPopup()
    },

    closePopup({ id }) {
      this.markers.find(m => m.eventId === id).closePopup()
    },

    async geocodeZip() {
      try {
        const { data } = await axios.get(`https://geo.battleforthenet.com/zip/${this.zipCode.substr(0, 5)}.json`)
        this.coords = [data.latitude, data.longitude]
      }
      catch (error) {
        //
      }
    },

    showNearestEvent() {
      if (this.coords.length > 0 && this.events.length > 0) {
        const event = this.sortedEvents[0]
        const ll = [event.location.location.latitude, event.location.location.longitude]
        const startingZoom = 9
        const zoom = this.zoomCount > 1 ? this.map.getZoom() : startingZoom
        this.map.setView(ll, zoom)
        this.openPopup(event)
      }
    }
  }
}
</script>
