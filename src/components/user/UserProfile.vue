<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="container my-3">
          <div class="row my-2">
              <div class="col-lg-8 order-lg-2">
                  <ul class="nav nav-tabs">
                      <li class="nav-item">
                          <a href="" data-target="#profile" data-toggle="tab" class="nav-link active text-primary">Profile</a>
                      </li>
                      <li class="nav-item" v-if="isPublic">
                          <a href="" data-target="#activity" data-toggle="tab" class="nav-link text-primary" @click="getActivityInfo()">Activity</a>
                      </li>
                  </ul>
                  <div class="tab-content py-4" v-if="isPublic">
                    <div class="tab-pane active" id="profile">
                            <h3 class="mb-3 font-weight-bold">Profile</h3>
                            <div class="container">
                              <div class="row">
                                <div class="col-md-12">
                                  <div class="row my-3">
                                    <div class="col-md-6">
                                      <div class="text-left">
                                        <h4>First Name(s)</h4>
                                      </div>
                                      <div class="text-justify">
                                        <p class="h5">
                                          {{ user.firstName }}
                                        </p>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="text-left">
                                        <h4>Last Names</h4>
                                      </div>
                                      <div class="text-justify">
                                        <p class="h5">
                                          {{ user.lastName }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="row my-3">
                                    <div class="col-md-12">
                                      <div class="text-left">
                                        <h4>Description</h4>
                                      </div>
                                      <div v-if="user.description !== ''" class="text-justify">
                                        <p class="h5">
                                          {{ user.description }}
                                        </p>
                                      </div>
                                      <div v-else>
                                        <div class="jumbotron jumbotron-fluid">
                                          <div class="container text-center">
                                            <span class="h4">User has no description</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div> 
                                  </div>
                                </div>
                              </div>
                            </div>
                          <!--/row-->
                      </div>
                      <div class="tab-pane" id="activity">
                        <ul class="nav nav-pills nav-fill">
                          <li class="nav-item">
                            <a class="nav-link active" data-target="#postsActivity" data-toggle="tab" href="#" @click="getActivityInfo('post')">Posts activity</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" data-target="#likesActivity" data-toggle="tab" href="#" @click="getActivityInfo('like')">Likes activity</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" data-target="#commentsActivity" data-toggle="tab" href="#" @click="getActivityInfo('comment')">Comments activity</a>
                          </li>
                        </ul>
                        <div class="tab-content py-4">
                          <div class="tab-pane active" id="postsActivity">
                            <div v-if="activityInfo.length > 0 && activityType == 'post'">
                              <paginate name="activity"
                                        :list="activityInfo"
                                        :per="5">
                                <div class="alert alert-success alert-dismissable" v-for="(info, index) in paginated('activity')" :key="index">
                                    <router-link :to="'/post/' + info.postId" class="panel-close">
                                      <AppIcon iconName="share-square-o" />
                                    </router-link> You <strong>published</strong> a post, click on the icon to see it.
                                    <div class="text-right text-muted">{{ info.created_at | formatCreatedAt }}</div>
                                </div>
                              </paginate>
                              <paginate-links for="activity"
                                              :async="true"
                                              :limit="2"
                                              :show-step-links="true"
                                              :step-links="stepLinks"
                                              :classes="paginateLinksCSS">
                              </paginate-links>
                            </div>
                            <div v-else>
                              <div class="jumbotron jumbotron-fluid">
                                <div class="container text-center">
                                  <span class="h2">No se han encontrado actividad de publicaciones</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="tab-pane" id="likesActivity">
                            <div v-if="activityInfo.length > 0 && activityType == 'like'">
                              <paginate name="activity"
                                        :list="activityInfo"
                                        :per="5">
                              </paginate>
                                <div class="alert alert-danger alert-dismissable" v-for="(info, index) in paginated('activity')" :key="index">
                                    <router-link :to="'/post/' + info.postId" class="panel-close">
                                      <AppIcon iconName="share-square-o" />
                                    </router-link> You <strong>liked</strong> a post, click on the icon to see it.
                                    <div class="text-right text-muted">{{ info.created_at | formatCreatedAt }}</div>
                                </div>
                              <paginate-links for="activity"
                                              :async="true"
                                              :limit="2"
                                              :show-step-links="true"
                                              :step-links="stepLinks"
                                              :classes="paginateLinksCSS">
                              </paginate-links>
                            </div>
                            <div v-else>
                              <div class="jumbotron jumbotron-fluid">
                                <div class="container text-center">
                                  <span class="h2">No se han encontrado actividad de likes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="tab-pane" id="commentsActivity">
                            <div v-if="activityInfo.length > 0 && activityType == 'comment'">
                              <paginate name="activity"
                                        :list="activityInfo"
                                        :per="5">
                                <div class="alert alert-primary alert-dismissable" v-for="(info, index) in paginated('activity')" :key="index">
                                  <router-link :to="'/post/' + info.postId" class="panel-close">
                                    <AppIcon iconName="share-square-o" />
                                  </router-link> You <strong>commented</strong> a post, click on the icon to see it.
                                  <div class="text-right text-muted">{{ info.created_at | formatCreatedAt }}</div>
                                </div>
                              </paginate>
                              
                              <paginate-links for="activity"
                                              :async="true"
                                              :limit="2"
                                              :show-step-links="true"
                                              :step-links="stepLinks"
                                              :classes="paginateLinksCSS">
                              </paginate-links>
                            </div>
                            <div v-else>
                              <div class="jumbotron jumbotron-fluid">
                                <div class="container text-center">
                                  <span class="h2">No se han encontrado actividad de comentarios</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div class="tab-content py-4" v-else>
                    <div class="tab-pane active" id="profile">
                            <h2 class="mb-3">User Profile</h2>
                            <div class="row">
                              <div class="col-md-12">
                                <div class="jumbotron jumbotron-fluid">
                                  <div class="container text-center">
                                    <span class="h4">User account is private</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--/row-->
                      </div>
                  </div>
              </div>
              <div class="col-lg-4 order-lg-1 text-center">
                  <img class="img-fluid img-thumbnail mx-auto d-block" 
                        :src="expressNodeURL + '/' + user.avatar"
                        :alt="user.username + ' profile image'"
                        width="160"
                        height="120">
                  <h6 class="mt-2 font-weight-bold">@{{ user.username }}</h6>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Profile',
  filters:{
    formatCreatedAt(date){
      return moment(date).format('MMMM Do YYYY');
    }
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      expressNodeURL: this.expressURL(),
      user: {},
      activityInfo: [],
      isPublic: null,
      activityType: '',
      paginate: ['activity'],
      stepLinks: {
        next: 'Next',
        prev: 'Previous'
      },
      paginateLinksCSS: {
        'ul': ['pagination', 'justify-content-center'],
        'ul > li': 'page-item',
        'li > a': 'page-link',
        '.next > a': 'page-link',
        '.prev > a': 'page-link'
      }
    }
  },
  computed: {

  },
  mounted(){
    if(this.$route.params.username === undefined){
      this.$router.push('/', () => { swal("Ooops!", "You don't have access!", "error") })
    }
    
    this.loadUser();
  },
  methods: {
    getActivityInfo(typeName = 'post'){
      let that = this;

      this.activityType = typeName;

      axios.get(`${this.axiosURL}/activity?type=${typeName}`)
           .then(response => {
             that.activityInfo = response.data.length > 0 ? response.data : [];
           });
    },
    loadUser(){
      let that = this;

      axios.get(`${that.axiosURL}/users?username=${that.$route.params.username}`)
           .then((response) => {
              // Current user from Vuex
              let currentUser = that.getCurrentUser;
              // Request profile user
              that.user = response.data[0];

              if(Object.keys(currentUser).length > 0){
                // If current user is logged in and he's watching his profile
                // Show it even if profile is private
                if(that.user.id === currentUser.id){
                  that.isPublic = true;
                }
              }else{
                // Other wise, if user is not logged show the profile user is public
                that.isPublic = (that.user.isPublic == 'true');
              }
           });
    }
  }
}
</script>
<style scoped>

</style>
