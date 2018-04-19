import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      org: 'fftf',
      modalVisible: false
    },

    mutations: {
      showModal(state) {
        state.modalVisible = true

        if (process.browser) {
          document.querySelector('body').classList.add('modal-open')
        }
      },

      hideModal(state) {
        state.modalVisible = false

        if (process.browser) {
          document.querySelector('body').classList.remove('modal-open')
        }
      },

      setOrg(state, value) {
        state.org = value
      }
    }
  })
}

export default createStore