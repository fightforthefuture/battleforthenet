<template>
  <no-ssr>
    <div :data-experiment="name" :data-variant="activeVariant">
      <slot v-for="variant in variants" :name="variant" v-if="variant == activeVariant"></slot>
    </div>
  </no-ssr>
</template>

<script>
import sample from 'lodash/sample'

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  computed: {
    activeVariant() {
      if (process.browser) {
        const key = `exp.${this.name}`
        const storedVariant = this.$route.query[key] || localStorage.getItem(key)
        
        if (storedVariant && this.variants.includes(storedVariant)) {
          return storedVariant
        }

        const variant = sample(this.variants)
        localStorage.setItem(key, variant)

        return variant
      }
      else {
        return this.variants[0]
      }
    },

    variants() {
      return Object.keys(this.$slots)
    }
  }
}
</script>