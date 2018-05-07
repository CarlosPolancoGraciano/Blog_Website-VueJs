<template>
  <div class="container">
    <!-- Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-5">
            <label class="text-muted" for="filterSelect">Type of filter</label>
            <!-- Select field | use to select type of filter -->
            <select class="form-control" id="filterSelect" v-model="filter.selectedFilter">
              <option v-for="(option, index) in filterOptions" :key="index">{{ option }}</option>
            </select>
          </div>
          <div class="col-md-7">
            <!-- Conditionally render the date picker -->
            <div v-if="filter.selectedFilter == 'Date'">
              <div class="form-row">
                <div class="col">
                  <label class="text-muted" for="dateRangeOne">From</label>
                  <input  id="dateRangeOne" 
                          type="date" 
                          @input="getFilterPosts" 
                          v-model="filter.dateRangeOne" 
                          class="form-control">
                </div>
                <div class="col">
                  <label class="text-muted" for="dateRangeTwo">To</label>
                  <input  id="dateRangeTwo" 
                          type="date"
                          @input="getFilterPosts" 
                          v-model="filter.dateRangeTwo" 
                          class="form-control">
                </div>
              </div>
            </div>
            <!-- If not render the text box -->
            <div v-else>
              <label class="text-muted" for="filterInput">Filter</label>
              <input type="text"
                     :disabled="inputDisabled" 
                     v-model="filter.filterTxt" 
                     id="filterInput"
                     class="form-control" 
                     placeholder="Type according to your search"
                     @keyup="getFilterPosts">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- If there is post show this -->
    <div v-if="posts.length > 0">
      <!-- Blog Post -->
      <paginate name="blogs"
                :ref="'paginator'"
                :list="filterPosts"
                :per="5">
        <div class="card mb-4" v-for=" (post, index) in paginated('blogs')" :key="index">
          <div class="card-body">
            <div class="row">
              <div class="col-4 offset-md-4">
                <!-- User Image -->
                <router-link :to="'/profile/' + post.username">
                  <img class="img-fluid rounded-circle mx-auto d-block" 
                        :src="expressNodeURL + '/' + post.avatar" 
                        :alt="post.username + ' Profile picture'"
                        width="80"
                        height="80">
                </router-link>
              </div>
              <div class="col-4" v-if="currentUser.id === post.userId && userLogged">
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
            <div class="btn-group" role="group" aria-label="Post owner button" v-if="currentUser.id === post.userId && userLogged">
              <!-- See more Post Content if post owner is logged in -->
              <router-link :to="'/post/' + post.id" class="btn btn-primary">
                Read More 
                <AppIcon iconName="eye" />
              </router-link>
              <!-- Edit Post Content -->
              <router-link :to="'/editpost/' + post.id" class="btn btn-warning">
                <AppIcon iconName="pencil-square-o" /> 
                Edit post
              </router-link>
            </div>
            <div v-else>
              <!-- See more Post Content -->
              <router-link :to="'/post/' + post.id" class="btn btn-primary">
                Read More 
                <AppIcon iconName="eye" />
              </router-link>
            </div>
          </div>

          <!-- Post footer content -->
          <div class="card-footer text-muted">
            <div class="row">
              <div class="col-6">
                <!-- More information of the post -->
                Posted on <router-link :to="'/post/' + post.id">
                            <span>{{ post.date | transformPostDates }}</span>
                          </router-link> 
                by
                <!-- Redirect to Post Owner Profile  -->
                <router-link :to="'/profile/' + post.username" class="text-muted">
                <!-- Post Owner Username  -->
                  {{ post.username }}
                </router-link> - <span>{{ post.edited | returnEditedMode }}</span>
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
      </paginate>
      <paginate-links for="blogs"
                      :limit="2"
                      :async="true"
                      :show-step-links="true"
                      :step-links="stepLinks"
                      :classes="paginateLinksCSS">
      </paginate-links>
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

