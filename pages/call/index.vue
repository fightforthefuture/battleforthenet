<script>
import IndexPage from '../index'
import { createMetaTags } from '~/assets/js/helpers'
export default {
  extends: IndexPage,
  head() {
    return {
      title: this.$t('pages.index.document_title'),
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,600|Poppins:600,700'
        }
      ],
      meta: createMetaTags({
        title: "Call now to block the worst FCC nominee in history!",
        description: this.$t('social.share_description'),
        image: "https://www.battleforthenet.com/images/share_images/call-share.jpg",
        url: "https://www.battleforthenet.com/call"
      })
    }
  }
}
</script>
