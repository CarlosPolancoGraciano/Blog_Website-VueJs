<template>
  <div class="container">
    <!-- If there is post show this -->
    <div v-if="posts.length > 0">
      <!-- Blog Post -->
      <div class="card mb-4" v-for="(post, index) in posts" v-bind:key="index">
        <div class="card-body">
          <!-- User Image -->
          <router-link :to="'/profile/' + post.user.id">
            <img class="rounded-circle" src="../../assets/UserAvatar.jpeg" alt="Card image cap">
          </router-link>

          <!-- Post Title -->
          <router-link :to="'/post/' + post.id" class="text-muted"><h2 class="card-title">{{ post.title }}</h2></router-link>

          <!-- Post Content (Limit to 200 characters) -->
          <p class="card-text">
            <span v-html="returnPostParcialContent(post.content)"></span>
          </p>

          <!-- See more Post Content -->
          <router-link :to="'/post/' + post.id" class="btn btn-primary">Read More &rarr;</router-link>
        </div>
        <div class="card-footer text-muted">
          <div class="row">
            <div class="col-6">
              <!-- More information of the post -->
              Posted on <router-link :to="'/post/' + post.id">
                          <span>{{ transformPostDates(post.date) }}</span>
                        </router-link> 
              by
              <router-link :to="'/profile/' + post.user.id" class="text-muted">
                {{ post.user.username }}
              </router-link> - <span>{{ returnEditedMode(post.edited) }}</span>
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
                  <router-link :to="'/post/' + post.id" class="text-muted">
                    <span>
                      <i class="fa fa-comments"></i>
                      &nbsp;{{ returnCommentsAmount(post.id) }}
                    </span>
                  </router-link>
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
import VueFroala from 'vue-froala-wysiwyg';
import moment from 'moment';
import { global } from '@/components/mixins/global';

export default {
  name: 'HomePostsComponent',
  mixins: [global],
  data(){
    return{
      posts: [],
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL()
    }
  },
  mounted(){
    /* Request All Posts */
    axios.get(`${this.axiosURL}/posts`)
         .then((response) => { 
            let postArray = [];
            postArray = response.data;
            this.posts = postArray.reverse();
          });
  },
  methods:{
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
      let likesQuantity = [];
      axios.get(`${this.axiosURL}/likes/${postId}`)
           .then((response) => { likesQuantity = response.data })
           .catch((error) => { 
             if(error.response.status === 404){
               likesQuantity = [];
             } 
           });
      // console.log(likesQuantity);
      return likesQuantity.length;
    },
    returnCommentsAmount(postId){
      let commentsQuantity = [];
      axios.get(`${this.axiosURL}/comments/${postId}`)
           .then((response) => { commentsQuantity = response.data })
           .catch((error) => {
             if(error.response.status === 404){
               commentsQuantity = [];
             }
           });
      // console.log(commentsQuantity);
      return commentsQuantity.length;
    },
    returnPostParcialContent(postContent){
      return String(postContent).substring(0, 199);
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