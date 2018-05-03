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
                <div class="text-right" v-if="currentUser.id === post.userId && userLogged">
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
                <router-link :to="'/profile/' + post.username">{{ post.username }}</router-link>
              </p>

              <hr>

              <!-- Date/Time -->
              <p>Posted on {{ post.date | formatPostDate }}</p>

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
                          <at :members="users" v-model="vueAtContent">
                            <froala :tag="'textarea'" :config="config" v-model="newComment.content" contenteditable></froala>
                          </at>
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
                            <!-- No edit mode -->
                            <div class="media-body" v-if="!comment.editing">
                              <div class="row">
                                <div class="col-md-6 text-left">
                                  <h5 class="mt-0">{{ comment.userName }}</h5>
                                </div>
                                <div class="col-md-6 text-right" v-if="comment.userId == currentUser.id">
                                  <!-- Edit comment button -->
                                  <button class="btn btn-link" @click="editCommentMode(comment.id, comment.content)">
                                    <AppIcon iconName="pencil" class="fa-lg text-primary" />
                                  </button>
                                  <!-- Delete comment button -->
                                  <button class="btn btn-link" @click="deleteComment(comment.id)">
                                    <AppIcon iconName="times" class="fa-lg text-danger" />
                                  </button>
                                </div>
                              </div>
                              <div v-html="comment.content"></div>
                              <p class="mb-0 mt-2 text-primary">{{ comment.created_at | formatCommentDateFromNow }}</p>
                            </div>
                            <!-- Edit mode -->
                            <div class="media-body" v-if="comment.editing">
                              <div class="row">
                                <div class="col-md-6 text-left">
                                  <h5 class="mt-0">{{ comment.userName }}</h5>
                                </div>
                                <div class="col-md-6 text-right">
                                  <!-- Delete comment button -->
                                  <button class="btn btn-link" @click="deleteComment(comment.id)">
                                    <AppIcon iconName="times" class="fa-lg text-danger" />
                                  </button>
                                </div>
                              </div>
                              <b-form @submit.prevent="editComment(comment.id)">
                                <div class="form-group text-left">
                                  <at :members="users" v-model="vueAtContent">
                                    <froala :tag="'textarea'" :config="config" v-model="comment.content" contenteditable></froala>
                                  </at>
                                </div>
                                <b-button variant="primary"
                                          type="submit">
                                  <AppIcon iconName="floppy-o" />
                                  Save comment
                                </b-button>
                                &nbsp;
                                <b-button variant="danger" @click="cancelEditComment(comment.id)">
                                  <AppIcon iconName="ban" />
                                  Cancel
                                </b-button>
                              </b-form>
                            </div>
                            <!-- End edit mode -->
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
import At from 'vue-at';

