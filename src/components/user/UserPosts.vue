<template>
  <div>
    <div class="container-fluid my-5">
      <div class="row">
        <!-- Posts options -->
        <div class="col-md-4 border-right">
          <div class="text-center">
            <h4>Categorias de tus posts</h4>
          </div>
          <div class="list-group">
            <button class="list-group-item list-group-item-action"
                    @click="getUserPublishedPosts"
                    :class="{'active': publishIsActive}">Publish posts</button>
            <button class="list-group-item list-group-item-action"
                    @click="getUserDraftedPosts"
                    :class="{'active': draftedIsActive}">Draft posts</button>
            <button class="list-group-item list-group-item-action">Deleted posts</button>
          </div>
        </div>
        <!-- Posts options content -->
        <div class="col-md-8 border-left">
          <b-table striped 
                  hovered
                  :fields="postsfields" 
                  :items="posts">
          </b-table>
          <b-pagination size="md" :total-rows="posts.length" v-model="currentPage" :per-page="25">
          </b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { global } from '@/components/mixins/global';
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'UserPosts',
  mixins: [global],
  components:{
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      publishIsActive: false,
      draftedIsActive: false,
      currentPage: 0,
      currentUser: {},
      posts: [],
      postsfields: []
    }
  },
  mounted(){
    this.loadCurrentUser();
    this.getUserPublishedPosts();
  },
  methods:{
    loadCurrentUser(){
      this.currentUser = this.$store.getters.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.currentUser = {};
      }
    },
    getUserPublishedPosts(){
      let that = this;

      // Setting active class binding
      that.draftedIsActive = false;
      that.publishIsActive = true;
      that.setPostsFields();

      /* Request All Posts */
      axios.get(`${that.axiosURL}/posts?draft=false&userid=${that.currentUser.id}`)
         .then((response) => { 
            let respArray = [];
            let postArray = [];
            respArray = response.data;
            // console.log(response.data);

            if(respArray.length > 0){
              for(let post in respArray){

                // Setting specific data from posts
                let postObj = {
                  id: respArray[post].id,
                  title: respArray[post].title,
                  comments: that.returnCommentsAmount(respArray[post].id),
                  likes: that.returnLikesAmount(respArray[post].id),
                  created_at: moment(respArray[post].date).format('MMMM Do YYYY')
                };

                postArray.push(postObj);
              }
            }

            // console.log("custom object", postArray);
            that.posts = postArray.reverse();
          });
    },
    getUserDraftedPosts(){
      let that = this;

      // Setting active class binding
      that.publishIsActive = false;
      that.draftedIsActive = true;
      that.setPostsFields(true);

      /* Request All Posts */
      axios.get(`${that.axiosURL}/posts?draft=true&userId=${that.currentUser.id}`)
         .then((response) => { 
           debugger;
            let respArray = [];
            let postArray = [];
            respArray = response.data;
            // console.log("posts response", response.data);

            if(respArray.length > 0){
              for(let post in respArray){
                let postObj = {
                  id: respArray[post].id,
                  title: respArray[post].title,
                  comments: that.returnCommentsAmount(respArray[post].id),
                  likes: that.returnLikesAmount(respArray[post].id),
                  created_at: moment(respArray[post].date).format('MMMM Do YYYY')
                };
                postArray.push(postObj);
              }
            }

            that.posts = postArray.reverse();
        })
    },
    setPostsFields(isDeleted = false){

      let fields = [
        {key: 'id', sortable: false, label: '#'},
        {key: 'title', sortable: true, label: 'Title'},
        {key: 'comments', sortable: true, label: 'Comments Qty.'},
        {key: 'likes', sortable: true, label: 'Likes Qty.'},
        {key: 'created_at', sortable: true, label: 'Created at'}
      ];

      this.postsFields = fields;
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
  }
}
</script>
<style scoped>

</style>
