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
                  <b-button variant="primary">
                    <AppIcon iconName="paper-plane-o" />
                    Post
                  </b-button>
                  <b-button variant="warning">
                    <AppIcon iconName="pencil-square-o" />
                    Draft
                  </b-button>
                  <b-button variant="warning">
                    <AppIcon iconName="refresh" />
                    Update
                  </b-button>
                  <b-button variant="danger">
                    <AppIcon iconName="ban-o" />
                    Cancel
                  </b-button>
                  <b-button variant="danger">
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
              <h1 v-if="form.title != ''">{{ getPostTitle }}</h1>
              <h1 v-else>Post Title</h1>

              <!-- Author -->
              <p class="lead">
                by
                <span>Current User</span>
              </p>

              <hr>

              <!-- Date/Time -->
              <p>Posted on <span>{{ getPostDate }}</span></p>

              <hr>
              <div v-if="form.content !== ''">
                <froalaView v-model="form.content"></froalaView>
              </div>
              <div v-else>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, ullam voluptatum? Praesentium nihil distinctio eius, nemo quidem iste debitis beatae voluptate porro sequi quasi, quis facilis eum repellendus similique modi?
              </div>
              <div v-if="form.enableComments === 'Yes'">
                <hr>
                <!-- Comments Form -->
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import AppIcon from '@/shared/AppIcon.vue'
import VueFroala from 'vue-froala-wysiwyg';

export default {
  name: 'NewPost',
  components:{
    AppIcon
  },
  data(){
    return{
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
    }
  },
  methods:{
    createNewPost(){
      var that = this;
      let latestId = this.getLatestPostId();
      let post = {
        id: latestId++,
        title: that.form.title,
        content: that.form.content,
        date: that.form.date,
        enableComments: that.form.enableComments,
        edited: false,
        draft: false
        //Missing User Id
      }
      let swalMessage = {
        title: "Publicación hecha!",
        message: "Tu publicación fue hecha serás redireccionado al listado principal",
        type: "success"
      }
      this.axiosPostRequest('http://localhost:3000/posts', post, swalMessage);
    },
    getLatestPostId(){
      let posts = 0;
      let postsArray = this.axiosPostRequest('http://localhost:3000/posts');
      if(postsArray === undefined){
        return 0;
      }
      return postsArray.length
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
    axiosPostRequest(url, postObj, swalMessage){
      axios.post(url, postObj)
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
    }
  }
}
</script>
<style scoped>
.editorPreview{
  min-height: 317px;
}
</style>
