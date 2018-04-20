<template>
  <div>
    <div class="mt-2">
      <div class="container mt-3 card mb-3">
        <div class="row card-body" v-for="(post, index) in posts" :key="index">
          <div class="col-12">
            <div class="row">
              <div class="text-left">
                <router-link to="/" class="btn btn-secondary">&larr; Volver al listado</router-link>
                <!-- <router-link class="btn btn-secondary">&larr; Volver a la busqueda</router-link> -->
              </div>
            </div>
            <div class="">
              <!-- Title -->
              <h1>{{ post.title }}</h1>

              <!-- Author -->
              <p class="lead">
                by
                <a href="#">Start Bootstrap</a>
              </p>

              <hr>

              <!-- Date/Time -->
              <p>Posted on {{ transformPostDate(post.date) }}</p>

              <hr>

              <!-- Post Content -->
              <froalaView v-model="post.content"></froalaView>

              <hr>

              <div v-if="postEnableComments(post.enableComments) === true">
                <!-- Comments Form -->
                <div class="card my-4">
                  <h5 class="card-header">Leave a Comment:</h5>
                    <div class="card-body">
                      <form>
                        <div class="form-group">
                          <b-form-textarea v-model="newComment.content"
                                          placeholder="Enter your comment message"
                                          :rows="3">
                          </b-form-textarea>
                        </div>
                        <b-button variant="primary"
                                  @click="createComment">
                          <AppIcon iconName="floppy-o" />
                          Save comment
                        </b-button>
                      </form>
                    </div>
                </div>
                <!-- Single Comment -->
                  <div v-if="comment.length > 0">
                    <div class="media mb-4">
                      <img class="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="User picture">
                        <div class="media-body">
                          <h5 class="mt-0">Commenter Name</h5>
                          <span>{{ comment.content }}</span>
                        </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="jumbotron jumbotron-fluid">
                      <div class="container text-center">
                        <span class="h2">No se han encontrado comentarios</span>
                      </div>
                    </div>
                  </div>
              </div>
              <div v-else>
                <div class="jumbotron jumbotron-fluid">
                  <div class="container text-center">
                    <span class="h2">Sección de comentarios deshabilitada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import AppIcon from '@/components/app/AppIcon.vue';
import VueFroala from 'vue-froala-wysiwyg';
import moment from 'moment';
import { global } from '@/components/mixins/global';

export default {
  name: 'post',
  mixins: [global],
  components: {
    AppIcon
  },
  data(){
    return{
      config: {
        events: {
          'froalaEditor.initialized': function () {
            console.log('initialized')
          }
        }
      },
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      posts: [],
      comment: [],
      likes: 0,
      newComment: {
        content: ""
      }
    }
  },
  mounted(){
    if(this.$route.params.id === undefined){
      this.$router.push('/');
    }
    /* Request Post Data */
    axios.get(`${this.axiosURL}/posts/${this.$route.params.id}`)
         .then((response) => { this.posts.push(response.data) });
    /* Request Comment Data */
    axios.get(`${this.axiosURL}/comments/${this.$route.params.id}`)
         .then((response) => { 
           let commentArray = [];
           commentArray.push(response.data);
           this.comment = commentArray.reverse();
         })
         .catch((error) => {
           if(error.response.status === 404){
             this.comment = [];
           }
         });
    
  },
  methods:{
    createComment(){
      let comment = {
        id: 1,
        content: this.newComment.content,
        //Missing user id
        postId: this.$route.params.id
      }
      this.axiosPostRequest(`${this.axiosURL}/comments`, comment);
    },
    transformPostDate(date){
      return moment(date).format('MMMM Do YYYY');
    },
    postEnableComments(enableComments){
      if(enableComments !== "No"){
        return true;
      }else{
        return false;
      }
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