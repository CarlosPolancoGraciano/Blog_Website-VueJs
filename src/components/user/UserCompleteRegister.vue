<template>
  <div class="container my-4">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12 text-center">
            <span class="display-4 text-muted">Registro de usuarios</span>
          </div>
        </div>
        <div class="text-left">
          <b-form @submit.prevent="completeUserRegister">
            <b-form-group label="Username:"
                          label-for="userNameInput">
              <b-form-input id="userNameInput"
                            type="text"
                            v-model="userCompletedData.username"
                            required
                            placeholder="Enter your username">
              </b-form-input>
            </b-form-group>
            <b-form-group label="First Name:"
                          label-for="firstNameInput">
              <b-form-input id="firsNameInput"
                            type="text"
                            v-model="userCompletedData.firstName"
                            required
                            placeholder="Enter your secret password">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Last Name:"
                          label-for="lastNameInput">
              <b-form-input id="lastNameInput"
                            type="text"
                            v-model="userCompletedData.lastName"
                            required
                            placeholder="Repeat your secret password">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Profile Picture:"
                          label-for="avatarUploadInput"
                          description="You can drag and drop the image here">
              <b-form-file id="avatarUploadInput" name="avatar" v-model="userCompletedData.avatar" accept="image/*" placeholder="Upload your profile picture..."></b-form-file>
            </b-form-group>
            <b-form-group label="Description:"
                          label-for="descriptionInput">
              <b-form-textarea id="descriptionInput"
                             v-model="userCompletedData.description"
                             placeholder="Write a description for your profile"
                             :rows="3">
              </b-form-textarea>
            </b-form-group>
            <div class="text-center">
              <button class="btn btn-success" type="submit">Registrarme</button>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CompleteRegister',
  data(){
    return{
      user: [],
      userCompletedData: {
        username: "",
        firstName: "",
        lastName: "",
        avatar: null,
        description: ""
      },
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      expressNodeURL: this.expressURL(),
      isLocal: "true"
    }
  },
  mounted(){
    //console.log(this.siteURL);
    if(this.$route.params.hash === undefined){
        this.$router.push('/');
    }
    this.checkIfHashExistInUser(this.$route.params.hash);
  },
  methods:{
    checkIfHashExistInUser(hash){
      let that = this;

      axios.get(`${this.axiosURL}/users?hash=${hash}`).then((response) => { 

        if(response.data.length > 0){
          // Save User returned
          that.user = response.data;

          that.dynamicToastr({title: `Validation successful!`, 
                           msg: `Fill the following fields to complete your registration process`, 
                           type: `success`});
        }

      });
    },
    completeUserRegister(){
      let that = this;
      const userId = that.user[0].id;

      // Profile remaining data and existing user data
      const completeUserData = {
        hash: "",
        active: true,
        username: that.userCompletedData.username,
        firstName: that.userCompletedData.firstName,
        lastName: that.userCompletedData.lastName,
        description: that.userCompletedData.description
      }

      let avatar = null;
      
      if(this.userCompletedData.avatar == null){
        avatar = new FormData();
        avatar.append('avatar', this.userCompletedData.avatar);

        // Upload user image
        axios.post(`${this.expressNodeURL}/upload`, avatar)
            .then((response) => {
              
              // Complete user data
              completeUserData.avatar = response.data.filename;        

              if(completeUserData.avatar != ''){
                  axios.patch(`${that.axiosURL}/users/${userId}`, completeUserData)
                    .then((response) => {
                      //If request was successful

                      //Send new user data to WebStorage
                      this.saveWebStorageCurrentUser(response.data, that.isLocal);

                      //Save new currentUser in Vuex
                      this.setAuthCurrentUser(response.data);

                      //Send user to create new post and show a swal after
                      that.$router.push('/newpost', () => { 
                        swal("Registration completed!", "You're logged into your account and you were redirected to create your first post", "success") 
                      });
                    })
                    .catch((error) => {

                      //If request was failed
                      that.dynamicToastr({title: `Ooops!`, 
                                    msg: `Http error: ${error.response.status} ocurred trying to save your information`, 
                                    type: `error`});
                    });
              }else{
                that.dynamicToastr({ title: 'Ooops!', msg: 'An error occurred while uploading your profile picture', type: 'error' });
              }
            });
      }else{
        completeUserData.avatar = `${this.expressNodeURL}/defaultAvatar.png`;
        
        axios.patch(`${that.axiosURL}/users/${userId}`, completeUserData)
              .then((response) => {
                //If request was successful

                //Send new user data to WebStorage
                this.saveWebStorageCurrentUser(response.data, that.isLocal);

                //Save new currentUser in Vuex
                this.setAuthCurrentUser(response.data);

                //Send user to create new post and show a swal after
                that.$router.push('/newpost', () => { 
                  swal("Registration completed!", "You're logged into your account and you were redirected to create your first post", "success") 
                });
              })
              .catch((error) => {

                //If request was failed
                that.dynamicToastr({title: `Ooops!`, 
                                    msg: `Http error: ${error.response.status} ocurred trying to save your information`, 
                                    type: `error`});
              });
      }

    }
  }
}
</script>
<style scoped>

</style>