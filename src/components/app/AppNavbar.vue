<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" 
                   class="navbar-brand">
                   <img src="../../assets/WebIcon.png" width="30" height="30" alt="Logo Icon">
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"   aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">
              <AppIcon iconName="home" />
              Home
            </router-link>
          </li>
          <li class="nav-item active" v-if="!userLogged">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item active" v-if="!userLogged">
            <router-link class="nav-link" to="/login">
              <AppIcon iconName="sign-in" />
              Log in
            </router-link>
          </li>
          <li class="nav-item dropdown active" v-if="userLogged">
            <a class="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-toggle="dropdown">
              {{ userFullName }}
            </a>
            <div class="dropdown-menu" aria-labelledby="loginDropdown">
              <router-link class="dropdown-item" :to="'/profile/' + user.id">
                <AppIcon iconName="user" class="fa-lg" />
                Profile
              </router-link>
              <router-link class="dropdown-item" :to="'/myposts/' + user.id">
                <AppIcon iconName="th-list" />
                Posts
              </router-link>
              <router-link class="dropdown-item" to="/settings">
                <AppIcon iconName="cogs" />
                Settings
              </router-link>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item pointer" @click="logOut">
                <AppIcon iconName="sign-out" />
                Log out
              </a>
            </div>
        </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import AppIcon from '@/components/app/AppIcon.vue';
import { global } from '@/components/mixins/global.js';

export default {
  name: 'NavbarComponent',
  mixins: [global],
  components:{
    AppIcon
  },
  data(){
    return{
      user: {},
      userLogged: false
    }
  },
  computed:{
    userFullName(){
      return this.user.firstName + " " + this.user.lastName
    }
  },
  mounted(){
    this.checkForLoggedUser();
  },
  methods:{
    checkForLoggedUser(){
      let currentUser = this.getCurrentUser();
      
      if(currentUser !== null){
        this.user = currentUser;
        this.userLogged = true;

        // Save data in Vuex
        this.$store.dispatch('setCurrentUser', currentUser);
      }
    },
    logOut(){
      this.removeCurrentUser();
      this.userLogged = false;

      this.$router.push('/', () => { location.reload(); })
    }
  }
}
</script>
<style scoped>
.pointer{
  cursor: pointer;
}
</style>