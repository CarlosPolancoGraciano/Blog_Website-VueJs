<template>
  <div>
    <div class="container-fluid my-5">
      <div class="row">
        <!-- Posts options -->
        <div class="col-md-4 border-right">
          <div class="text-center">
            <h4>Posts categories</h4>
          </div>
          <div class="list-group">
            <button class="list-group-item list-group-item-action"
                    @click="showUsersPosts()"
                    :class="{'active': publishIsActive}">Publish posts</button>
            <button class="list-group-item list-group-item-action"
                    @click="showUsersPosts('drafted')"
                    :class="{'active': draftedIsActive}">Draft posts</button>
            <button class="list-group-item list-group-item-action"
                    @click="showUsersPosts('deleted')"
                    :class="{'active': deletedIsActive}">Deleted posts</button>
          </div>
        </div>
        <!-- Posts options content -->
        <div class="col-md-8 border-left">
          <b-table striped 
                  hovered
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :current-page="currentPage" 
                  :per-page="perPage"
                  :fields="postsfields" 
                  :items="posts">
             <template slot="id" slot-scope="data">
                {{data.item.id}}
              </template>
              <template slot="title" slot-scope="data">
                {{data.item.title}}
              </template>
              <template slot="comments" slot-scope="data">
                {{data.item.comments}}
              </template>
              <template slot="likes" slot-scope="data">
                {{data.item.likes}} 
              </template>
              <template slot="created_at" slot-scope="data">
               {{data.item.created_at}}
              </template>
          </b-table>
          <b-pagination size="md" :total-rows="posts.length" v-model="currentPage" :per-page="perPage">
          </b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'UserPosts',
  components:{
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      publishIsActive: false,
      draftedIsActive: false,
      deletedIsActive: false,
      perPage: 25,
      sortDesc: false,
      sortBy: 'title',
      currentPage: 0,
      currentUser: {},
      postsfields: {},
      likes: [],
      comments: [],
      posts: [],
      requestPosts: []
    }
  },
  watch:{
    getCurrentUser(newVal, oldVal){
      this.currentUser = this.getCurrentUser;
    }
  },
  computed:{
    // getUserPublishedPosts(){
    //   let postArray = null;

    //   // Setting active class binding
    //   this.setPostsFields();

    //   let resultArray = this.requestPosts.filter((val, index , arr) => {
    //     return val.draft == false && val.is_deleted == false;
    //   });

    //   postArray = resultArray.map((val, index , arr) => {
    //     return {
    //       id: val.id,
    //       title: val.title,
    //       comments: this.returnCommentsAmount(val.id),
    //       likes: this.returnLikesAmount(val.id),
    //       created_at: moment(val.date).format('MMMM Do YYYY')
    //     }
    //   });

    //   return postArray;
    // },
    // getUserDraftedPosts(){
    //   let postArray = null;

    //   // Setting active class binding
    //   this.setPostsFields();

    //   let resultArray = this.requestPosts.filter((val, index , arr) => {
    //     return val.draft == true && val.is_deleted == false;
    //   });

    //   postArray = resultArray.map((val, index , arr) => {
    //     return {
    //       id: val.id,
    //       title: val.title,
    //       comments: this.returnCommentsAmount(val.id),
    //       likes: this.returnLikesAmount(val.id),
    //       created_at: moment(val.date).format('MMMM Do YYYY')
    //     }
    //   });

    //   return postArray;
    // },
    // getUserDeletedPosts(){
    //   let postArray = null;

    //   // Setting active class binding
    //   this.setPostsFields(true);

    //   let resultArray = this.requestPosts.filter((val, index , arr) => {
    //     return val.is_deleted == true;
    //   });

    //   postArray = resultArray.map((val, index , arr) => {
    //     return {
    //       id: val.id,
    //       title: val.title,
    //       comments: this.returnCommentsAmount(val.id),
    //       likes: this.returnLikesAmount(val.id),
    //       created_at: moment(val.date).format('MMMM Do YYYY'),
    //       published_at: moment(val.date).format('MMMM Do YYYY')
    //     }
    //   });

    //   return postArray;
    // }
  },
  mounted(){
    this.getInitialData();
  },
  methods:{
    getInitialData(){
      let that = this;
      // Show loading component
      this.setIsLoading();

      this.currentUser = this.getCurrentUser;

      axios.all([this.getLikesData(), this.getCommentsData()])
      .then(axios.spread(function (likesResp, commentResp) {
        // Remove loading component
        that.removeIsLoading();

        // All requests are now complete

        // Likes request successful
        that.likes = likesResp.data.length > 0 ? likesResp.data : [];

        // Comments request successful
        that.comments = commentResp.data.length > 0 ? commentResp.data : [];

        // Published first posts request as default
        that.showUsersPosts();

      }));
    },
    getLikesData(){
      /* Request All Likes */
      return axios.get(`${this.axiosURL}/likes`);
    },
    getCommentsData(){
      /* Request All Comments */
      return axios.get(`${this.axiosURL}/comments`);
    },
    showUsersPosts(type = 'published'){
      // Show loading component
      this.setIsLoading();

      let query = '';
      switch(type){
        case 'published':
          this.publishIsActive = true;
          this.draftedIsActive = false;
          this.deletedIsActive = false;
          query = 'draft=false&is_deleted=false';
          break;
        case 'drafted':
          this.publishIsActive = false;
          this.draftedIsActive = true;
          this.deletedIsActive = false;
          query = 'draft=true&is_deleted=false';
          break;
        case 'deleted':
          this.publishIsActive = false;
          this.draftedIsActive = false;
          this.deletedIsActive = true;
          query = 'is_deleted=true';
          break;
      }

      axios.get(`${this.axiosURL}/posts?${query}`)
          .then(response => {
            if(type === 'deleted'){
              this.setPostsFields(true);
              this.posts = response.data.map((val, index , arr) => {
                return {
                  id: val.id,
                  title: val.title,
                  comments: this.returnCommentsAmount(val.id),
                  likes: this.returnLikesAmount(val.id),
                  created_at: moment(val.date).format('MMMM Do YYYY'),
                  published_at: type === 'deleted' ? moment(val.date).format('MMMM Do YYYY') : ''
                }
              });
            }else{
              this.setPostsFields();
              this.posts = response.data.map((val, index , arr) => {
                return {
                  id: val.id,
                  title: val.title,
                  comments: this.returnCommentsAmount(val.id),
                  likes: this.returnLikesAmount(val.id),
                  created_at: moment(val.date).format('MMMM Do YYYY')
                }
              });
            }
            // Remove is loading component
            this.removeIsLoading();
          })
          .catch(error => {
            console.error("ERROR!", error);
          });
    },
    setPostsFields(isDeleted = false){
      let fields = null;

      if(isDeleted == true){
        fields = {
          id: {
            label: '#',
            sortable: false
          },
          title: {
            label: 'Title',
            sortable: true
          },
          comments: {
            label: 'Comments Qty.',
            sortable: true
          },
          likes: {
            label: 'Likes Qty.',
            sortable: true
          },
          created_at: {
            label: 'Created at',
            sortable: true
          },
          published_at: {
            label: 'Published at',
            sortable: true
          }
        }
      }else{
        fields = {
          id: {
            label: '#',
            sortable: false
          },
          title: {
            label: 'Title',
            sortable: true
          },
          comments: {
            label: 'Comments Qty.',
            sortable: true
          },
          likes: {
            label: 'Likes Qty.',
            sortable: true
          },
          created_at: {
            label: 'Created at',
            sortable: true
          }
        }
      }

      this.postsfields = fields;
    },
    transformPostDates(date){
      return moment(date).format('MMMM Do YYYY');
    },
    returnLikesAmount(postId){
      return this.likes.reduce((acc, obj, index) => {
        return obj.postId == postId ? acc += 1 : acc;
      }, 0);
    },
    returnCommentsAmount(postId){
      return this.comments.reduce((acc, obj, index) => {
        return obj.postId == postId ? acc += 1 : acc;
      }, 0);
    },
  }
}
</script>
<style scoped>

</style>
