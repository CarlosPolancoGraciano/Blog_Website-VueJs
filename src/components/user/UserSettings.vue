<template>
  <div>
    <div class="container-fluid">
      <div class="row m-3 p-5">
        <div class="col-md-4 border-right">
          <div class="list-group">
            <b-btn  class="list-group-item list-group-item-action"
                    :class=" isGeneral ? 'active' : null"
                    @click="isGeneral = !isGeneral">
                    General
            </b-btn>
            <b-btn  class="list-group-item list-group-item-action"
                    :class=" !isGeneral ? 'active' : null"
                    @click="isGeneral = !isGeneral">
                    Perfil
            </b-btn>
          </div>
        </div>
        <div class="col-md-8 border-left">
          <b-collapse :visible="isGeneral" id="collapseGeneral">
            <div class="container">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="text-left my-3">
                        <h2>General Info</h2>
                        <span class="text-muted mt-1">Here you can change your password</span>
                      </div>
                      <b-form @submit.prevent="saveGNewPassword">
                        <div class="row text-left">
                          <div class="col-md-6">
                            <b-form-group id="oldPasswordGroup"
                                        label="Old Password:"
                                        class="font-weight-bold"
                                        label-for="oldPasswordInput"
                                        description="Required">
                            <b-form-input id="oldPasswordInput"
                                          type="password"
                                          required
                                          v-model="general.oldPassword"
                                          placeholder="Enter old password">
                            </b-form-input>
                          </b-form-group>
                          </div>
                        </div>
                        <div class="row text-left">
                          <div class="col-md-6">
                            <b-form-group id="newPasswordGroup"
                                        label="New Password:"
                                        class="font-weight-bold"
                                        label-for="newPasswordInput"
                                        description="Required">
                            <b-form-input id="newPasswordInput"
                                          type="password"
                                          required
                                          v-model="general.newPassword"
                                          placeholder="Enter new password">
                            </b-form-input>
                          </b-form-group>
                          </div>
                          <div class="col-md-6">
                            <b-form-group id="repeatNewPasswordGroup"
                                          label="Repeat the new Password:"
                                          class="font-weight-bold"
                                          label-for="repeatNewPasswordInput"
                                          description="Required">
                              <b-form-input id="repeatNewPasswordInput"
                                            type="password"
                                            required
                                            v-model="general.repeatNewPassword"
                                            placeholder="Repeat the new password">
                              </b-form-input>
                            </b-form-group>
                          </div>
                        </div>
                        <div class="text-left">
                          <b-button type="reset" variant="secondary">
                            <AppIcon iconName="refresh" />
                            Discard changes
                          </b-button>
                          &nbsp; <!-- Code to print a space -->
                          <b-button type="submit" variant="primary">
                            <AppIcon iconName="floppy-o" />
                            Save changes
                          </b-button>
                        </div>
                      </b-form>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
          <b-collapse :visible="!isGeneral" id="collapseProfile">
           <div class="container">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="text-left my-3">
                        <h2>Profile info</h2>
                        <span class="text-muted mt-1">Here you can change your profile info - Only will be change the fields modified by you</span>
                      </div>
                      <b-form @submit.prevent="savePNewInfo">
                        <div class="row text-left">
                          <div class="col-md-6">
                            <b-form-group id="usernameGroup"
                                        label="Username:"
                                        class="font-weight-bold"
                                        label-for="usernameInput"
                                        description="Required">
                            <b-form-input id="usernameInput"
                                          type="text"
                                          required
                                          v-model="profile.username"
                                          placeholder="Enter old password">
                            </b-form-input>
                          </b-form-group>
                          </div>
                          <div class="col-md-6">
                            <b-form-group label="Profile privacy:"
                                          class="font-weight-bold">
                              <b-form-radio-group id="radios2" v-model="profile.isPublic" name="radioSubComponent">
                                <b-form-radio value="true">Public</b-form-radio>
                                <b-form-radio value="false">Private</b-form-radio>
                              </b-form-radio-group>
                            </b-form-group>
                          </div>
                        </div>
                        <div class="row text-left">
                          <div class="col-md-6">
                            <b-form-group id="firstNameGroup"
                                        label="First Name:"
                                        class="font-weight-bold"
                                        label-for="firstNameInput"
                                        description="Required">
                            <b-form-input id="firstNameInput"
                                          type="text"
                                          required
                                          v-model="profile.firstName"
                                          placeholder="Enter your First Name">
                            </b-form-input>
                          </b-form-group>
                          </div>
                          <div class="col-md-6">
                            <b-form-group id="lastNameGroup"
                                          label="Last Name:"
                                          class="font-weight-bold"
                                          label-for="lastNameInput"
                                          description="Required">
                              <b-form-input id="lastNameInput"
                                            type="text"
                                            required
                                            v-model="profile.lastName"
                                            placeholder="Enter your Last Name">
                              </b-form-input>
                            </b-form-group>
                          </div>
                        </div>
                        <div class="row text-left">
                          <div class="col-md-6">
                            <b-form-group id="uploadPictureGroup"
                                          label="Profile picture:"
                                          class="font-weight-bold"
                                          label-for="uploadImageInput"
                                          description="Required">
                              <b-form-file id="uploadImageInput" v-model="file" :state="Boolean(file)" placeholder="Upload your profile picture..."></b-form-file>
                            </b-form-group>
                          </div>
                        </div>
                        <div class="row text-left">
                          <div class="col-md-12">
                            <b-form-group id="descriptionGroup"
                                          label="Description:"
                                          class="font-weight-bold"
                                          label-for="descriptionTextArea"
                                          description="Required">
                              <b-form-textarea id="descriptionTextArea"
                                            v-model="profile.description"
                                            placeholder="Enter your description"
                                            :rows="3"
                                            :max-rows="6">
                            </b-form-textarea>
                            </b-form-group>
                          </div>
                        </div>
                        <div class="text-left">
                          <b-button type="reset" variant="secondary">
                            <AppIcon iconName="refresh" />
                            Discard changes
                          </b-button>
                          &nbsp; <!-- Code to print a space -->
                          <b-button type="submit" variant="primary">
                            <AppIcon iconName="floppy-o" />
                            Save changes
                          </b-button>
                        </div>
                      </b-form>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'Settings',
  components:{
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      currentUser: {},
      isGeneral: true,
      file: null,
      general: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      },
      profile: {}
    }
  },
  watch:{
    getCurrentUser(newVal, oldVal){
      this.currentUser = this.getCurrentUser;
    }
  },
  mounted(){
    this.loadCurrentUser();
    this.loadUserProfileData();
  },
  methods:{
    loadCurrentUser(){
      this.currentUser = this.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.$route.push('/');
      }
    },
    loadUserProfileData(){
      
      let that = this;
      let tempObj = {};
      Object.assign(tempObj, that.currentUser);
      that.profile = {
        username: tempObj.username,
        firstName: tempObj.firstName,
        lastName: tempObj.lastName,
        isPublic: tempObj.isPublic,
        description: tempObj.description
      }
    },
    saveGNewPassword(){
      let that = this;

      // Validate input
      if(that.validateGInputs()){
        if(that.validatePassword()){
          axios.patch(`${this.axiosURL}/users/${that.currentUser.id}`, { password: that.general.newPassword })
             .then((response) => {
               swal("Password changed!", "You're password was updated successfully!", "success")
                .then((success) => {
                  
                  //Clear data in WebStorage
                  that.removeCurrentUser();
                  //Send new user data to WebStorage
                  that.saveCurrentUser(response.data, true);

                  location.reload();
                })
             })
        }
      }
    },
    savePNewInfo(){
      let that = this;

      if(that.validateInput()){
        axios.patch(`${that.axiosURL}/users/${that.currentUser.id}`, that.profile)
            .then((response) => {
              swal("Profile updated!", "Your profile was updated successfully!", "success")
              .then((success) => {
                if(success){

                  //Clear data in WebStorage
                  that.removeCurrentUser();
                  //Send new user data to WebStorage
                  that.saveCurrentUser(response.data, true);

                  location.reload();
                }
              })
            });
      }
    },
    validateGInputs(){
      let that = this;
      let inputEmpties = []
      let formData = that.general;

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
    validatePassword(){
      let that = this;

      if(that.general.oldPassword === that.currentUser.password){
         if(that.general.newPassword === that.general.repeatNewPassword){
           return true;
         }else{
          that.dynamicToastr({title: `Passwords wrong`, msg: `You're new password doesn't match the repeat password`, type: `error`});
          return false;
         }
      }else{
        that.dynamicToastr({title: `Password wrong`, msg: `You're old password don't match the existing one`, type: `error`});
        return false;
      }
    },
    validateInput(){
      let that = this;
      let inputEmpties = []
      let formData = that.profile;

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

</style>
