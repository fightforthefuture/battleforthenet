<style lang="scss">
.modal-tip {
  background-color: #2f2940;
  padding: 1rem 2rem;
  border-radius: $border-radius;
  margin-top: 2.5rem;
  position: relative;

  // arrow
  &:after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #2f2940;
    border-width: 1.5rem;
    margin-left: -1.5rem;
  }

  .embed-code {
    input {
      background-color: #262035;
      color: #8a7cae;
    }

    .btn-copy {
      background-color: #433C57;

      &:hover,
      &:focus {
        background: #5a5175;
      }
    }
  }

  .btn-large {
    background-color: #7652d1;
    letter-spacing: 0.25rem;
    font-size: 2rem;

    &:hover {
      background-color: darken(#7652d1, 5%);
    }
  }
}
</style>

<template>
  <div class="modal-tip">
    <p v-text="$lt('widget_explainer_text')"></p>
    <p>
      <a class="btn btn-large btn-block"
         href="https://www.fightforthefuture.org/?widget=watch"
         target="_blank">
        {{ $lt('try_button_text') }}
      </a>
    </p>
    <div v-html="$lt('widget_explainer_part_2_html')"></div>

    <CopyToClipboard :text-to-copy="$lt('embed_code')" />
  </div> <!-- .modal-tip -->
</template>

<script>
import CopyToClipboard from '~/components/CopyToClipboard'

export default {
  components: {
    CopyToClipboard
  },

  methods: {
    $lt(key) {
      return this.$t(`components.WidgetInstructions.${key}`)
    }
  }
}
</script>
