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
  width: 700px;
  position: relative;
  background-color: $body-bg-color;
  padding: 40px 30px 30px;
  border-radius: 8px;
  text-align: center;

  .close {
    position: absolute;
    right:6px;
    top: -3px;
    color: #cad7ee;
    font-size: 36px;
    text-decoration: none;
    background-color: transparent;
    border:none;

    &:focus {
      outline: 0;
    }
  }

  blockquote {
    font-size: 19px;
    line-height: 1.4;
    font-style: italic;
    color: #a2b0ca;
    display: block;
  }

  .tip {
    background-color: #24233d;
    color: #fff;
    background-image: url('~/assets/images/tip-icon.png');
    background-size: 15px 15px;
    background-position: 8px center;
    background-repeat: no-repeat;
    margin: auto;
    display: inline-block;
    padding: 8px 8px 8px 30px;
    border-radius: 2px;
  }

  footer {
    background-color: #121122;
    margin: 30px -30px -30px;
    padding: 5px 10px 35px;
    border-radius: 0 0 8px 8px;

    h4 {
      color: #94a3c3;
      text-transform: uppercase;
      font-size: 16px;
    }

    .buttons {
      width: 96%;
      margin: auto;

      .flex-row {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .btn {
          flex: 1;
        }
      }

      .btn {
        font-size: 16px;
        padding: 13px;
        margin: 0 8px;
      }
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
