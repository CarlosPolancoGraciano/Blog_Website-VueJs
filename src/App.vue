<template>
  <div id="app">
    <NavbarComponent />
    <router-view />
    <FooterComponent />
    <loading :active.sync="isLoading"></loading>
    <notify-me
      container="notification"
      status="alert-info"
      close="bulma"
      :event-bus="eventBus" scope="{data}">
        <template slot="content">
            <div style="width: 100%; word-break: break-all; text-align: left">
                <h4><b>{{ data.title }}</b></h4>
                <p style="margin: 0">{{ data.content }}</p>
                <p class="text-right text-muted">{{ data.created_at | formatDate }}</p>
            </div>
        </template>
    </notify-me>
  </div>
</template>
<script>
import NavbarComponent from '@/components/app/AppNavbar.vue';
import FooterComponent from '@/components/app/AppFooter.vue';
import { eventBus } from './eventBus/EventBus';

//Seek for bootstrap js
require('bootstrap');

export default {
  name:'App',
  filters:{
    formatDate(date){
      if(date === null) return '';
      return moment(date).fromNow();
    }
  },
  components: {
    NavbarComponent,
    FooterComponent
  },
  data(){
    return {
      isLoading: false,
      eventBus
    }
  },
  created(){
    this.eventBus.$emit('notify-me', { title: '', content: '', created_at: null })
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
