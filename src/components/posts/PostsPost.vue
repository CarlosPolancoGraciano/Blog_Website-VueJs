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
              <p>Posted on {{ formatPostDate(post.date) }}</p>

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
                        <div class="form-group text-left">
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
                  <div class="row" v-if="comments.length > 0">
                    <div class="col-md-12" v-for="(comment, index) in comments" :key="index">
                      <div class="card">
                        <div class="card-body text-left">
                          <div class="media mb-4">
                            <img class="mr-3 rounded-circle" src="http://placehold.it/50x50" alt="User picture">
                            <div class="media-body">
                              <div class="row">
                                <div class="col-md-6 text-left">
                                  <h5 class="mt-0">{{ comment.userName }}</h5>
                                </div>
                                <div class="col-md-6 text-right">
                                  <!-- Delete post button -->
                                  <button class="btn btn-link" @click="deleteComment(comment.id)">
                                    <AppIcon iconName="times" class="fa-lg text-danger" />
                                  </button>
                                </div>
                              </div>
                              <div v-html="comment.content"></div>
                              <p class="mb-0 mt-2 text-primary">{{ formatCommentDateFromNow(comment.created_at) }}</p>
                            </div>
                          </div>
                        </div>
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
      comments: [],
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
      axios.get(`${this.axiosURL}/comments?postId=${this.$route.params.id}`)
        .then((response) => { 
          let commentArray = [];
          if(response.data != undefined && response.data.length > 0){
            commentArray = response.data;
            this.comments = commentArray.reverse();
            console.log(response.data);
          }
        })
        .catch((error) => {
          if(error.response.status === 404){
            this.comments = [];
          }
        });
    },
    deleteComment(commentId){
      let that = this;
      swal({
        title: "Are you sure?",
        text: "This comment will be deleted permanently",
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
            text: "Accept",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true
          }
        }
      }).then((success) => {
        if(success){
          axios.delete(`${that.axiosURL}/comments/${commentId}`)
               .then((response) => {
                that.dynamicToastr({title: "Post deleted succesfully", msg:"", type: "success"});
                that.getCommentData();
               })
               .catch((error) =>{
                 that.dynamicToastr({title: `Error in deleting comment proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
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
      
      if(Object.keys(that.currentUser).length > 0){
        if(that.newComment.content !== ''){

            let comment = {
              id: that.getLatestCommentId() + 1,
              content: that.newComment.content,
              postId: Number(that.$route.params.id),
              created_at: new Date(),
              userId: that.currentUser.id,
              userName: that.currentUser.firstName + " " + that.currentUser.lastName,
              userAvatar: that.currentUser.avatar
            };
            
            axios.post(`${that.axiosURL}/comments`, comment)
                  .then((response) => {
                    that.newComment.content = '';
                    that.dynamicToastr({title: 'Comment posted!', msg: 'Your comment was successfully posted', type: 'success' });
                    that.getCommentData();
                  });
        }else{
          that.dynamicToastr({title: 'Oops!', msg: 'The comments field is empty', type: 'error' });
        }
        
      }else{
        swal("Oops!", "No puedes comentar debes iniciar sesión primero", "error")
          .then((success) => {
            that.$router.push('/login');
          })
      }
      
    },
    getLatestCommentId(){
      axios.get(`${this.axiosURL}/comments`).then((response) => {
            let commentsArray = [];
            commentsArray = response.data;
            if(commentsArray.length === 0){
              return 0;
            }
            return commentsArray.length
          })
    },
    formatPostDate(date){
      return moment(date).format('MMMM Do YYYY');
    },
    formatCommentDateFromNow(date){
      if(date === null) return '';
      return moment(date).fromNow();
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
