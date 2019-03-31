<template lang="pug">
  div#app
    h1  Currency Converter
    input(type="text" id="initial" placeholder="0" v-model="initialCurrency")
    label(for="initial") CAD = 
    input(type="text" id="convert" placeholder="0" v-model="convertCurrency")
    label(for="convert") USD

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  data() {
    return {
      initialCurrency: null,
      convertCurrency: null,
    }
  },
  computed: {
    initToConv: function () {
      let { convertCurrency } = this.$data;
      const initialCurrency = Number.parseInt(this.$data.initialCurrency);
      this.$data.convertCurrency = +(this.$data.initialCurrency * 0.75).toFixed(2);
      return this.$data.convertCurrency;
    }
  }
})
export default class App extends Vue {
}
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
