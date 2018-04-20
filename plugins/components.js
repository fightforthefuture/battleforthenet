import Vue from 'vue'
import FacebookButton from '~/components/FacebookButton'
import TwitterButton from '~/components/TwitterButton'
import Modal from '~/components/Modal'
import Disclaimer from '~/components/Disclaimer'

const components = {
  FacebookButton,
  TwitterButton,
  Modal,
  Disclaimer
}

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})
