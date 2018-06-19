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
    <h2>Create an Event</h2>
    <div v-if="hasCreated">
      <p>Thanks! We'll be in touch.</p>
      <button class="btn" @click="$parent.close()">Done</button>
    </div>
    <form v-else @submit.prevent="submitForm()">
      <fieldset>
        <legend>Contact Info (this will be public)</legend>
        <div class="flex-row">
          <input type="text" v-model="name" placeholder="Host name*" required>
          <input type="email" v-model="email" placeholder="Email*" required>
          <input type="tel" v-model="phone" placeholder="Phone" required>
        </div>
      </fieldset>
      <fieldset>
        <legend>Event Details</legend>
        <div class="flex-row">
          <input type="text" v-model="title" placeholder="Title of your event*" required>
        </div>
        <div class="flex-row">
          <textarea placeholder="Event description*" v-model="description" required></textarea>
        </div>
      </fieldset>
      <fieldset>
        <legend>Start Date &amp; Time</legend>
        <div class="flex-row">
          <input type="date" v-model="start_date" placeholder="Start date*" required>
          <input type="time" v-model="start_time" placeholder="Start time*" required>
        </div>
      </fieldset>
      <fieldset>
        <legend>Location</legend>
        <div class="flex-row">
          <input type="text" v-model="location_name" placeholder="Venue Name*" required>
          <input type="text" v-model="street" placeholder="Street Address*" required>
        </div>
        <div class="flex-row">
          <input type="text" v-model="city" placeholder="City*" required>
          <select v-model="state" required>
            <option :value="null">Select state*</option>
            <option v-for="(name, code) in states" :key="code" :value="code">{{ name }}</option>
          </select>
          <input type="tel" v-model="zip" placeholder="ZIP Code*" required>
        </div>
      </fieldset>
      <fieldset>
        <legend>Instructions for your attendees (visible after signup)</legend>
        <div class="flex-row">
          <textarea placeholder="Attendee instructions*" v-model="instructions" required></textarea>
        </div>
      </fieldset>
      <div class="flex-row">
        <button class="btn btn-cta btn-large" :disabled="isSending">
          <span v-if="!isSending">Create Event</span>
          <span v-else>Saving...</span>
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
      hasCreated: false
    }
  },

  computed: {
    states: () => states
  },

  methods: {
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

      // this.resetForm()
      this.hasCreated = true
    },

    resetForm() {
      this.isSending = false
    }
  }
}
</script>
