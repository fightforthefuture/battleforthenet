<style lang="scss" scoped>
.politician {
  display: inline-block;
  margin: 1rem;
  position: relative;

  @include mobile {
    margin: 0.75rem;
  }

  img, .cover, .yes-bg {
    width: 10rem;
    height: 12.2rem;
    border-radius: $border-radius;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255,26,9,0.5);

    &:hover {
      cursor: pointer;
    }
  }

  h5 {
    position: absolute;
    bottom: .6rem;
    left: 0px;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.3rem;
    text-shadow: 0 0 5px rgba(0, 0, 0, 1.0);
    margin: 0;
    padding: 0;
    color: #fff;

    small {
      display: block;
      font-size: 1rem;
    }
  }

  &.long-name h5 {
    font-size: 0.95rem;
    bottom: .9rem;
  }

  .btn {
    display: block;
  }

  .yes-bg {
    display: none;
  }

  &.vote-yes {
    .cover {
      background: none;
    }

    .yes-bg {
      background: linear-gradient(90deg, rgba(55,191,164,1) 0%, rgba(53,118,173,1) 100%);
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      z-index: 1;
    }

    h5 {
      z-index: 2;
    }
  }
}
</style>

<template>
  <div :class="{ 'politician': true, 'vote-yes': politician.yesOnCRA, 'long-name': isLong(politician.name) }" @click="showCard(politician)">
    <img :src="imageURL(politician)" :srcset="imageURL(politician, '_x2') + ' 2x'">
    <div class="cover">
      <div class="yes-bg"></div>
      <h5>
        {{ politician.name }}
        <small>
          (<span v-if="politician.organization == 'Senate'">{{ $lt('senator_label') }} </span><b v-if="politician.partyCode">{{ politician.partyCode.toUpperCase() }} - </b>{{ politician.stateCode }})
        </small>
      </h5>
    </div>
    <div class="actions">
      <a class="btn btn-default" href="#" @click.prevent="showCard(politician)">{{ $lt('view_button') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'politician'
  ],

  methods: {
    $lt(key, vars={}) {
      return this.$t(`components.ScoreboardPhoto.${key}`, vars)
    },

    imageURL: function(pol, suffix='_x1') {
      return 'https://www.fightforthefuture.org/congress-images/' +  pol.biocode + suffix + '.jpg';
    },

    isLong: function(name) {
      return name.indexOf(' ') === -1 && name.length > 11;
    },

    showCard({ biocode }) {
      this.$router.push({
        name: 'scoreboard-id',
        params: {
          id: biocode
        }
      })
    }
  }
}
</script>
