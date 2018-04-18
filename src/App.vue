<template>
  <div id="app">
    <NavbarComponent />
    <router-view />
    <FooterComponent />
  </div>
</template>
<script>
import NavbarComponent from '@/components/AppNavbar.vue';
import FooterComponent from '@/components/AppFooter.vue';

//Seek for bootstrap js
require('bootstrap');

export default {
  name:'App',
  components: {
    NavbarComponent,
    FooterComponent
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
