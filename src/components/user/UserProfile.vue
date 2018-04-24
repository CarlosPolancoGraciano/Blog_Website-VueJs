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
                          <a href="" data-target="#posts" data-toggle="tab" class="nav-link text-primary">Posts</a>
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
                      <div class="tab-pane" id="posts">
                            <div class="alert alert-info alert-dismissable">
                                <a class="panel-close close" data-dismiss="alert">×</a> This is an <strong>.alert</strong>. Use this to show important messages to the user.
                            </div>
                            <table class="table table-hover table-striped">
                                <tbody>                                    
                                    <tr>
                                        <td>
                                          <span class="float-right font-weight-bold">3 hrs ago</span> Here is your a link to the latest summary report from the..
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <span class="float-right font-weight-bold">Yesterday</span> There has been a request on your account since that was..
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <span class="float-right font-weight-bold">9/10</span> Porttitor vitae ultrices quis, dapibus id dolor. Morbi venenatis lacinia rhoncus. 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <span class="float-right font-weight-bold">9/4</span> Vestibulum tincidunt ullamcorper eros eget luctus. 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <span class="float-right font-weight-bold">9/4</span> Maxamillion ais the fix for tibulum tincidunt ullamcorper eros. 
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
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
                  <img src="//placehold.it/150" class="mx-auto img-fluid rounded-circle" alt="avatar">
                  <h6 class="mt-2 font-weight-bold">@{{ user.username }}</h6>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppIcon from '@/components/app/AppIcon.vue';
import { global } from '@/components/mixins/global';

export default {
  name: 'Profile',
  mixins: [global],
  components:{
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      user: {},
      isPublic: null
    }
  },
  computed: {

  },
  mounted(){
    if(this.$route.params.username === undefined){
      this.$router.push('/', () => { swal("Ooops!", "You don't have access!", "error") })
    }
    axios.all([this.loadUser()])
    .then(axios.spread(function (acct, perms) {
      // Both requests are now complete
    }));
  },
  methods: {
    loadUser(){
      let that = this;
      // this.currentUser = this.$store.getters.getCurrentUser;
      return axios.get(`${that.axiosURL}/users?username=${that.$route.params.username}`)
           .then((response) => {
              let currentUser = that.$store.getters.getCurrentUser;
              that.user = response.data[0];

              if(Object.keys(that.user).length == 0){
                that.$route.push('/', () => { swal("Ooops!", "You don't have access!", "error") })
              }
              else if(Object.keys(currentUser).length > 0){
                if(that.user.id === currentUser.id){
                  that.isPublic = true;
                }
              }else{
                that.isPublic = (that.user.isPublic == 'true');
              }
            
           });
    }
  }
}
</script>
<style scoped>

</style>
