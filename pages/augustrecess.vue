<style lang="scss">
// Variables inherit from _variables.scss if not specified or overwritten here
$title-font: 'Montserrat', $body-font;

$body-bg-color:        #102373;
$body-bg-color-alt-1:  #123393;
$body-bg-color-alt-2:  #1757DA;
$text-dark-color:      #0A2824;
$link-color:           #2C94FF;
$radio-selected-color: #30C1E6;
$cta-color:            #FF592D;
$cta-dark-color:       #CE441F;
$meta-color:           #C1C4FF;
$success-color:        #30E6CD;
$white:                #FFF;

$font-size-1: 5.5rem;
$font-size-2: 3.4rem;
$font-size-3: 2.8rem;
$font-size-4: 1.6rem;
$base-font-size: 2rem;

// Base

body {
  font-family: $body-font;
  background: $body-bg-color;
  color: $white;
  font-size: $base-font-size;
}

// Typography

h1, h2, h3, h4, .btn {
  font-family: $title-font;
}

h1 {
  font-size: $font-size-1;
  line-height: .9;

  @include mobile {
    font-size: 4.2rem;
  }
}

h2 {
  font-size: $font-size-2;
}

h4 {
  text-transform: uppercase;
}

ul {
  // NOTE: ideally this could go in a reset
  list-style: none;
  padding: 0;
}

p.success,
p.error {
  padding: 1.8rem 2rem;
  border-radius: $border-radius;
  text-align: left;
  font-size: $font-size-4;
}

p.success {
  background: $success-color;
  color: $text-dark-color;
}

p.error {
  background: $team-cable-red;
  color: $white;
}

// Layout

.container {
  width: 675px;
}

.push-top-2 {
  margin-top: 2rem;
}

.push-top-3 {
  margin-top: 3rem;
}

// Sections

.page-header {
  background: $body-bg-color url('~assets/images/august-recess-bg.jpg') top center no-repeat;
  background-size: cover;
  padding-top: 5rem;
  position: relative;

  h1 {
    max-width: 90%;
    margin: auto;

    @include big-screen {
      max-width: 900px;
      padding: 0 2rem;
    }
  }
  .arrow {
    display: block;
    margin: 4rem auto;
  }

  .group-photos {
    height: 0;
    max-width: 967px;
    margin-left:  auto;
    margin-right: auto;
    padding-top: 32%;
    background: transparent url('~assets/images/august-recess-photos.png') center center no-repeat;
    background-size: contain;
    text-indent: -9999em;

    @include mobile {
      padding-top: 90%;
      background-size: auto 100%;
    }
  }
}

section {
  padding: 6rem;

  @include mobile {
    padding: 3rem 0;
  }

  &:nth-child(3){
    background-color: $body-bg-color-alt-1;
  }
  &:nth-child(4){
    background-color: $body-bg-color-alt-2;
  }

  &.section-events {
    background-image: url('~assets/images/august-recess-events-bg.jpg');
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;

    img {
      border-radius: $border-radius;
    }
  }
}

// Forms

form input,
form textarea {
  border: 1px solid $body-bg-color;
}

form .row {
  display: flex;
  margin-bottom: 1.5%;

  input {
    margin-right: 1.5%;

    &:last-child {
      margin-right: 0;
    }

    &.address, &.phone {
      width: 38.5%;
    }

    &.zip {
      width: 20%;
    }
  }
}

