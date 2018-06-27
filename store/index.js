import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      org: 'fftf',
      politicians: [],
      zipCode: null,
      phone: null,
      streetAddress: null
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
      }
    }
  })
}

export default createStore
