<template lang="pug">
  div#app
    h1 Currency Converter
    input(type="text" id="initial" placeholder="0" v-model="initialCurrency")
    label(for="initial") CAD = 
    input(type="text" id="convert" placeholder="0" v-model="convertCurrency")
    label(for="convert") USD

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const BASE_URL = 'https://free.currencyconverterapi.com/api/v6';
const API_KEY = process.env.VUE_APP_API_KEY;

@Component({
  data() {
    return {
      initialCurrency: null,
      convertCurrency: null,
      countries: [],
      rate: null,
    };
  },
  async mounted() {
    if (localStorage.countries) {
      this.$data.countries = JSON.parse(localStorage.countries);
    } else if (!localStorage.countries) {
      try {
        const res = await fetch(`${BASE_URL}/countries?apiKey=${API_KEY}`);
        const countries = await res.json();
        this.$data.countries = Object.values(countries.results);
        localStorage.countries = JSON.stringify(this.$data.countries);
      } catch (e) {
        console.log(e);
      }
    }
  },
  watch: {
    async initialCurrency() {
      let { convertCurrency, rate } = this.$data;
      if (rate === null) {
        const res = await fetch(`${BASE_URL}/convert?apiKey=${API_KEY}&q=CAD_USD&compact=ultra`);
        rate = await res.json();
        this.$data.rate = rate;
      }
      const initialCurrency = Number.parseInt(this.$data.initialCurrency);
      this.$data.convertCurrency = +(this.$data.initialCurrency * rate[Object.keys(rate)[0]]).toFixed(2);
      return this.$data.convertCurrency;
    },
  },
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