form .radios {
  overflow: hidden;
  border-bottom: 1px solid $body-bg-color-alt-1;

  &:last-of-type {
    border-bottom: none;
  }

  p {
    float: left;
    text-align: left;
    width: 100%;

    @include big-screen {
      width: 65%;
      margin-right: 5%;
    }
  }

  ul {
    width: 100%;
    overflow: hidden;
    margin: 1.2rem 0;
    text-align: left;

    @include big-screen {
      float: right;
      text-align: right;
      width: 30%;
    }
  }

  li {
    display: inline-block;
  }

  input[type=radio] {
    display: none;
  }

  label {
    display: block;
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    min-width: 55px;
    border: 1px solid $white;
    border-radius: $border-radius;
    font-size: $font-size-4;
    cursor: pointer;
    text-align: center;
  }
  label:hover,
  label:focus {
    border-color:     $body-bg-color;
    background-color: $body-bg-color;
  }

  li:first-of-type label {
    margin-left: 0;
  }
  input[type=radio]:checked ~ label,
  input[type=radio]:checked ~ label {
    border-color:     $radio-selected-color;
    background-color: $radio-selected-color;
  }
}

form .disclaimer small {
  color: $meta-color;

  a {
    color: $link-color;
  }
}

//  Buttons

.btn {
  background-color: $cta-color;
  font-size: $base-font-size;
  padding: 1.3rem 2.8rem 1.5rem;
  line-height: 1.4;
  vertical-align: baseline;

  .icon-left {
    float: left;
    margin-right: 1rem;

    @include mobile {
      max-height: 19px;
      width: auto;
    }
  }
}

.btn:hover,
.btn:focus,
.btn:active {
  background-color: $cta-dark-color;
}

.btn-large {
  font-size: $font-size-3;
}

.btn-hollow {
  padding-left:  1.2rem;
  padding-right: 1.2rem;
  background: transparent;
  border: 1px solid $white;
  font-size: $font-size-4;
}

.btn-hollow:hover,
.btn-hollow:focus,
.btn-hollow:active {
  border-color:     $body-bg-color;
  background-color: $body-bg-color;
}

// Lists

.events-list {
  display: flex;
  flex-wrap: wrap;

  li {
    width: 100%;
    word-wrap: break-word;

    @include big-screen {
      width: 30%;
    }

    &:nth-of-type(3n+1),
    &:nth-of-type(3n+2) {
      @include big-screen {
        margin-right: 3.33%;
      }
    }
  }
}

// Footer

.page-footer {
  text-align: center;
  font-size: 1.4rem;

  h4 {
    margin-bottom: 1.5rem;
  }

  .logos,
  .container {
    padding: 5rem;

    @include mobile {
      padding: 2.5rem 0;
    }
  }

  .logos {
    position: relative;
    background: $body-bg-color-alt-1;

    img {
      height: 3.5rem;
      margin: 1rem 3rem;
    }

    img.fftf {
      height: 2.5rem;
      margin: 1.5rem 3rem;
    }

    &:after {
      position: absolute;
      top: 100%;
      left: 50%;
      height: 0;
      width: 0;
      content: " ";
      margin-left: -2.5rem;
      border: 2.5rem solid transparent;
      border-top-color: $body-bg-color-alt-1;
    }
  }

  p {
    margin: 0.5rem 0;
    font-weight: 300;
  }

  a {
    color: $link-color;
    font-weight: normal;
  }
}
</style>

