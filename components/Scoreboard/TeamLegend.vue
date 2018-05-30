<style lang="scss" scoped>
.legend {
  font-size: 1.8rem;
  background-color: #171321;
  border-radius: $border-radius;
  padding: 2rem;
  display: flex;
  justify-content: space-around;

  label {
    color: #fff;
    padding: .5rem 1.5rem;
    font-weight: 600;
    border-radius: $border-radius;
  }

  .team-cable {
    color: #ff2a2a;

    label {
      background: linear-gradient(90deg, rgba(255,74,74,1) 0%, rgba(255,56,56,1) 100%);
    }
  }

  .team-internet {
    color: #0cdbb1;

    label {
      background: linear-gradient(90deg, rgba(55,191,164,1) 0%, rgba(53,118,173,1) 100%);
    }
  }
}
</style>

<template>
  <div class="legend">
    <span class="team-cable"><label>Red</label> = Team Cable</span>
    <span class="team-internet"><label>Blue</label> = Team Internet</span>
  </div>
</template>
