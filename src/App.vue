<template lang="pug">
  div#app
    h1 Currency Converter
    input(type="text" id="initial" placeholder="0" v-model="initialCurrency")
    select(v-model="initialCountry")
      option(v-for="country in countries" v-model="initialCountry") {{country.currencyId}}
    p =
    input(type="text" id="convert" readonly placeholder="0" v-model="convertCurrency")
    select(v-model="convertCountry")
      option(v-for="country in countries") {{country.currencyId}}
    label(for="convert")

</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

const BASE_URL = "https://free.currencyconverterapi.com/api/v6";
const API_KEY = process.env.VUE_APP_API_KEY;

@Component
export default class App extends Vue {
  initialCurrency = null;
  convertCurrency = 0;
  initialCountry = "CAD";
  convertCountry = "USD";
  countries = [];
  rate = 0;

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
  }

  @Watch('initialCurrency')
  async onChildChange() {
    let { convertCurrency, rate } = this.$data;
    const { initialCountry, convertCountry } = this.$data;
    const conversionString = `${initialCountry}_${convertCountry}`;
    if (rate === 0) {
      const res = await fetch(
        `${BASE_URL}/convert?apiKey=${API_KEY}&q=${conversionString}&compact=ultra`
      );
      rate = await res.json();
      this.$data.rate = rate;
      this.getConversionString();
    }
    const initialCurrency = Number.parseInt(this.$data.initialCurrency);
    this.$data.convertCurrency = +(
      this.$data.initialCurrency * rate[Object.keys(rate)[0]]
    ).toFixed(2);
    return this.$data.convertCurrency;
  }

  getConversionString() {

  }
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
