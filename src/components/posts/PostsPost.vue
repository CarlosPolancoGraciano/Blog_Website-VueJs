<template>
  <div>
    <div class="mt-2">
      <div class="container mt-3 card mb-3">
        <div class="row card-body" v-for="post in posts" :key="post.id">
          <div class="col-12">
            <div class="row">
              <div class="col-md-4 text-left">
                <a href="#" @click="goBack" class="btn btn-secondary text-white">&larr; Go back</a>
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
            <div>
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

              
              <div>
                <!-- Comments Form -->
                <div class="card my-4">
                  <div class="card-header">
                    <div class="btn-group text-center">
                      <!-- Like And Unlike Buttons -->
                      <!-- Button to show if user is not logged -->
                      <template v-if="!userLogged">
                        <button disabled 
                              data-toggle="tooltip" 
                              data-placement="top" 
                              title="You have to log-in in order to like a post" 
                              class="btn btn-outline-danger btn-lg">
                          <AppIcon iconName="heart" />
                          Like ({{ likes }})
                        </button>
                      </template>
                      <!-- Button to show if user is logged -->
                      <template v-if="!userPostLike.isLiked && userLogged">
                        <button class="btn btn-outline-danger btn-lg" @click="likePost(post.id)">
                          <AppIcon iconName="heart" />
                          Like ({{ likes }})
                        </button>
                      </template>
                      <template v-if="userPostLike.isLiked && userLogged">
                        <button class="btn btn-outline-danger btn-lg" @click="unlikePost(post.id)" >
                          <AppIcon iconName="heart" />
                          Unlike ({{ likes }})
                        </button>
                      </template>
                      <!-- Bootstrap 4 Collapse Button -->
                      <button :disabled="!postEnableComments(post.enableComments)"
                              class="btn btn-outline-primary btn-lg" 
                              data-toggle="collapse" 
                              data-target="#commentCollapse" 
                              aria-expanded="false">
                        <AppIcon iconName="comment" />
                        Comment
                      </button>
                    </div>
                  </div>
                  <!-- Bootstrap 4 Collapse -->
                  <div class="card-body collapse" id="commentCollapse">
                    <!-- Bootstrap-Vue Form Tag -->
                    <b-form @submit.prevent="createComment">
                      <div class="form-group text-left">
                        <at :members="users"
                            name-key="username" 
                            v-model="vueAtContent">
                          <template slot="item" slot-scope="s">
                            <span v-text="s.item.username"></span>
                          </template>
                          <froala :tag="'textarea'" 
                                  v-model="newComment.content" 
                                  contenteditable>
                          </froala>
                        </at>
                      </div>
                      <!-- Save changes button -->
                      <b-button variant="primary"
                                type="submit">
                        <AppIcon iconName="floppy-o" />
                         Save comment
                      </b-button>
                      <!-- Space character -->
                      &nbsp;
                      <!-- Cancel changes button -->
                      <b-button variant="danger"
                                type="reset">
                         <AppIcon iconName="ban" />
                        Cancel
                      </b-button>
                    </b-form>
                    </div>
                </div>
                <!-- Single Comment -->
                  <template v-if="!postEnableComments(post.enableComments)">
                    <div>
                      <div class="jumbotron jumbotron-fluid">
                        <div class="container text-center">
                          <span class="h2">Sección de comentarios deshabilitada</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-if="comments.length > 0 && postEnableComments(post.enableComments)">
                    <div>
                      <div class="text-right">
                        <span class="text-muted">Sort order</span>
                        <button class="btn btn-light text-primary pb-1" @click="sortOrder = !sortOrder">
                          <AppIcon :iconName="sortOrder ? 'arrow-up' : 'arrow-down'" />
                        </button>
                      </div>
                      <paginate name="comments"
                                :list="comments"
                                :per="5" 
                                class="row">
                        <div class="col-md-12" v-for="comment in paginated('comments')" :key="comment.id">
                          <div class="card">
                            <div class="card-body text-left">
                              <div class="media mb-4">
                                <img class="img-fluid rounded-circle mx-auto d-block" 
                                      :src="expressNodeURL + '/' + comment.user.avatar" 
                                      :alt="comment.user.firstName" 
                                      width="50" 
                                      height="50">

                                <!-- No edit mode -->
                                <template v-if="commentEditId != comment.id">
                                  <div class="media-body">
                                    <div class="row">
                                      <div class="col-md-6 text-left">
                                        <h5 class="mt-0">{{ comment.user.username }}</h5>
                                      </div>
                                      <div class="col-md-6 text-right" v-if="comment.user.id == currentUser.id">
                                        <!-- Edit comment button -->
                                        <button class="btn btn-link" @click="editCommentMode(comment.id)">
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
                                </template>
                                
                                <!-- Edit mode -->
                                <template>
                                  <div class="media-body" v-if="commentEditId == comment.id">
                                    <div class="row">
                                      <div class="col-md-6 text-left">
                                        <h5 class="mt-0">{{ comment.user.username }}</h5>
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
                                        <at :members="users" name-key="username">
                                          <template slot="item" slot-scope="s">
                                            <img :src="expressNodeURL + '/' + s.item.avatar">
                                            <span v-text="s.item.username"></span>
                                          </template>
                                          <froala :tag="'textarea'" v-model="editedComment" contenteditable></froala>
                                        </at>
                                      </div>
                                      <b-button variant="primary"
                                                type="submit">
                                        <AppIcon iconName="floppy-o" />
                                        Save comment
                                      </b-button>
                                      &nbsp;
                                      <b-button variant="danger" @click="cancelEditComment()">
                                        <AppIcon iconName="ban" />
                                        Cancel
                                      </b-button>
                                    </b-form>
                                  </div>
                                </template>
                                <!-- End edit mode -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </paginate>
                      <paginate-links for="comments"
                        :async="true"
                        :limit="2"
                        :show-step-links="true"
                        :step-links="stepLinks"
                        :classes="paginateLinksCSS">
                      </paginate-links>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <div class="jumbotron jumbotron-fluid">
                        <div class="container text-center">
                          <span class="h2">No se han encontrado comentarios</span>
                        </div>
                      </div>
                    </div>
                  </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import At from 'vue-at';

