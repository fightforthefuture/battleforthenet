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
    position: relative;
    margin: 1.5rem 0;
    overflow: hidden;

    input {
      padding-right: 75px; // NOTE: Magic number
      background-color: #262035;
      color: #8a7cae;
      font-family: monospace;
      font-size: 1.4rem;
      word-wrap: break-word;
    }

    .btn-copy {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
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
         href="https://www.fightforthefuture.org?widget=july23"
         target="_blank">
        {{ $lt('try_button_text') }}
      </a>
    </p>
    <p v-html="$lt('widget_explainer_part_2_html')"></p>

    <div class="embed-code">
      <button
        v-clipboard
        :data-clipboard-text="$lt('embed_code')"
        class="btn btn-copy"
        v-text="$lt('copy_button_text')">
      </button>

      <input type="text" :value="$lt('embed_code')" readonly />
    </div> <!-- .embed-code -->
  </div> <!-- .modal-tip -->
</template>

<script>
export default {
  methods: {
    $lt(key) {
      return this.$t(`components.WidgetInstructions.${key}`)
    }
  }
}
</script>