<template>
  <div class="text-center">
    <header class="page-header">
      <h1 class="upcase">{{ $lt('title') }}</h1>
      <div class="container push-top-3">
        <div v-html="$lt('intro_html')"></div>
        <a class="btn btn-large btn-block push-top-3" href="#sign-up">
          {{ $lt('cta_button') }}
        </a>
      </div> <!-- .container -->
      <img src="~assets/images/arrow-down.svg" alt="see below arrow"
           class="arrow">
      <div class="group-photos">Photos of Net Neutrality protestors</div>
    </header>

    <section v-for="(section, id) in $lt('sections')" :id="id" :key="id">
      <div class="container">
        <h2>{{ section.title }}</h2>
        <div v-html="section.body_html"></div>
      </div> <!-- .container -->
    </section>

    <section id="sign-up">
      <div class="container">
        <h2>{{ $lt('form.title') }}</h2>
        <div v-html="$lt('form.description_html')"></div>

        <form class="push-top-3" @submit.prevent="submitForm()">
          <p :class="message.type" v-if="message">{{ message.text }}</p>
          <div class="row">
            <input v-model="firstname"
                   :placeholder="$lt('form.firstname_placeholder')"
                   name="first_name"
                   type="text"
                   required>
            <input v-model="lastname"
                   :placeholder="$lt('form.lastname_placeholder')"
                   name="last_name"
                   type="text"
                   required>
            <input v-model="email"
                   :placeholder="$lt('form.email_placeholder')"
                   name="email"
                   type="email"
                   required>
          </div> <!-- .row -->
          <div class="row">
            <input v-model="address"
                   :placeholder="$lt('form.address_placeholder')"
                   name="address1"
                   type="text"
                   class="address"
                   required>
            <input v-model="zipCode"
                   :placeholder="$lt('form.zip_placeholder')"
                   name="zip"
                   type="tel"
                   class="zip"
                   required>
            <input v-model="phone"
                   :placeholder="$lt('form.phone_placeholder')"
                   name="phone"
                   type="tel"
                   class="phone"
                   required>
          </div> <!-- .row -->
          <div class="letter">
            <textarea v-model="comments"
                      :placeholder="$lt('form.comments_placeholder')"
                      ref="comments">
            </textarea>
          </div> <!-- .letter -->
          <div class="radios">
            <p>{{ $lt('form.meeting_question') }}</p>
            <ul>
              <li>
                <input v-model="canAttendMeetings"
                       type="radio"
                       name="action_meeting_attendance"
                       id="action_meeting_attendance_yes"
                       value="Yes"/>
                <label for="action_meeting_attendance_yes">
                  {{ $lt('form.yes') }}
                </label>
              </li>
              <li>
                <input v-model="canAttendMeetings"
                       type="radio"
                       name="action_meeting_attendance"
                       id="action_meeting_attendance_no"
                       value="No"/>
                <label for="action_meeting_attendance_no">
                  {{ $lt('form.no') }}
                </label>
              </li>
            </ul>
          </div> <!-- .radios -->
          <div class="radios">
            <p>{{ $lt('form.business_owner_question') }}</p>
            <ul>
              <li>
                <input v-model="isBusinessOwner"
                       type="radio"
                       name="action_small_business_owner"
                       id="action_small_business_owner_yes"
                       value="Yes"/>
                <label for="action_small_business_owner_yes">
                  {{ $lt('form.yes') }}
                </label>
              </li>
              <li>
                <input v-model="isBusinessOwner"
                       type="radio"
                       name="action_small_business_owner"
                       id="action_small_business_owner_no"
                       value="No"/>
                <label for="action_small_business_owner_no">
                  {{ $lt('form.no') }}
                </label>
              </li>
            </ul>
          </div> <!-- .radios -->
          <div class="radios">
            <p>{{ $lt('form.veteran_question') }}</p>
            <ul>
              <li>
                <input v-model="isVeteran"
                       type="radio"
                       name="action_veteran"
                       id="action_veteran_yes"
                       value="Yes"/>
                <label for="action_veteran_yes">
                  {{ $lt('form.yes') }}
                </label>
              </li>
              <li>
                <input v-model="isVeteran"
                       type="radio"
                       name="action_veteran"
                       id="action_veteran_no"
                       value="No"/>
                <label for="action_veteran_no">
                  {{ $lt('form.no') }}
                </label>
              </li>
            </ul>
          </div> <!-- .radios -->
          <button class="btn btn-block" :disabled="isSending">
            <span v-if="isSending">{{ $lt('form.button_loading') }}</span>
            <span v-else>{{ $lt('form.button_cta') }}</span>
          </button>
          <p class="disclaimer">
            <small v-html="$lt('form.disclaimer_html')"></small>
          </p>
        </form>
      </div> <!-- .container -->
    </section>

    <section id="events" class="section-events">
      <div class="container">
        <h2>{{ $lt('events.title') }}</h2>
        <div v-html="$lt('events.body_html')"></div>
        <img src="https://data.battleforthenet.com/events.png" alt="Events map"
             class="push-top-2">

        <ul class="events-list">
          <li v-for="(event, index) in events" :key="`event-${index}`">
            <a :href="event.url" target="_blank" class="btn btn-block btn-hollow">
              <img src="~assets/images/map-pin-fb.svg" alt="Facebook map pin"
                   class="icon-left">
              {{ event.address }}
            </a>
          </li>
        </ul>
      </div> <!-- .container -->
    </section>

    <footer class="page-footer">
      <div class="logos">
        <a href="https://www.fightforthefuture.org">
          <img src="~/assets/images/fftf-white-logo.png"
               alt="Fight for the Future" class="fftf">
        </a>
        <a href="https://www.demandprogress.org">
          <img src="~/assets/images/demand-progress-white-logo.png"
               alt="Demand Progress">
        </a>
        <a href="https://www.freepress.net">
          <img src="~/assets/images/free-press-white-logo.png"
               alt="Free Press Action Fund">
        </a>
      </div> <!-- .logos -->
      <div class="container">
        <h4>For Press inquiries, please contact us at:</h4>
        <p>
          <a href="tel://19788526457">978-852-6457</a> or
          <a href="tel://19788526457">978-852-6457</a> or
          <a href="mailto:press@fightforthefuture.org">
            press@fightforthefuture.org
          </a>
        </p>
        <p>
          <a href="tel://12026817582">202-681-7582</a> or
          <a href="mailto:press@demandprogress.org">press@demandprogress.org</a>
        </p>
        <p>
          All other inquiries, contact
          <a href="mailto:team@fightforthefuture.org">
            team@fightforthefuture.org
          </a>
        </p>
      </div> <!-- .container -->
    </footer>
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import axios from 'axios'

