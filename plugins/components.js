import Vue from 'vue'
import FacebookButton from '~/components/FacebookButton'
import TwitterButton from '~/components/TwitterButton'
import Modal from '~/components/Modal'
import Disclaimer from '~/components/Disclaimer'
import PageFooter from '~/components/PageFooter'
import DonateButton from '~/components/DonateButton'

const components = {
  FacebookButton,
  TwitterButton,
  Modal,
  Disclaimer,
  PageFooter,
  DonateButton
}

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})
