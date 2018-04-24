<template>
  <div class="mt-2 p-3">
    <div class="container-fluid text-center">
      <div class="row">
        <div class="col-12">
          <span class="h1 text-muted">Create a new post!</span>
        </div>
      </div>
    </div>
    <div class="container-fluid my-3">
      <div class="row text-center">
        <div class="col-6">
          <span class="h2 text-muted">Post information</span>
        </div>
        <div class="col-6">
          <span class="h2 text-muted">Post Preview</span>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="card col-6">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <b-form-group id="titleFormGroup"
                              label="Title"
                              label-for="titleFormInput">
                  <b-form-input id="titleFormInput"
                                type="email"
                                v-model="form.title"
                                required
                                placeholder="Enter post title"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <b-form-group label="¿Do you want comments in your posts?">
                  <b-form-radio-group id="radios2" v-model="form.enableComments" name="radioSubComponent">
                    <b-form-radio value="Yes">Yes</b-form-radio>
                    <b-form-radio value="No">No</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <froala :tag="'textarea'" :config="config" v-model="form.content"></froala>
              </div>
            </div>
            <div class="row text-center mt-3">
              <div class="col-12">
                <b-button-group>
                  <b-button variant="primary" @click="createNewPost">
                    <AppIcon iconName="plus-square-o" />
                    Create
                  </b-button>
                  <!-- <b-button variant="primary">
                    <AppIcon iconName="paper-plane-o" />
                    Post
                  </b-button> -->
                  <b-button variant="warning" @click="draftNewPost">
                    <AppIcon iconName="pencil-square-o" />
                    Save as draft
                  </b-button>
                  <b-button variant="danger" @click="cancelNewPost">
                    <AppIcon iconName="ban" />
                    Cancel
                  </b-button>
                </b-button-group>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card">
            <div class="card-body">
              <!-- Title -->
              <h1 v-if="form.title != ''">{{ getPostTitle }}</h1>
              <h1 v-else>Post Title</h1>

              <!-- Author -->
              <p class="lead">
                by
                <span>{{ getPostOwner }}</span>
              </p>

              <hr>

              <!-- Date/Time -->
              <p>Posted on <span>{{ getPostDate }}</span></p>

              <hr>
              <div v-if="form.content !== ''">
                <froalaView v-model="form.content"></froalaView>
              </div>
              <div v-else>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, ullam voluptatum? Praesentium nihil distinctio eius, nemo quidem iste debitis beatae voluptate porro sequi quasi, quis facilis eum repellendus similique modi?
                </p>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, ullam voluptatum? Praesentium nihil distinctio eius, nemo quidem iste debitis beatae voluptate porro sequi quasi, quis facilis eum repellendus similique modi?
                </p>
              </div>
              <!-- Comments Form -->
              <!-- <div v-if="form.enableComments === 'Yes'">
                <hr>
                <div class="card my-4">
                  <h5 class="card-header">Leave a Comment:</h5>
                    <div class="card-body">
                      <form>
                      <div class="form-group">
                        <b-form-textarea placeholder="Enter your comment message"
                                        :rows="3">
                        </b-form-textarea>
                      </div>
                      <b-button variant="primary">
                        <AppIcon iconName="floppy-o" />
                        Save comment
                      </b-button>
                    </form>
                    </div>
                </div>
              </div>
              <div v-else>
                <div class="jumbotron jumbotron-fluid">
                  <div class="container text-center">
                    <span class="h2">No se han encontrado comentarios</span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueFroala from 'vue-froala-wysiwyg';
import AppIcon from '@/components/app/AppIcon.vue';
import { global } from '@/components/mixins/global';;

export default {
  name: 'NewPost',
  mixins: [global],
  components:{
    AppIcon
  },
  data(){
    return{
      currentUser: {},
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      config: {
        events: {
          'froalaEditor.initialized': function () {
            console.log('initialized')
          }
        }
      },
      form:{
        title: "",
        content: "",
        enableComments: "Yes",
        date: new Date()
      }
    }
  },
  computed: {
    getPostTitle(){
      return this.form.title;
    },
    getPostContent(){
      return this.form.content;
    },
    getPostEnableComments(){
      return this.form.enableComments;
    },
    getPostDate(){
      return moment(this.form.date).format('MMMM Do YYYY');
    },
    getPostOwner(){
      return this.currentUser.username;
    }
  },
  mounted(){
    this.loadCurrentUser();
  },
  methods:{
    loadCurrentUser(){
      this.currentUser = this.$store.getters.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){
        this.$route.push('/', () => { swal("Ooops!", "You don't have access!", "error") });
      }
    },
    createNewPost(){
      let that = this;

      if(that.validateInput()){
        let latestId = that.getLatestPostId() + 1
        // Post data
        const post = {
          id: latestId,
          title: that.form.title,
          content: that.form.content,
          date: that.form.date,
          enableComments: that.form.enableComments,
          edited: false,
          draft: false,
          userId: this.currentUser.id
        }
        
        // Swal message data
        const swalMessage = {
          title: "Post published successfully!",
          message: "Your post was published and you'll be redirected to the main list of posts",
          type: "success"
        }

        this.axiosPostRequest(`${this.axiosURL}/activity`, {
          id: this.getLatestActivityId() + 1, 
          userId: this.currentUser.id,
          postId: latestId,
          action: 'created new post'
        });
        this.axiosPostRequest(`${this.axiosURL}/posts`, post, swalMessage);
      }
    },
    getLatestPostId(){
      axios.get(`${this.axiosURL}/posts`)
          .then((response) => {
            let postsArray = [];
            postsArray = response.data;
            if(postsArray.length === 0){
              return 0;
            }
            return postsArray.length
          })
      
    },
    getLatestActivityId(){
        axios.get(`${this.axiosURL}/posts`)
            .then((response) => {
              let postsArray = [];
              postsArray = response.data;
              if(postsArray.length === 0){
                return 0;
              }
              return postsArray.length
            });
    },
    draftNewPost(){
      let that = this;

      if(that.validateInput()){
        // Post data
        const post = {
          id: that.getLatestPostId() + 1,
          title: that.form.title,
          content: that.form.content,
          date: that.form.date,
          enableComments: that.form.enableComments,
          edited: false,
          draft: true,
          userId: this.currentUser.id
        }
        
        // Swal message data
        const swalMessage = {
          title: "Post saved as draft!",
          message: "Your post was saved and can be found in the posts section on the navbar. You'll be redirected to home page",
          type: "success"
        }
        this.axiosPostRequest(`${this.axiosURL}/posts`, post, swalMessage);
      }
    },
    cancelNewPost(){
      this.$router.go(-1);
    },
    validateInput(){
      let that = this;
      let inputEmpties = []
      let formData = that.form;

      // Check for empty inputs
      for(let item in formData){
        if(formData[item] === ''){
          inputEmpties.push(item);
        }
      }
      // If there is - Show to user with toastr which one
      if(inputEmpties.length > 0){
        for(let input in inputEmpties){
          that.dynamicToastr({title: `Error - Field missing`, msg: `The ${inputEmpties[input]} field is empty`, type: `error`});
        }
        return false;
      }

      // If there is none, return true to save the post
      return true;
    },
    axiosGetRequest(url){
      axios.get(url)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
    axiosPostRequest(url, postObj, swalMessage = null){
      axios.post(url, postObj)
        .then((response) => {
          if(swalMessage !== null){
            swal( swalMessage.title, 
                swalMessage.message, 
                swalMessage.type)
            .then((success) => {
              if(success){
                this.$router.push('/');
              }
            });
          }
          
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
.editorPreview{
  min-height: 317px;
}
</style>
