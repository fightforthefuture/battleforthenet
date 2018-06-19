<style lang="scss">
body.modal-open {
  overflow: hidden;
}

.modal-wrapper {
  z-index: 1984;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  overflow: auto;
  animation: fade-in .2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 70rem;
  position: relative;
  color: #000;
  background-color: #fff;
  padding: 4rem 3rem 3rem;
  border-radius: $border-radius;
  text-align: left;

  .close {
    position: absolute;
    right: .6rem;
    top: -.3rem;
    color: inherit;
    font-size: 3.6rem;
    text-decoration: none;
    background-color: transparent;
    border:none;

    &:focus {
      outline: 0;
    }
  }

  h2 {
    font-size: 4rem;
    margin: 0;
    color: inherit;

    strong {
      color: #1abe50;
    }
  }

  p {
    font-weight: 300;
    font-size: 2rem;
  }

  input, textarea, select {
    border: .2rem solid #111;
    padding: 2rem;
    font-size: 1.7rem;
  }

  .btn-cta {
    background-color: #000;

    span {
      background: none;
      padding: 0;
    }
  }

  p.disclaimer {
    small, a {
      color: inherit;
    }
  }
}
</style>

<template>
  <div class="modal-wrapper">
    <div class="modal">
      <button class="close" @click="close()">&times;</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    if (process.browser) {
      document.querySelector('body').classList.add('modal-open')
    }
  },

  destroyed() {
    if (process.browser) {
      document.querySelector('body').classList.remove('modal-open')
    }
  },

  methods: {
    close() {
      this.$parent.modalVisible = false
    }
  }
}
</script>
