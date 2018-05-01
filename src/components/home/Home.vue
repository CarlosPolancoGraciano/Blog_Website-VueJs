<template>
  <div>
    <!-- Page Header -->
    <header class="masthead">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="site-heading">
              <h1>Blog Company</h1>
              <span class="subheading">See and learn from the latest news</span>
              <div v-if="userLogged">
                <span class="subheading">
                  <router-link to="/NewPost" class="btn btn-success btn-lg">
                    Create a post
                    &nbsp;
                    <AppIcon iconName="caret-right" class="fa-lg" />
                  </router-link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Home Content -->
    <HomePostsComponent />
  </div>
</template>

<script>
// @ is an alias to /src
import HomePostsComponent from '@/components/home/HomePostsComponent.vue';
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'home',
  components: {
    HomePostsComponent,
    AppIcon
  },
  data(){
    return{
      currentUser: null,
      userLogged: false,
      avatar: null
    }
  },
  watch:{
    getUserLogged(newVal, oldVal){
      this.userLogged = this.getUserLogged;
    },
    getCurrentUser(newVal, oldVal){
      this.currentUser = this.getCurrentUser;
    }
  },
  mounted(){
    this.checkUserLogged();
  },
  methods:{
    checkUserLogged(){
      this.userLogged = this.getUserLogged;
      this.loadCurrentUser();
    },
    loadCurrentUser(){
      this.currentUser = this.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.currentUser = null;
      }
    }
  }
}
</script>

<style scoped>
header.masthead {
  background-image: url('../../assets/home-bg.jpg');
  margin-bottom: 50px;
  background: no-repeat center center;
  background-color: #868e96;
  background-attachment: scroll;
  position: relative;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

header.masthead .overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #212529;
  opacity: 0.5;
}

header.masthead .page-heading,
header.masthead .post-heading,
header.masthead .site-heading {
  padding: 200px 0 150px;
  color: white;
}

@media only screen and (min-width: 768px) {
  header.masthead .page-heading,
  header.masthead .post-heading,
  header.masthead .site-heading {
    padding: 200px 0;
  }
}

header.masthead .page-heading,
header.masthead .site-heading {
  text-align: center;
}

header.masthead .page-heading h1,
header.masthead .site-heading h1 {
  font-size: 50px;
  margin-top: 0;
}

header.masthead .page-heading .subheading,
header.masthead .site-heading .subheading {
  font-size: 24px;
  font-weight: 300;
  line-height: 1.1;
  display: block;
  margin: 10px 0 0;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

@media only screen and (min-width: 768px) {
  header.masthead .page-heading h1,
  header.masthead .site-heading h1 {
    font-size: 80px;
  }
}

header.masthead .post-heading h1 {
  font-size: 35px;
}

header.masthead .post-heading .meta,
header.masthead .post-heading .subheading {
  line-height: 1.1;
  display: block;
}

header.masthead .post-heading .subheading {
  font-size: 24px;
  font-weight: 600;
  margin: 10px 0 30px;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

header.masthead .post-heading .meta {
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  font-family: 'Lora', 'Times New Roman', serif;
}

header.masthead .post-heading .meta a {
  color: #fff;
}

@media only screen and (min-width: 768px) {
  header.masthead .post-heading h1 {
    font-size: 55px;
  }
  header.masthead .post-heading .subheading {
    font-size: 30px;
  }
}
</style>