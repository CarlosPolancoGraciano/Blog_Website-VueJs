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
          <!-- If new notification arrived -->
          <!-- <li class="nav-item active" v-if="userLogged">
            <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown"
               v-if="counterNewNotifications > 0">
              Notifications <span class="badge badge-primary">{{ counterNewNotifications }}</span>
            </a>
            <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" 
               v-else>
              Notifications
            </a>
            <div class="dropdown-menu" aria-labelledby="notificationDropdown">
              <span v-if="commentNotifications.length > 0">
                <span v-for="(notification, index) in commentNotifications" :key="index">
                  <router-link class="dropdown-item" :to="'/post/' + notification.postId">
                    You were mention by {{ notification.username }} in a post
                  </router-link>
                </span>
              </span>
              <a href="#" class="dropdown-item" v-else>
                  No mention!
              </a>
            </div>
          </li> -->
          <li class="nav-item dropdown active" v-if="userLogged">
            <a class="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-toggle="dropdown">
              {{ userFullName }}
            </a>
            <div class="dropdown-menu" aria-labelledby="loginDropdown">
              <router-link class="dropdown-item" :to="'/profile/' + user.username">
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
import { mapGetters } from 'vuex';
import AppIcon from '@/components/app/AppIcon.vue';
import Pusher from 'pusher-js';

export default {
  name: 'NavbarComponent',
  components:{
    AppIcon
  },
  data(){
    return{
      notificationURL: this.pusherURL(),
      axiosURL: this.requestURL(),
      counterNewNotifications: 0,
      commentNotifications: [],
      user: {},
      userLogged: false,

    }
  },
  computed:{
    userFullName(){
      return this.user.firstName + " " + this.user.lastName
    },
    // ...mapGetters({
    //   // newNotification: 'getNewNotification'
    // })
  },
  watch: {
    getCurrentUser(newVal, oldVal){
      this.user = this.getCurrentUser;
    }
    // newNotification(newVal, oldVal){
    //   console.log(newVal);
    //   if(newVal){
    //     this.subscribe();
    //     this.$store.dispatch('setNewNotification', false);
    //   }
    // }
  },
  created () {
    // this.subscribe();
  },
  mounted(){
    //Execute this when app initialize
    this.checkForPreviousLoggedUser();
  },
  methods:{
    // subscribe(){
    //   // Pusher methods! 
    //   let pusher = new Pusher('f9a2f81061f58802038f', { cluster: 'mt1' });
    //   pusher.subscribe('private-notifications');
    //   pusher.bind('notification_added', data => {
    //     this.commentNotifications.unshift(data.content);
    //     console.log(this.commentNotifications);
    //   });

    // },
    checkForPreviousLoggedUser(){
      //Execute this when app initialize
      let currentUser = this.getWebStorageCurrentUser();

      if(currentUser != undefined || currentUser != null){
        // Save current user with Vuex
        this.setAuthCurrentUser(currentUser);

        // Set userLogged state to true
        this.setUserLogged();
      }
    },
    currentUserLoggedState(newVal){
      if(newVal){
        this.saveUserLoggedInfo();
      }
      if(!newVal){
        this.userLogged = this.getUserLogged;
      }
    },
    saveUserLoggedInfo(){
      // Execute this if user login
      let currentUser = this.getCurrentUser;

      if(currentUser !== null){
        this.user = currentUser;
        this.userLogged = this.getUserLogged;
      }
    },
    logOut(){
      // Clean from WebStorage
      this.removeWebStorageCurrentUser();

      //Clean from Vuex
      this.removeAuthCurrentUser();
      this.removeUserLogged();

      this.$router.push('/');
    }
  }
}
</script>
<style scoped>
.pointer{
  cursor: pointer;
}
</style>