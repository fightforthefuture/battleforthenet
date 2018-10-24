import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      org: 'fftf',
      politicians: [],
      zipCode: null,
      phone: null,
      streetAddress: null,
      facebookShareURL: null,
      twitterShareURL: null,
      map: {
        zoom: null,
        currentPin: null
      }
    },

    mutations: {
      setPoliticians(state, value) {
        state.politicians = value
      },

      setOrg(state, value) {
        state.org = value
      },

      setZipCode(state, value) {
        state.zipCode = value
      },

      setPhone(state, value) {
        state.phone = value
      },

      setStreetAddress(state, value) {
        state.streetAddress = value
      },

      setFacebookShareURL(state, value) {
        state.facebookShareURL = value
      },

      setTwitterShareURL(state, value) {
        state.twitterShareURL = value
      },

      setMapZoom(state, value) {
        state.map.zoom = value
      },

      setMapCurrentPin(state, value) {
        console.log('[store mutations] setMapCurrentPin', value)
        state.map.currentPin = value
      }
    }
  })
}

export default createStore
