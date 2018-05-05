<template>
  <div id="app">
    <NavbarComponent />
    <router-view />
    <FooterComponent />
    <loading :active.sync="isLoading"></loading>
  </div>
</template>
<script>
import NavbarComponent from '@/components/app/AppNavbar.vue';
import FooterComponent from '@/components/app/AppFooter.vue';

//Seek for bootstrap js
require('bootstrap');

export default {
  name:'App',
  components: {
    NavbarComponent,
    FooterComponent
  },
  data(){
    return {
      isLoading: false
    }
  },
  methods:{
    returnIsLoading(newVal){
      this.isLoading = newVal;
    }
  }
}
</script>

<style>
@import url('../node_modules/bootstrap/dist/css/bootstrap.min.css');
@import url('../fontawesome-4.7.0/css/font-awesome.min.css');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
