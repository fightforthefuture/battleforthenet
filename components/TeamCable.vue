<style lang="scss" scoped>
ul {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    width: 50%;
    padding: 1.5rem 2rem;

    &.verizon {
      padding-top: 0.5rem;
    }

    img {
      object-fit: contain;
    }
  }

  @include big-screen {
    margin: 0 -8rem;

    li {
      width: 25%;
      padding: 2rem;

      &.verizon {
        padding-top: 1.1rem;
      }
    }
  }
}
</style>

<template>
  <ul>
    <li><img src="~/assets/images/att-logo.svg" alt="ATT"></li>
    <li><img src="~/assets/images/comcast-logo.svg" alt="Comcast"></li>
    <li class="verizon"><img src="~/assets/images/verizon-logo.svg" alt="Verizon"></li>
    <li><img src="~/assets/images/spectrum-logo.svg" alt="Spectrum"></li>
  </ul>
</template>