export default {
  name: 'post',
  components: {
    AppIcon,
    At
  },
  filters:{
    formatPostDate(date){
      return moment(date).format('MMMM Do YYYY');
    },
    formatCommentDateFromNow(date){
      if(date === null) return '';
      return moment(date).fromNow();
    },
  },
  data(){
    return{
      notificationsURL: this.pusherURL(),
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      userLogged: null,
      editCommentContent: '',
      likes: 0,
      users: [],
      posts: [],
      comments: [],
      currentUser: {},
      vueAtContent: '',
      newComment: {},
      config: {
        events: {
          'froalaEditor.initialized': function () {
            // console.log('initialized')
          }
        }
      },
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
    if(this.$route.params.id === undefined){
      this.$router.push('/');
    }
    
    // Seek in API
    this.getAllInitialData();
  },
  methods:{
    getAllInitialData(){
      let that = this;

      axios.all([that.getPostData(), that.getCommentData(), that.getUsersData()])
      .then(axios.spread(function (post, comment, users) {
        // Both requests are now complete
      }));

       // Seek in Vuex
      this.checkUserLogged();
    },
    getPostData(){
      /* Request Post Data */
      return axios.get(`${this.axiosURL}/posts/${this.$route.params.id}`)
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
      return axios.get(`${this.axiosURL}/comments?postId=${this.$route.params.id}`)
            .then((response) => { 
              
              if(response.data != undefined && response.data.length > 0){
                let commentsEdited = response.data.map((obj, index, arr) => {
                  obj.editing = false;
                  return obj;
                });
                this.comments = commentsEdited.reverse();
                return;
              }
              this.comments = response.data;
            })
            .catch((error) => {
              if(error.response.status === 404){
                this.comments = [];
              }
            });
    },
    getUsersData(){
      // Vue-at main data 
      let that = this;

      return axios.get(`${that.axiosURL}/users`).then(response =>{
        // Complete users load
        if(response.data != undefined || response.data.length > 0){
          // Return all users username
          let returnedUsers = response.data.map((val, index, arr) => {
            return val.username
          });
          that.users = returnedUsers;
        }
      });
    },
    checkUserLogged(){
      this.userLogged = this.getUserLogged;
      this.loadCurrentUser();
    },
    loadCurrentUser(){
      this.currentUser = this.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.currentUser = {};
      }
    },
    postEnableComments(enableComments){
      if(enableComments !== "No"){
        return true;
      }else{
        return false;
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
               .then(response => {
                that.dynamicToastr({title: "Post deleted succesfully", msg:"", type: "success"});
               })
               .catch(error =>{
                 that.dynamicToastr({title: `Error in deleting file proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
    },
    getLatestCommentId(){
      axios.get(`${this.axiosURL}/comments`).then(response => {
            if(response.data.length === 0){
              return 0;
            }
            return response.data.length
          })
    },
    createComment(){
      let that = this;
      
      if(Object.keys(that.currentUser).length > 0 && this.userLogged){
        if(that.newComment.content !== ''){

        let comment = {
          id: that.getLatestCommentId() + 1,
          content: that.newComment.content,
          postId: Number(that.$route.params.id),
          created_at: new Date(),
          userId: that.currentUser.id,
          userName: that.currentUser.username,
          userAvatar: that.currentUser.avatar
        };

        axios.all([that.saveCommentInDB(comment), that.sendCommentNotifications()])
              .then(axios.spread(function (comment, notification) {
                // Both requests are now complete
              }));

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
    saveCommentInDB(comment){
      return axios.post(`${this.axiosURL}/comments`, comment)
        .then((response) => {
          this.newComment.content = '';
          this.dynamicToastr({title: 'Comment posted!', msg: 'Your comment was successfully posted', type: 'success' });
          this.getCommentData();
      });
    },
    editCommentMode(commentId, content){
      this.editCommentContent = content;
      this.comments.map((obj, index, arr) => {
        if(obj.id == commentId){
          obj.editing = true;
        }
      });
    },
    editComment(commentId){
      let that = this;
      // Obtaing edited comment in array
      let editedComment = this.comments.reduce((acc, obj) => {
        if(obj.id == commentId){
          delete obj.editing;
          return obj;
        }
      }, {});

      // Request to edit the comment
      axios.patch(`${this.axiosURL}/comments/${commentId}`, editedComment)
           .then(response => {
            swal("Comment updated succesfully", "", "success")
            .then(success => {
              if(success){
                that.editCommentContent = '';
                this.getCommentData();
              }
            });
          }).catch(error => {
            console.log("Error", error);
            console.log("Error http status", error.response.status);
          });
    },
    cancelEditComment(commentId){
      let that = this;
      this.comments.map((obj, index, arr) => {
        if(obj.id == commentId){
          obj.content = that.editCommentContent;
          obj.editing = false;
        }
      });
      that.editCommentContent = '';
    },
    sendCommentNotifications(username){
      
      return axios.get(`${this.axiosURL}/users?username=${username}`).then(response => {
              if(Object.keys(response.data).length > 0){
                let commentUser = response.data;

                let commentNotification = {
                  id: this.getLatestNotificationsId() + 1,
                  postId: Number(this.$route.params.id),
                  created_at: new Date(),
                  userId: commentUser.id,
                  username: commentUser.username
                };

                axios.post(`${this.notificationsURL}/notification`, commentNotification)
                  .then((response) => {
                    this.$store.dispatch('setNewNotification', true);
                    this.dynamicToastr({title: "Notification send", msg: '', type: 'success' });
                });
              }
            });
      
    },
    getLatestNotificationsId(){
      axios.get(`${this.axiosURL}/notifications`).then((response) => {
            let notificationsArray = [];
            notificationsArray = response.data;
            if(notificationsArray.length === 0){
              return 0;
            }
            return notificationsArray.length
          })
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
                //  swal({
                //    title: "Cooment deleted succesfully!",
                //    icon: "success"
                //  }).then((success) => {
                //    that.getCommentData();
                //  });
                that.dynamicToastr({title: "Comment deleted succesfully", msg:"", type: "success"});
                that.getCommentData();
                
               })
               .catch((error) =>{
                 that.dynamicToastr({title: `Error in deleting comment proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
    },
    axiosPostRequest(url, postObj){
      axios.post(url, postObj)
        .then((response) => {
          // console.log(response.data);
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
