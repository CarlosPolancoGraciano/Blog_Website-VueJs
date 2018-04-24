<template>
  <div>
    <div class="mt-2">
      <div class="container mt-3 card mb-3">
        <div class="row card-body" v-for="(post, index) in posts" :key="index">
          <div class="col-12">
            <div class="row">
              <div class="col-md-4 text-left">
                <router-link to="/" class="btn btn-secondary">&larr; Volver al listado</router-link>
                <!-- <router-link class="btn btn-secondary">&larr; Volver a la busqueda</router-link> -->
              </div>
              <div class="col-md-4 offset-md-4 text-right">
                <div class="text-right" v-if="currentUser.id === post.userId">
                  <!-- Delete post button -->
                  <button class="btn btn-link" @click="deletePost(post.id)">
                    <AppIcon iconName="times" class="fa-lg text-danger" />
                  </button>
                </div>
              </div>
            </div>
            <div class="">
              <!-- Title -->
              <h1>{{ post.title }}</h1>

              <!-- Author -->
              <p class="lead">
                by
                <a href="#">{{ post.username }}</a>
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
                      <b-form @submit.prevent="createComment">
                        <div class="form-group">
                          <froala :tag="'textarea'" :config="config" v-model="newComment.content"></froala>
                        </div>
                        <b-button variant="primary"
                                  type="submit">
                          <AppIcon iconName="floppy-o" />
                          Save comment
                        </b-button>
                        &nbsp;
                        <b-button variant="danger"
                                  type="reset">
                          <AppIcon iconName="ban" />
                          Cancel
                        </b-button>
                      </b-form>
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
import AppIcon from '@/components/app/AppIcon.vue';
import VueFroala from 'vue-froala-wysiwyg';
import { global } from '@/components/mixins/global';

export default {
  name: 'post',
  mixins: [global],
  components: {
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      likes: 0,
      posts: [],
      comment: [],
      currentUser: {},
      newComment: {
        content: ""
      },
      config: {
        events: {
          'froalaEditor.initialized': function () {
            // console.log('initialized')
          }
        }
      },
    }
  },
  mounted(){
    if(this.$route.params.id === undefined){
      this.$router.push('/');
    }
    
    this.getPostData();     
    this.getCommentData();
    this.loadCurrentUser();
  },
  methods:{
    getPostData(){
      /* Request Post Data */
      axios.get(`${this.axiosURL}/posts/${this.$route.params.id}`)
        .then((response) => { 
          let post = response.data;

          // Request for Post Owner Info
          axios.get(`${this.axiosURL}/users/${response.data.id}`)
            .then((response) => {
              post.username = response.data.username;
              this.posts.push(post);
            });
        });
    },
    getCommentData(){
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
    loadCurrentUser(){
      this.currentUser = this.$store.getters.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.currentUser = {};
      }
    },
    deletePost(postId){
      let that = this;
      swal({
        title: "Are you sure?",
        text: "This post will be deleted permanently",
        icon: "info",
        buttons:{
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Yes, I'm sure!",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true
          }
        }
      }).then((success) => {
        if(success){
          axios.delete(`${that.axiosURL}/posts/${postId}`)
               .then((response) => {
                //  swal({
                //    title: "Post deleted succesfully!",
                //    icon: "success"
                //  });
                that.dynamicToastr({title: "Post deleted succesfully", msg:"", type: "success"});
               })
               .catch((error) =>{
                 that.dynamicToastr({title: `Error in deleting file proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
    },
    createComment(){
      let that = this;
      
      if(that.currentUser !== undefined){
        if(that.newComment.content !== ''){
            let comment = {
              id: 1,
              content: that.newComment.content,
              postId: that.$route.params.id,
              userId: that.currentUser.id
            };
          that.axiosPostRequest(`${that.axiosURL}/comments`, comment);
        }
        that.dynamicToastr({title: 'Oops!', msg: 'The comments field is empty', type: 'error' });
      }else{
        swal("Oops!", "No puedes comentar debes iniciar sesión primero", "error")
          .then((success) => {
            that.$router.push('/login');
          })
      }
      
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
    },
    dynamicToastr(toastrObj){
      let that = this;
      that.$toastr( 'add',
                      { title: toastrObj.title, 
                        msg: toastrObj.msg, 
                        clickClose: true, 
                        timeout: 10000, 
                        position: 'toast-bottom-right', 
                        type: toastrObj.type });
    }
  }
}
</script>
<style scoped>

</style>
