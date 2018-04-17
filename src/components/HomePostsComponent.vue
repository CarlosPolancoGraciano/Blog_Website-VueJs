<template>
  <div class="container">
    <!-- If there is post show this -->
    <div v-if="posts.length > 0">
      <!-- Blog Post -->
      <div class="card mb-4" v-for="(post, index) in posts" v-bind:key="index">
        <div class="card-body">
          <!-- User Image -->
          <router-link to="/"><img class="rounded-circle" src="../assets/UserAvatar.jpeg" alt="Card image cap"></router-link>

          <!-- Post Title -->
          <router-link to="/Post" class="text-muted"><h2 class="card-title">{{ post.title }}</h2></router-link>

          <!-- Post Content (Limit to 200 characters) -->
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla? Quos cum ex quis soluta, a laboriosam. Dicta expedita corporis animi vero voluptate voluptatibus possimus, veniam magni quis!</p>

          <!-- See more Post Content -->
          <router-link :to="'/Post?q=' + post.id" class="btn btn-primary">Read More &rarr;</router-link>
        </div>
        <div class="card-footer text-muted">
          <div class="row">
            <div class="col-6">
              <!-- More information of the post -->
              Posted on <router-link :to="'/Post?q=' + post.id"><span>{{ transformPostDates(post.date) }}</span></router-link> by
              <router-link to="/" class="text-muted">UserName</router-link> - <span>{{ returnEditedMode(post.edited) }}</span>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
              <div class="row">
                <div class="col-2"></div>
                <div class="col-8">
                  <!-- Total Likes -->
                  <span><i class="fa fa-heart"></i>&nbsp;{{ returnLikesAmount(post.id) }}</span>
                  &nbsp;
                  <!-- Total Comments -->
                  <router-link :to="'/Post?q=' + post.id" class="text-muted"><span><i class="fa fa-comments"></i>&nbsp;{{ returnCommentsAmount(post.id) }}</span></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ul class="pagination justify-content-center mb-4">
        <li class="page-item">
          <a class="page-link" href="#">&larr; Older</a>
        </li>
        <li class="page-item disabled">
          <a class="page-link" href="#">Newer &rarr;</a>
        </li>
      </ul>
    </div>
    <!-- If not show this -->
    <div v-else>
      <div class="jumbotron jumbotron-fluid">
        <div class="container text-center">
          <span class="h2">No se han encontrado publicaciones</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
//let moment = require('moment');

export default {
  name: 'HomePostsComponent',
  data(){
    return{
      posts: []
    }
  },
  computed: {
    
  },
  mounted(){
    this.retrieveAllPosts();
  },
  methods:{
    retrieveAllPosts(){
      debugger;
      let postsArray = [];
      postsArray = this.axiosGetRequest(`http://localhost:3000/posts`);
      if(postsArray === undefined){
        this.posts = [];
      }
      this.posts = postsArray;
      console.log(this.posts);
    },
    transformPostDates(date){
      return moment(date).format('MMMM Do YYYY');
    },
    returnEditedMode(wasEdited){
      if(wasEdited){
        return 'Edited';
      }else{
        return 'Not Edited';
      }
    },
    returnLikesAmount(postId){
      let likesQuantity = []
      likesQuantity = this.axiosGetRequest(`http://localhost:3000/likes?id=${postId}`);
      return likesQuantity.length;
    },
    returnCommentsAmount(postId){
      let commentsQuantity = [];
      commentsQuantity = this.axiosGetRequest(`http://localhost:3000/comments?id=${postId}`);
      return commentsQuantity.length;
    },
    axiosGetRequest(url){
      axios.get(url)
        .then((response) => {
          console.log(response.data);
          return response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
    axiosPostRequest(url, postObj){
      axios.post(url, postObj)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
</script>
<style scoped>

</style>