export default {
  name: 'post',
  components: {
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
      expressNodeURL: this.expressURL(),
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      userLogged: false,
      currentUser: {},
      sortOrder: false,
      likes: 0,
      userPostLike: {},
      users: [],
      posts: [],
      comments: [],
      vueAtContent: '',
      commentEditId: 0,
      editedComment: '',
      newComment: {},
      paginate: ['comments'],
      stepLinks: {
        next: 'Next',
        prev: 'Previous'
      },
      paginateLinksCSS: {
        'ul': ['pagination', 'justify-content-center', 'pagination-lg'],
        'ul > li': 'page-item',
        'li > a': 'page-link',
        '.next > a': 'page-link',
        '.prev > a': 'page-link'
      }
    }
  },
  watch:{
    getUserLogged(newVal, oldVal){
      this.userLogged = this.getUserLogged;
    },
    getCurrentUser(newVal, oldVal){
      this.currentUser = this.getCurrentUser;
    },
    sortOrder(newVal, oldVal){
      newVal ? this.comments.reverse() : this.comments.reverse();
    },
    newComment: {
      handler(newVal){
        if(newVal.content != ''){
          // Obtain All Raw Mentioned Users
          let textUserMentioned = newVal.content.match(/@(\w+)/gim);
          let usersMentionedInfo = this.extractMentionedUsers(textUserMentioned);

          this.newComment.usersMentionedInfo = usersMentionedInfo ? usersMentionedInfo : [];
        }
      },
      deep: true
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

       // Seek in Vuex
      this.userLogged = this.getUserLogged;
      this.currentUser = this.getCurrentUser;

      // Active loading overlay component
      this.setIsLoading();

      //Current Post info - loading component is removed in this method
      this.getPostData();
      //Current Post Comments
      this.getCommentData(); 
      //Current Post Likes
      this.getLikesData();
      //All users to mention in comments
      this.getUsersData();
    },
    getPostData(){
      let that = this;

      /* Request Post Data */
      axios.get(`${this.axiosURL}/posts/${this.$route.params.id}`)
                  .then(response => {
                    let post = response.data;

                    // Request for Post Owner Info
                    axios.get(`${that.axiosURL}/users/${post.userId}`)
                        .then(response => {

                            post.username = response.data.username;

                            that.posts.push(post);

                            that.removeIsLoading();
                        });
                  });
    },
    getCommentData(){
      let that = this;

      /* Request Comment Data */
      axios.get(`${this.axiosURL}/comments?postId=${this.$route.params.id}`)
                  .then(response => {
                    let comment = response.data;

                    if(!_.isEmpty(comment)){
                      that.comments = comment.reverse();
                    }else{
                      that.comments = comment;
                    }

                  });
    },
    getLikesData(){
      let that = this;

      axios.get(`${this.axiosURL}/likes?postId=${this.$route.params.id}`)
            .then(response => {
              let likes = response.data;

              //Execute on likes response
              that.likes = likes.length > 0 ? likes.length : 0;

              if(that.likes > 0 && that.userLogged){

                // Save my like of this post if it exist [It's an object]
                let currentUserLike = likes.reduce((acc, val, index) => {
                  if(val.user.id === that.currentUser.id){
                    return val;
                  }
                }, {});

                // If like was giving set it to true - else set it to false
                that.userPostLike = {
                  likeId: currentUserLike.id,
                  isLiked: Object.keys(currentUserLike).length > 0 ? true : false
                }

              }
            });
    },
    getUsersData(){
      let that = this;
      // Vue-at main data 
      axios.get(`${this.axiosURL}/users`)
            .then(response => {
              let users = response.data;

              // Complete users load
              if(!_.isEmpty(users)){

                // Return all users username
                let returnedUsers = users.map((user, index, arr) => {
                  return {
                    id: user.id,
                    avatar: user.avatar,
                    username: user.username
                  }
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

      let likeActivity = { 
        id: this.getLatestTableId('activity') + 1, 
        type: 'like',
        created_at: new Date(),
        postId: Number(this.$route.params.id),
        user: this.currentUser,
      };

      axios.all([this.saveLikeInDB(), this.setUserActivity(likeActivity)])
            .then(axios.spread((likes, activity) => {
              // Both requests are now complete
              this.getLikesData();

              this.userPostLike = true;

              this.dynamicToastr({title: 'You liked this post!', msg: '', type: 'success' });
            }));
    },
    saveLikeInDB(){

      let like = {
        id: this.getLatestTableId('comments') + 1,
        postId: Number(this.$route.params.id),
        created_at: new Date(),
        user: this.currentUser,
      };

      return axios.post(`${this.axiosURL}/likes`, like);
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
      
      if(_.isEmpty(this.currentUser) && this.userLogged){
        if(this.newComment.content !== ''){
          let isNewNotification = _.isEmpty(this.newComment.usersMentionedInfo) ? true : false;

          let commentActivity = { 
            id: this.getLatestTableId('activity') + 1, 
            type: 'comment',
            created_at: new Date(),
            postId: Number(this.$route.params.id),
            user: this.currentUser
          };

        axios.all([this.saveCommentInDB(), this.setUserActivity(commentActivity), isNewNotification ? this.sendCommentNotifications() : ''])
              .then(axios.spread((comment, activity, notifications) => {
                // All requests are now complete

                // Comment promise
                this.newComment.content = '';

                this.getCommentData();

                this.dynamicToastr({title: 'Comment posted!', msg: 'Your comment was successfully posted', type: 'success' });

              }));

        }else{
          this.dynamicToastr({title: 'Oops!', msg: 'The comments field is empty', type: 'error' });
        }
        
      }else{
        swal("Oops!", "No puedes comentar debes iniciar sesión primero", "error")
          .then(success => {
            this.$router.push('/login');
          })
      }
      
    },
    saveCommentInDB(){
      let comment = {
        id: this.getLatestTableId('comments') + 1,
        content: this.newComment.content,
        postId: Number(this.$route.params.id),
        created_at: new Date(),
        user: this.currentUser,
      };

      return axios.post(`${this.axiosURL}/comments`, comment);
    },
    editCommentMode(commentId){
      this.commentEditId = commentId;

      // Return content from selected comment to edit
      const selectedComment = _.find(this.comments, { id: commentId });
      this.editedComment = selectedComment.content;
    },
    editComment(commentId){
      // Obtaing edited comment in array
      let editedComment = this.comments;

      // Request to edit the comment
      axios.patch(`${this.axiosURL}/comments/${commentId}`, editedComment)
           .then(response => {

            swal("Comment updated succesfully", "", "success")
            .then(success => {

              if(success){
                this.getCommentData();
              }

            });

          }).catch(error => {
            console.error("Error", error);
            console.error("Error http status", error.response.status);
          });
    },
    cancelEditComment(){
      this.commentEditId = 0;
    },
    sendCommentNotifications(){
      let commentNotification = {
        id: this.getLatestTableId('notifications') + 1,
        mentionedUsersId: this.newComment.usersMentionedInfo,
        commentOwner: {
          id: this.currentUser.id,
          username: this.currentUser.username
        },
        created_at: new Date(),
        updated_at: '',
        posts: this.posts,
      };
      
      return axios.post(`${this.expressNodeURL}/notification`, commentNotification);
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
      return axios.post(`${this.axiosURL}/activity`, activityObj);
    },
    extractMentionedUsers(textUserMentioned){
      if(_.isEmpty(textUserMentioned)){
        // Remove all @ characters in text
        const USERS_MENTIONED = textUserMentioned.map(mentioned => mentioned.replace('@',''));

        // Retrieve mentioned users data from user property
        return usersMentionedInfo = this.users.reduce((acumulator, value, index) => {
          // Obtain dynamically all users mentioned usernames captured
          let currentUserMentioned = USERS_MENTIONED[index];

          //If user vue property is equal to a currentUserMentioned then push it to save it
          if ([currentUserMentioned].includes(value.username)) { 
            acumulator.push(value.id)
          } 
              
          return acumulator;
        }, [])
      }
    },
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>
<style scoped>

</style>
