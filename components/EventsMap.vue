<style lang="scss">
$btn-color: lighten(#544090, 20%);

.map-wrapper {
  position: relative;
  height: 500px;
  overflow: hidden;
  background: $body-bg-color;
  font-size: 1.25rem;

  .rsvp-btn {
    padding: 7px 14px;
    background-color: transparent;
    border: 1px solid $btn-color;
    color: $btn-color;
    font-size: 1.2rem;
    transition: all .2s;

    &:hover {
      border-color: rgba($btn-color, 0.75);
      color:        rgba($btn-color, 0.75);
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: $body-bg-color;

    .flex-center {
      height: 77px;
    }

    .divider {
      background-image: url('~/assets/images/gradient-divider.png');
      background-position: 0 0;
      background-size: 100% auto;
      background-repeat: no-repeat;
      height: 3px;
    }

    h2 {
      margin-right: 2rem;
    }

    input,
    .btn {
      margin-right: 2rem;
      font-size: 1.7rem;
      line-height: 1.2;
      padding: 1.5rem 1rem;
    }
    input {
      width: auto;
      font-weight: bold;
    }
    .btn {
      padding-right: 3rem;
      padding-left:  3rem;

      @include medium-screen {
        padding: 1rem;
        font-size: 1.3rem;
      }

      @include small-screen {
        padding: 1rem;
        font-size: 1rem;
      }
    }
  }

  .event-map {
    position: fixed;
    top: 80px;
    width: 70%;
  }

  .event-list {
    position: absolute;
    top: 80px;
    bottom: 0;
    right: 0;
    width: 30%;
    text-align: left;
    float: right;
    overflow-y: scroll;

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 2rem;


      &:nth-child(odd) {
        background-color: #241E31;
      }

      img {
        display: block;
        border-radius: $border-radius;
      }

      p {
        margin-top: 0;
      }

      h4 {
        margin: 0;
        font-size: 1.5rem;
        text-transform: none;

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: $link-color;
          }
        }
      }

      .details {
        margin-bottom: 1rem;
        font-size: 1.25rem;
        line-height: 1.5;
      }

      .description {
        margin: 1rem 0;
        font-size: 92%;
      }
    }
  }

  @include medium-screen {
    h2 {
      font-size: 2.5rem;
    }
  }

  @include small-screen {
    height: 600px;

    .navbar {
      top: 300px;

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
      top: 380px;
    }
  }
}
</style>

<template>
  <div class="map-wrapper">
    <nav class="navbar" ref="navbar">
      <div class="flex-center">
        <h2 v-text="title ? title : $lt('title')"></h2>
        <input type="tel" :placeholder="$lt('zip_placeholder')" v-model="zipCode">
        <a class="btn btn-cta" @click="hostEvent()">{{ $lt('host_cta') }}</a>
      </div>
      <div class="divider"></div>
    </nav>
    <Map :events="events" :is-standalone="false" ref="map" />
    <div class="event-list" ref="list">
      <ul>
        <li v-if="hasLoadedEvents && events.length < 1">
          <h4>{{ $lt('no_events_title') }}</h4>
          <p>{{ $lt('no_events_description') }}</p>
        </li>

        <li v-for="event in sortedEvents"
            :key="event.id"
            :id="`event-${event.id}`"
            @mouseenter="setCurrentEvent(event)"
            @mouseleave="clearCurrentEvent(event)">
          <p v-if="event.image"><img :src="event.image" alt="[Event banner image]"></p>
          <h4><a :href="event.url" @click="$trackClick('map_list_event_title')">{{ event.title }}</a></h4>
          <div class="details">
            <div class="date" v-if="event.category == 'event'">
              <span>{{ event.formatted_start_date }}</span>
            </div>
            <div class="address">
              <address>{{ event.address }}</address>
            </div>
          </div>
          <!-- <div class="description" v-html="event.description"></div> -->
          <a :href="event.url"
             class="btn rsvp-btn"
             target="_blank"
             @click="$trackClick('map_list_rsvp_button')">
            {{ $lt(`${event.category}_cta`) }}
          </a>
        </li>
      </ul>
    </div>

    <modal v-if="modalVisible">
      <create-event></create-event>
    </modal>
  </div>
</template>

<script>
import axios from 'axios'
import haversine from 'haversine'
import { smoothScrollWithinElement } from '~/assets/js/helpers'
import settings from '~/config.json'
import Map from '~/components/Map'
import CreateEvent from '~/components/CreateEvent'

export default {
  components: {
    Map,
    CreateEvent
  },

  props: {
    title: String
  },

  data() {
    return {
      events: [],
      zipCode: null,
      coords: [],
      modalVisible: false,
      hasLoadedEvents: false
    }
  },

  async created() {
    if (this.$route.query.zip) {
      this.zipCode = this.$route.query.zip
    }

    this.fetchEvents()
  },

  watch: {
    currentEvent(newValue) {
      if (newValue && newValue.id && newValue.type == 'map-marker') {
        this.scrollToCurrentEvent(newValue.id)
      }
    },

    async zipCode(newValue) {
      if (!newValue) {
        this.coords = []
        history.replaceState({}, document.title, '/map/')
      }
      else if (newValue.length >= 5) {
        if (this.$route.query.zip !== newValue) {
          history.replaceState({}, document.title, '/map/?zip=' + newValue)
        }

        await this.geocodeZip()
        this.showNearestEvent()
      }
    }
  },

  computed: {
    sortedEvents() {
      if (this.coords.length === 0) {
        return this.events
      }

      const zipPoint = { latitude: this.coords[0], longitude: this.coords[1] }

      return this.events.slice().sort((a, b) => {
        const aDistance = haversine(zipPoint, a)
        const bDistance = haversine(zipPoint, b)

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
    },
    currentEvent: {
      get() {
        return this.$store.state.map.currentPin
      },
      set(newVal) {
        this.$store.commit('setMapCurrentPin', newVal)
      }
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

      this.hasLoadedEvents = true
    },


    scrollToCurrentEvent(id) {
      const el = document.getElementById(`event-${id}`)
      smoothScrollWithinElement(this.$refs.list, el.offsetTop, 500)
    },

    setCurrentEvent(event) {
      this.$store.commit('setMapCurrentPin', event)
    },

    clearCurrentEvent() {
      this.$store.commit('setMapCurrentPin', null)
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
        this.setCurrentEvent(event)
        this.$store.commit('setMapZoom', 9)
      }
    },

    hostEvent() {
      this.modalVisible = true
      this.$trackEvent('host_event_button', 'click')
    }
  }
}
</script>
