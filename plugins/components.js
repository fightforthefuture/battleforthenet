import Vue from 'vue'
import FacebookButton from '~/components/FacebookButton'
import TwitterButton from '~/components/TwitterButton'
import Modal from '~/components/Modal'

const components = {
  FacebookButton,
  TwitterButton,
  Modal
}

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})