export default {
  name: 'HomePostsComponent',
  filters:{
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
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      expressNodeURL: this.expressURL(),
      currentUser: {},
      userLogged: false,
      posts: [],
      perPage: 1,
      currentPage: 1,
      paginate: ['blogs'],
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
      },
      filter:{
        dateRangeOne: null,
        dateRangeTwo: null,
        filterTxt: '',
        selectedFilter: 'All options',
      },
      filterOptions: ['All options', 'Author', 'Title', 'Content', 'Date'],
      
    }
  },
  computed: {
    inputDisabled(){
      return this.filter.selectedFilter === 'All options' ? true : false;
    },
    filterPosts(){
      let posts = this.posts;
      let queryVal = '';

      // Get current selectedFilter
      let selectedFilter = this.filter.selectedFilter;
        
      switch(selectedFilter){
        // Set the api equivalent value to the selectedFilter data
        case 'Author':
          queryVal = "username";
          break;
        case 'Title':
          queryVal = "title";
          break;
        case 'Content':
          queryVal = "content";
          break;
        case 'Date':
          // Format date to then compare it
          this.filter.dateRangeOne = this.filter.dateRangeOne === null ? moment(new Date()).format("YYYY-MM-DD") : this.filter.dateRangeOne;
          this.filter.dateRangeTwo = this.filter.dateRangeTwo === null ? moment(new Date()).format("YYYY-MM-DD") : this.filter.dateRangeTwo;

          queryVal = "date";
          break;
      }

      
      if (this.filter.selectedFilter !== 'All options') {
        posts = this.posts.filter((post, index, postArr) => {
          // If posts will be filtered for dates
          if(queryVal === 'date'){
            // Moment.js filter - Select date - Filter by range of dates

            // Convert date to a specific 
            let postDate = moment(post[queryVal], "YYYY-MM-DD");

            return moment(postDate).isBetween(this.filter.dateRangeOne, this.filter.dateRangeTwo, null, '[]');
          }
          
          // Return filter data
          // return post[queryVal].indexOf(this.filter.filterTxt) !== -1;
          return post[queryVal].includes(this.filter.filterTxt);
        });
      }

      return posts;
    }
  },
  watch:{
    getUserLogged(newVal, oldVal){
      this.userLogged = this.getUserLogged;
    },
    getCurrentUser(newVal, oldVal){
      this.currentUser = this.getCurrentUser;
    },
    filter: {
      handler(newVal, oldVal){
        if(this.filter.selectedFilter === 'All options'){
          this.getAllPosts();
          this.filter.filterTxt = '';
        }
      },
      deep: true
    }
  },
  mounted(){
    this.getAllPosts();
    this.checkFilterData();
  },
  methods:{
    getAllPosts(){
      /* Request All Posts */
      axios.get(`${this.axiosURL}/posts?draft=false&is_deleted=false`)
         .then(response => { 
            let postArray = response.data;

            //Request for user info
            axios.get(`${this.axiosURL}/users/${postArray[0].userId}`)
            .then(response => {
              let postOwnerInfo = response.data;

              //Setting values
              let resultArray = postArray.map((obj, index, arr) =>{
                //Setting username
                obj.username = postOwnerInfo.username;
                //Setting avatar
                obj.avatar = postOwnerInfo.avatar;

                return obj;
              });

              //Newer to older
              this.posts = resultArray.reverse();

              this.checkUserLoggedInfo();
            });
            
          });
    },
    checkUserLoggedInfo(){
      this.userLogged = this.getUserLogged;
      this.currentUser = this.getCurrentUser;
    },
    checkFilterData(){
      // Set filter value to vuex saved value

      // Computed comes from mixin
      let vuexFilter = this.getFilterVals;

      // Check if vuexFilter object is not empty
      if(Object.keys(vuexFilter).length > 0){
        // If object is not empty, 
        // save in component the vuex filter value
        this.filter = vuexFilter;
      }
    },
    getFilterPosts(){
      if(this.filter.selectedFilter !== 'All options'){
         if(this.filterPosts.length > 0){
            this.$refs.paginator.goToPage(1);
          }
      }else{
        this.getAllPosts();
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
            text: "Accept",
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
                this.getAllPosts();
                that.dynamicToastr({title: "Post deleted succesfully", msg:"", type: "success"});
               })
               .catch(error =>{
                 that.dynamicToastr({title: `Error in deleting file proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
      })
    },
    returnPostParcialContent(postContent){
      return String(postContent).substring(0, 199);
    },
    returnLikesAmount(postId){
      let likesQuantity = [];
      axios.get(`${this.axiosURL}/likes?postId=${postId}`)
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
      let comments = axios.get(`${this.axiosURL}/comments?postId=${postId}`)
        .then(response => { 
          return response.data.length;
        });
    }
  }
}
</script>
<style scoped>

</style>