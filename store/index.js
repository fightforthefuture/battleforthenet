import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      org: 'fftf',
      politicians: []
    },

    mutations: {
      setPoliticians(state, value) {
        state.politicians = value
      },

      setOrg(state, value) {
        state.org = value
      }
    }
  })
}

export default createStore