export default {
  layout: 'basic',

  head() {
    return {
      title: this.$lt('title'),

      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Montserrat:700|Open+Sans:400,700'
        }
      ],

      meta: createMetaTags({
        title: this.$lt('sharing.title'),
        description: this.$lt('sharing.description'),
        image: this.$lt('sharing.image'),
        url: this.$lt('sharing.url')
      })
    }
  },

  data() {
    return {
      firstname: null,
      lastname: null,
      email: null,
      address: null,
      zipCode: null,
      phone: null,
      comments: null,
      canAttendMeetings: "No",
      isBusinessOwner: "No",
      isVeteran: "No",
      isSending: false,
      message: null,
      events: []
    }
  },

  async created() {
    this.fetchEvents()
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.augustrecess.${key}`)
    },

    async fetchEvents() {
      try {
        const { data } = await axios.get('https://data.battleforthenet.com/events.json')
        this.events = data
      }
      catch (error) {
        this.events = []
      }
    },

    async submitForm() {
      this.isSending = true;
      this.message = null;

      try {
        const { response } = await axios.post(
          'https://6cfci1vd0k.execute-api.us-east-1.amazonaws.com/v1/action', {
            page: 'sign-up-meet-your-rep',
            first_name: this.firstname,
            last_name: this.lastname,
            email: this.email,
            address1: this.address,
            zip: this.zipCode,
            phone: this.phone,
            action_net_matters: this.comments,
            action_meeting_attendance: this.canAttendMeetings,
            action_small_business_owner: this.isBusinessOwner,
            action_veteran: this.isVeteran,
            country: "United States",
            source: "website",
            opt_in: 1,
            js: 1
          }
        )
        this.isSending = false;
        this.resetForm();
        this.message = { type: 'success', text: this.$lt('form.success') }
      } catch (error) {
        this.isSending = false
        this.message = { type: 'error', text: this.$lt('form.generic_error') }
      }
    },

    resetForm() {
      this.isSending = false
      this.firstname = null
      this.lastname = null
      this.email = null
      this.address = null
      this.zipCode = null
      this.phone = null
      this.comments = null
      this.canAttendMeetings = null
      this.isBusinessOwner = null
      this.isVeteran = null
    }
  }
}
</script>
