<script>
import IndexPage from './index'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  extends: IndexPage,

  head() {
    return {
      meta: createMetaTags({
        title: this.$lt('social.title'),
        description: this.$lt('social.description'),
        image: this.$lt('social.image'),
        url: this.$lt('social.url')
      })
    }
  },

  created() {
    this.petitionId = this.$lt('form.an_petition_id')
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.access.${key}`)
    }
  }
}
</script>
