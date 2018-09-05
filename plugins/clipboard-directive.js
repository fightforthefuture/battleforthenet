import Vue from 'vue'
import Clipboard from 'clipboard'

Vue.directive('clipboard', {
  bind: function(el, binding, vnode, oldVnode) {
    let clipboard = new Clipboard(el)
    clipboard.on('success', function(ev) {
      alert("Copied!")
      ev.clearSelection()
    })
  }
})
