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

              
              <div >
                <!-- Comments Form -->
                <div class="card my-4">
                  <div class="card-header">
                    <div class="btn-group text-center">
                      <!-- Like And Unlike Buttons -->
                      <!-- Button to show if user is not logged -->
                      <button v-if="!userLogged" 
                              disabled 
                              data-toggle="tooltip" 
                              data-placement="top" 
                              title="You have to log-in in order to like a post" 
                              class="btn btn-outline-danger btn-lg">
                        <AppIcon iconName="heart" />
                        Like ({{ likes }})
                      </button>
                      <!-- Button to show if user is logged -->
                      <button class="btn btn-outline-danger btn-lg" @click="likePost(post.id)" v-if="!userPostLike.isLiked && userLogged">
                        <AppIcon iconName="heart" />
                        Like ({{ likes }})
                      </button>
                      <button class="btn btn-outline-danger btn-lg" @click="unlikePost(post.id)" v-if="userPostLike.isLiked && userLogged">
                        <AppIcon iconName="heart" />
                        Unlike ({{ likes }})
                      </button>
                      <!-- Bootstrap 4 Collapse Button -->
                      <button :disabled="postEnableComments(post.enableComments) != true"
                              class="btn btn-outline-primary btn-lg" 
                              data-toggle="collapse" 
                              data-target="#commentCollapse" 
                              aria-expanded="false" 
                              aria-controls="multiCollapseExample2">
                        <AppIcon iconName="comment" />
                        Comment
                      </button>
                    </div>
                  </div>
                  <!-- Bootstrap 4 Collapse -->
                  <div class="card-body collapse" id="commentCollapse">
                    <b-form @submit.prevent="createComment">
                      <div class="form-group text-left">
                        <at :members="users" 
                            v-model="vueAtContent">
                          <froala :tag="'textarea'" 
                                  :config="config" 
                                  v-model="newComment.content" 
                                  contenteditable>
                          </froala>
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
                  <div class="row" v-if="comments.length > 0 && postEnableComments(post.enableComments) === true">
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
                  <div v-if="comments.length == 0 && postEnableComments(post.enableComments) === true">
                    <div class="jumbotron jumbotron-fluid">
                      <div class="container text-center">
                        <span class="h2">No se han encontrado comentarios</span>
                      </div>
                    </div>
                  </div>
              </div>
              <div v-if="postEnableComments(post.enableComments) != true">
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
      userLogged: false,
      editCommentContent: '',
      likes: 0,
      userPostLike: {},
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

      axios.all([that.getPostData(), that.getCommentData(), that.getLikesData(), that.getUsersData()])
      .then(axios.spread(function (post, comment, likes, users) {
        // Both requests are now complete
      }));

       // Seek in Vuex
      this.userLogged = this.getUserLogged;
      this.currentUser = this.getCurrentUser;
    },
    getPostData(){
      /* Request Post Data */
      return axios.get(`${this.axiosURL}/posts/${this.$route.params.id}`)
              .then((response) => { 
                let post = response.data;

                // Request for Post Owner Info
                axios.get(`${this.axiosURL}/users/${response.data.userId}`)
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
    getLikesData(){
      return axios.get(`${this.axiosURL}/likes?postId=${this.$route.params.id}`)
                  .then(response => {
                    this.likes = response.data.length > 0 ? response.data.length : 0;
                    if(this.likes > 0 && this.userLogged){
                      // Save my like of this post if it exist [It's an object]
                      let currentUserLike = response.data.reduce((acc, val, index) => {
                        if(val.userId === this.currentUser.id){
                          return val;
                        }
                      }, {});
                      // If like was giving set it to true - else set it to false
                      this.userPostLike = {
                        likeId: currentUserLike.id,
                        isLiked: Object.keys(currentUserLike).length > 0 ? true : false
                      }
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
          axios.patch(`${that.axiosURL}/posts/${postId}`, { is_deleted: true })
               .then(response => {
                 swal("Post deleted succesfully", "", "success")
                  .then(success => {
                    if(success){
                      this.$router.push('/');
                    }
                  });
               })
               .catch(error =>{
                 that.dynamicToastr({title: `Error in deleting post proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
    },
    likePost(){
      let like = {
          id: this.getLatestTableId('comments') + 1,
          postId: Number(this.$route.params.id),
          created_at: new Date(),
          userId: this.currentUser.id,
      };
      let likeActivity = { 
        id: this.getLatestTableId('activity') + 1, 
        type: 'like', 
        userId: this.currentUser.id, 
        postId: Number(this.$route.params.id) 
      };
      axios.all([this.saveLikeInDB(like), this.setUserActivity(likeActivity)])
            .then(axios.spread(function (likes) {
              // Both requests are now complete
             
            }));
    },
    saveLikeInDB(like){
      return axios.post(`${this.axiosURL}/likes`, like)
                  .then(response => {
                    this.getLikesData();
                    this.userPostLike = true;
                    this.dynamicToastr({title: 'You liked this post!', msg: '', type: 'success' });
                  })
                  .catch(error => {
                    this.dynamicToastr({title: 'Oops!', msg: 'Error while liking this post', type: 'error' });
                    console.error("Error while liking this post", error);
                  });
    },
    unlikePost(){
      axios.delete(`${this.axiosURL}/likes/${this.userPostLike.likeId}`)  
          .then(response => {
            this.userPostLike = false;
            this.getLikesData();
            this.dynamicToastr({title: 'Post unliked!', msg: '', type: 'success' });
          })
          .catch(error => {
            console.error("Error while unliking a post", error);
          })
    },
    createComment(){
      let that = this;
      
      if(Object.keys(that.currentUser).length > 0 && this.userLogged){
        if(that.newComment.content !== ''){

        let comment = {
          id: that.getLatestTableId('comments') + 1,
          content: that.newComment.content,
          postId: Number(that.$route.params.id),
          created_at: new Date(),
          userId: that.currentUser.id,
          userName: that.currentUser.username,
          userAvatar: that.currentUser.avatar
        };
        let commentActivity = { 
          id: this.getLatestTableId('activity') + 1, 
          type: 'comment', 
          userId: this.currentUser.id, 
          postId: Number(this.$route.params.id) 
        };

        axios.all([that.saveCommentInDB(comment), this.setUserActivity(commentActivity)])
              .then(axios.spread(function (comment, activity) {
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
          this.getCommentData();
          this.dynamicToastr({title: 'Comment posted!', msg: 'Your comment was successfully posted', type: 'success' });
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
                  id: this.getLatestTableId('notifications') + 1,
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
    setUserActivity(activityObj){
        axios.post(`${this.axiosURL}/activity`, activityObj)
          .then(response => {
            // console.log("Activity response", response.data);
          })
          .catch(error => {
            console.log("Error on activity request", error);
          })
            // switch(activityObj.type){
            //     case 'like':
            //         break;
            //     case 'comment':
            //         break;
            //     case 'post':
            //         break;
            // }
    },
    axiosPostRequest(url, postObj){
      axios.post(url, postObj)
        .then((response) => {
          // console.log(response.data);
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
