<style lang="scss" scoped>
h2 {
  margin-bottom: 1rem;
}

fieldset {
  border: none;
  padding: 0;

  legend {
    margin-bottom: 0.5rem;
  }
}

input, textarea, select {
  padding: 1.25rem;
  font-size: 1.6rem;
}
</style>

<template>
  <div>
    <h2>{{ $lt('title') }}</h2>
    <div v-if="isDone">
      <div v-html="$lt('thanks_html')"></div>
      <button class="btn" @click="$parent.close()">{{ $lt('done_button') }}</button>
    </div>
    <form v-else @submit.prevent="submitForm()">
      <fieldset>
        <legend>{{ $lt('contact_info_legend') }}</legend>
        <div class="flex-row">
          <input type="text" v-model="name" :placeholder="$lt('name_placeholder')" required>
          <input type="email" v-model="email" :placeholder="$lt('email_placeholder')" required>
          <input type="tel" v-model="phone" :placeholder="$lt('phone_placeholder')">
        </div>
      </fieldset>
      <fieldset>
        <legend>{{ $lt('event_details_legend') }}</legend>
        <div class="flex-row">
          <input type="text" v-model="title" :placeholder="$lt('title_placeholder')" required>
        </div>
        <div class="flex-row">
          <textarea :placeholder="$lt('description_placeholder')" v-model="description" required></textarea>
        </div>
      </fieldset>
      <fieldset>
        <legend>{{ $lt('start_date_legend') }}</legend>
        <div class="flex-row">
          <input type="date" v-model="start_date" :placeholder="$lt('start_date_placeholder')" required>
          <input type="time" v-model="start_time" :placeholder="$lt('start_time_placeholder')" required>
        </div>
      </fieldset>
      <fieldset>
        <legend>{{ $lt('location_legend') }}</legend>
        <div class="flex-row">
          <input type="text" v-model="location_name" :placeholder="$lt('location_name_placeholder')" required>
          <input type="text" v-model="street" :placeholder="$lt('street_placeholder')" required>
        </div>
        <div class="flex-row">
          <input type="text" v-model="city" :placeholder="$lt('city_placeholder')" required>
          <select v-model="state" required>
            <option :value="null">{{ $lt('state_placeholder') }}</option>
            <option v-for="(name, code) in states" :key="code" :value="code">{{ name }}</option>
          </select>
          <input type="tel" v-model="zip" :placeholder="$lt('zip_placeholder')" required>
        </div>
      </fieldset>
      <fieldset>
        <legend>{{ $lt('instructions_legend') }}</legend>
        <div class="flex-row">
          <textarea :placeholder="$lt('instructions_placeholder')" v-model="instructions" required></textarea>
        </div>
      </fieldset>
      <div class="flex-row">
        <button class="btn btn-cta btn-large" :disabled="isSending">
          <span v-if="!isSending">{{ $lt('cta_button') }}</span>
          <span v-else>{{ $lt('loading_button') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import states from '~/assets/data/states'

export default {
  data() {
    return {
      title: null,
      description: null,
      instructions: null,
      start_date: null,
      start_time: null,
      name: null,
      email: null,
      phone: null,
      location_name: null,
      street: null,
      city: null,
      state: null,
      zip: null,
      isSending: false,
      isDone: false
    }
  },

  computed: {
    states: () => states
  },

  methods: {
    $lt(key) {
      return this.$t(`components.CreateEvent.${key}`)
    },

    async submitForm() {
      if (this.isSending) return

      this.isSending = true
      this.$trackEvent('create_event_form', 'submit')

      try {
        const { data } = await axios.post('https://45acun10vf.execute-api.us-east-1.amazonaws.com/v1/events', {
          title: this.title,
          description: this.description,
          instructions: this.instructions,
          start_date: this.start_date,
          start_time: this.start_time,
          name: this.name,
          email: this.email,
          phone: this.phone,
          location_name: this.location_name,
          street: this.street,
          city: this.city,
          state: this.state,
          zip: this.zip
        })
      }
      catch (error) {
        console.error(error)
      }

      this.isDone = true
      this.isSending = false
    }
  }
}
</script>
