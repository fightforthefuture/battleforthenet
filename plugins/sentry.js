import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import { sentryDSN } from '~/config'

export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return

  Sentry.init({
   dsn: sentryDSN,
   integrations: [
     new Integrations.Vue({
       Vue,
       attachProps: true,
     }),
   ],
  })
}
