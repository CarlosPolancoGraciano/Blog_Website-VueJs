<template>
  <div>
    <div class="mt-2">
      <div class="container mt-5">
        <div class="row">
          <div class="col-2 text-left">
            <router-link to="/" class="btn btn-secondary">&larr; Volver al listado</router-link>
            <!-- <router-link class="btn btn-secondary">&larr; Volver a la busqueda</router-link> -->
          </div>
          <div class="col-10">
            <!-- Title -->
              <h1 class="mt-4">{{ post.title }}</h1>

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
              <div v-if="comment !== null">
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
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import AppIcon from '@/shared/AppIcon.vue'
import VueFroala from 'vue-froala-wysiwyg';
let moment = require('moment');

export default {
  name: 'post',
  component:{
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
      post: {},
      newComment: {
        content: ""
      },
      comment: {}
    }
  },
  computed:{
    transformPostDate(date){
      return this.moment(date).format('MMMM Do YYYY');
    }
  },
  mounted(){
    axios.all([this.retrievePostData()])
    .then(axios.spread(function (acct, perms) {
      // Both requests are now complete
      console.log('All requested');
    }));
  },
  methods:{
    retrievePostData(){
      if(this.$router.query.q === null){
        this.$router.push('home');
      }
      this.post = axiosGetRequest(`http://localhost:3000/posts?id=${this.$router.query.q}`)
      this.comment = axiosGetRequest(`http://localhost:3000/comments?postId=${this.$router.query.q}`)
    },
    createComment(){
      let comment = {
        id: 1,
        content: this.newComment.content,
        //Missing user id
        postId: this.$router.query.q
      }
      this.axiosPostRequest(`http://localhost:3000/comments?postId=${this.$router.query.q}`, comment);
    },
    axiosGetRequest(url){
      axios.get(url)
        .then((response) => {
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
