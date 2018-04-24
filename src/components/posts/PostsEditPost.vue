<template>
  <div class="mt-2 p-3">
    <div class="container-fluid text-center">
      <div class="row">
        <div class="col-12">
          <span class="h1 text-muted">Edit your post!</span>
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
                                v-model="post.title"
                                required
                                placeholder="Enter post title"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <b-form-group label="¿Do you want comments in your posts?">
                  <b-form-radio-group id="radios2" v-model="post.enableComments" name="radioSubComponent">
                    <b-form-radio value="Yes">Yes</b-form-radio>
                    <b-form-radio value="No">No</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <froala :tag="'textarea'" :config="config" v-model="post.content"></froala>
              </div>
            </div>
            <div class="row text-center mt-3">
              <div class="col-12">
                <b-button-group>
                  <b-button variant="warning" @click="publishDraftPost" v-if="post.draft === true">
                    <AppIcon iconName="pencil-square-o" />
                    Post
                  </b-button>
                  <b-button variant="warning" @click="updatePost">
                    <AppIcon iconName="refresh" />
                    Update
                  </b-button>
                  <b-button variant="danger" @click="cancelNewPost">
                    <AppIcon iconName="ban" />
                    Cancel
                  </b-button>
                  <b-button variant="danger" @click="deletePost">
                    <AppIcon iconName="trash-o" />
                    Delete
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
              <h1>{{ getPostTitle }}</h1>

              <!-- Author -->
              <p class="lead">
                by
                <span>{{ getPostOwner }}</span>
              </p>

              <hr>

              <!-- Date/Time -->
              <p>Posted on <span>{{ getPostDate }}</span></p>

              <hr>
              <div>
                <froalaView v-model="post.content"></froalaView>
              </div>
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
      post:{},
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      config: {
        events: {
          'froalaEditor.initialized': function () {
            console.log('initialized')
          }
        }
      }
    }
  },
  computed: {
    getPostTitle(){
      return this.post.title;
    },
    getPostContent(){
      return this.post.content;
    },
    getPostEnableComments(){
      return this.post.enableComments;
    },
    getPostDate(){
      return moment(this.post.date).format('MMMM Do YYYY');
    },
    getPostOwner(){
      return this.currentUser.username;
    }
  },
  mounted(){
    if(this.$route.params.id === undefined){
      this.$route.push('/', () => { swal("Ooops!", "You don't have access!", "error") });
    }
    this.loadPostInfo();
  },
  methods:{
    loadPostInfo(){
      axios.get(`${this.axiosURL}/posts?id=${this.$route.params.id}`)
        .then((response) => {
          this.post = response.data[0]; //Obtain the only object returned
          this.loadCurrentUser(this.post.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadCurrentUser(postId){
      this.currentUser = this.$store.getters.getCurrentUser;
      
      // Validate there is a current user
      if(Object.keys(this.currentUser).length == 0){
        this.$route.push('/', () => { swal("Ooops!", "You don't have access!", "error") });
      }
      // Validate current user is the post owner
      if(this.currentUser.id !== postId){
        this.$route.push('/', () => { swal("Ooops!", "You don't have access!", "error") });
      }
    },
    publishDraftPost(){
      let that = this;
      let postId = Number(this.$route.params.id);

      if(that.validateInput()){
        // Post data
        const editPost = {
          title: that.post.title,
          content: that.post.content,
          enableComments: that.post.enableComments,
          updateDate: that.post.date,
          draft: false,
          edited: true
        }
        
        // Swal message data
        const swalMessage = {
          title: "Post published successfully!",
          message: "Your post was published and you'll be redirected to the main list of posts",
          type: "success"
        }
        
        this.axiosPatchRequest(`${this.axiosURL}/posts/${postId}`, editPost, swalMessage);
      }
    },
    updatePost(){
      let that = this;
      let postId = Number(this.$route.params.id);

      if(that.validateInput()){
        // Post data
        const editPost = {
          title: that.post.title,
          content: that.post.content,
          enableComments: that.post.enableComments,
          updateDate: that.post.date,
          edited: true
        }
        
        // Swal message data
        const swalMessage = {
          title: "Post updated!",
          message: "Your post was updated, you'll be redirected to the main post list",
          type: "success"
        }
        
        this.axiosPatchRequest(`${this.axiosURL}/posts/${postId}`, editPost, swalMessage);
      }
    },
    cancelNewPost(){
      this.$router.go(-1);
    },
    deletePost(){
      let that = this;
      let postId = Number(this.$route.params.id);
      
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
                that.dynamicToastr({title: "Post deleted succesfully", msg:"", type: "success"});
               })
               .catch((error) =>{
                 that.dynamicToastr({title: `Error in deleting file proccess`, msg:`${error.response.status}`, type: `error`});
               })
        }
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
    validateInput(){
      let that = this;
      let inputEmpties = []
      let postData = that.post;

      // Check for empty inputs
      for(let item in postData){
        if(postData[item] === ''){
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
    axiosPatchRequest(url, patchObj, swalMessage){
      axios.patch(url, patchObj)
        .then((response) => {
          swal( swalMessage.title, 
                swalMessage.message, 
                swalMessage.type)
            .then((success) => {
              if(success){
                this.$router.push('/');
              }
            });
          
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
