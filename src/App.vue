<template lang="pug">
  div#app
    h1 Currency Converter
    div(app-data)
      v-text-field(v-model="initialCurrency" label="Initial Currency") 
      // input(type="text" id="initial" placeholder="0" v-model="initialCurrency")
      v-autocomplete(
        v-model="initialCountry"
        :items="countries"
        item-value="currencyId"
        item-text="currencyId"
      )
      // select(v-model="initialCountry")
      //   option(v-for="country in countries" v-model="initialCountry") {{country.currencyId}}
      p =
      v-text-field(v-model="convertCurrency" readonly label="Converted Currency") 
      // input(type="text" id="convert" readonly placeholder="0" v-model="convertCurrency")
      v-autocomplete(
        v-model="convertCountry"
        :items="countries"
        item-value="currencyId"
        item-text="currencyId"
      )
      v-btn(@click="swap") Swap Currencies

</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

const BASE_URL = 'https://free.currencyconverterapi.com/api/v6';
const API_KEY = process.env.VUE_APP_API_KEY;

@Component
export default class App extends Vue {
  private initialCurrency = null;
  private convertCurrency: number = 0;
  private initialCountry: string = 'CAD';
  private convertCountry: string = 'USD';
  private countries: any = [];
  private rate: number = 0;

  private async mounted() {
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

  @Watch('initialCurrency', { immediate: true, deep: true })
  private async onChildChange() {
    this.calculateCurrency();
  }

  @Watch('initialCountry', { immediate: true, deep: true })
  private async onChildChange1() {
    this.calculateCurrency();
  }

  @Watch('convertCountry', { immediate: true, deep: true })
  private async onChildChange2() {
    this.calculateCurrency();
  }

  private async getRate() {
    const { initialCountry, convertCountry } = this.$data;
    const convert: string = `${initialCountry}_${convertCountry}`;

    if (this.$cookies.isKey(convert)) { // Cookie exists with exchange rate, set to state
      this.$data.rate = this.$cookies.get(convert);
    } else { // Fetch rate, set to cookie, set to state
      try {
        const res = await fetch(
          `${BASE_URL}/convert?apiKey=${API_KEY}&q=${convert}&compact=ultra`,
        );
        let rate = await res.json();
        rate = rate[Object.keys(rate)[0]];
        const today = new Date();
        // Add one to current hour to always expire on the next hour (when currency converter updates rates)
        const expire = new Date(
          today.getFullYear(),
          today.getMonth(), today.getDate(),
          today.getHours() + 1, 0, 0);
        this.$cookies.set(convert, rate, expire);
        this.$data.rate = rate;
      } catch (e) {
        console.log(e);
      }
    }
  }

  private calculateCurrency() {
    const { rate } = this.$data;
    this.getRate();
    const initialCurrency = Number.parseInt(this.$data.initialCurrency, 10);
    this.$data.convertCurrency = +(this.$data.initialCurrency * rate).toFixed(2);
  }

  private swap() {
    console.log('Swap Currencies');
    const temp: string = this.$data.initialCountry;
    this.$data.initialCountry = this.$data.convertCountry;
    this.$data.convertCountry = temp;
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
