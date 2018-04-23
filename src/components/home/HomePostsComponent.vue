<template>
  <div class="container">
    <!-- If there is post show this -->
    <div v-if="posts.length > 0">
      <!-- Blog Post -->
      <div class="card mb-4" v-for="(post, index) in posts" v-bind:key="index">
        <div class="card-body">
          <div class="row">
            <div class="col-4 offset-md-4">
              <!-- User Image -->
              <router-link :to="'/profile/' + post.userId">
                <img class="rounded-circle mx-auto d-block" src="../../assets/UserAvatar.jpeg" alt="Card image cap">
              </router-link>
            </div>
            <div class="col-4" v-if="currentUser.id === post.userId">
              <div class="text-right">
                <!-- Delete post button -->
                <button class="btn btn-link" @click="deletePost(post.id)">
                  <AppIcon iconName="times" class="fa-lg text-danger" />
                </button>
              </div>
            </div>
          </div>

          <!-- Post Title -->
          <router-link :to="'/post/' + post.id" class="text-muted"><h2 class="card-title">{{ post.title }}</h2></router-link>

          <!-- Post Content (Limit to 200 characters) -->
          <p class="card-text">
            <span v-html="returnPostParcialContent(post.content)"></span>
          </p>

          <!-- Post Button Actions -->
          <div class="btn-group" role="group" aria-label="Post owner button" v-if="currentUser.id === post.userId">
            <!-- See more Post Content if post owner is logged in -->
            <router-link :to="'/post/' + post.id" class="btn btn-primary">Read More &rarr;</router-link>
            <!-- Edit Post Content -->
            <router-link :to="'/editpost/' + post.id" class="btn btn-warning">
              <AppIcon iconName="pencil-square-o" /> 
              Edit post
            </router-link>
          </div>
          <div v-else>
            <!-- See more Post Content -->
            <router-link :to="'/post/' + post.id" class="btn btn-primary">Read More &rarr;</router-link>
          </div>
        </div>

        <!-- Post footer content -->
        <div class="card-footer text-muted">
          <div class="row">
            <div class="col-6">
              <!-- More information of the post -->
              Posted on <router-link :to="'/post/' + post.id">
                          <span>{{ transformPostDates(post.date) }}</span>
                        </router-link> 
              by
              <!-- Redirect to Post Owner Profile  -->
              <router-link :to="'/profile/' + post.userId" class="text-muted">
              <!-- Post Owner Username  -->
                {{ post.username }}
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
                  <!-- Redirect to the post -->
                  <router-link :to="'/post/' + post.id" class="text-muted">
                    <span>
                      <i class="fa fa-comments"></i>
                      <!-- Total Comments -->
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
import VueFroala from 'vue-froala-wysiwyg';
import { global } from '@/components/mixins/global';
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'HomePostsComponent',
  components:{
    AppIcon
  },
  mixins: [global],
  data(){
    return{
      posts: [],
      postOwner: {},
      currentUser: {},
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL()
    }
  },
  mounted(){
    this.getAllPosts();
    this.loadCurrentUser();
  },
  methods:{
    loadCurrentUser(){
      this.currentUser = this.$store.getters.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.currentUser = {};
      }
    },
    getAllPosts(){
      /* Request All Posts */
      axios.get(`${this.axiosURL}/posts?draft=false`)
         .then((response) => { 
            let postArray = [];
            postArray = response.data;
            // console.log(response.data);

            //Request for user info
            axios.get(`${this.axiosURL}/users/${postArray[0].userId}`)
            .then((response) => {
              let username = response.data.username;
              // console.log(username);

              //Setting username
              postArray[0].username = username;
              // console.log(postArray);

              //Newer to older
              this.posts = postArray.reverse();
            });
            
          });
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
                that.dynamicToastr(
                  {title: "Post deleted succesfully", msg:"", type: "success"},
                  () => { location.reload() },
                  () => { location.reload() }
                );
               })
               .catch((error) =>{
                 that.dynamicToastr({title: `Error in deleting file proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
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
      let likesQuantity = [];
      axios.get(`${this.axiosURL}/likes/${postId}`)
           .then((response) => { 
             if(response.data.length > 0){
               likesQuantity = response.data;
               return;
             }
           })
           .catch((error) => { 
             if(error.response.status === 404){
               likesQuantity = [];
               return;
             } 
           });
      return likesQuantity.length;
    },
    returnCommentsAmount(postId){
      let commentsQuantity = [];
      axios.get(`${this.axiosURL}/comments/${postId}`)
           .then((response) => { 
              if(response.data.length > 0){
                commentsQuantity = response.data;
                return;
              }
            })
           .catch((error) => {
             if(error.response.status === 404){
               commentsQuantity = [];
               return;
             }
           });
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
    },
    dynamicToastr(toastrObj, onClosed = () => {}, onClicked = () => {}){
      let that = this;
      that.$toastr( 'add',
                      { title: toastrObj.title, 
                        msg: toastrObj.msg, 
                        clickClose: true, 
                        timeout: 1500, 
                        position: 'toast-bottom-right', 
                        type: toastrObj.type,
                        onClosed: onClosed,
                        onClicked: onClicked });
    }
  }
}
</script>
<style scoped>

</style>