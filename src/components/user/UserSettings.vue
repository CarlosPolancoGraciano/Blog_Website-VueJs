<template>
  <div>
    <div class="container-fluid">
      <div class="row m-3 p-5">
        <div class="col-md-4 border-right">
          <div class="list-group">
            <b-btn class="list-group-item list-group-item-action"
                    :class=" isGeneral ? 'collapsed active' : null"
                    v-b-toggle="'collapseGeneral'"
                    aria-controls="collapseGeneral" 
                    :aria-expanded="isGeneral ? 'true' : 'false'"
                    @click="isGeneral = true">General</b-btn>
            <b-btn class="list-group-item list-group-item-action"
                    :class=" !isGeneral ? 'collapsed active' : null"
                    v-b-toggle="'collapseProfile'"
                    aria-controls="collapseProfile" 
                    :aria-expanded=" !isGeneral ? 'true' : 'false'"
                    @click="isGeneral = false">Perfil</b-btn>
          </div>
        </div>
        <div class="col-md-8 border-left">
          <b-collapse visible id="collapseGeneral">
            <div class="container">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="text-left my-3">
                        <h2>Datos Generales</h2>
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
                          &nbsp;
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
          <b-collapse id="collapseProfile">
           asdasd
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppIcon from '@/components/app/AppIcon.vue';
import { global } from '@/components/mixins/global';

export default {
  name: 'Settings',
  mixins: [global],
  components:{
    AppIcon
  },
  data(){
    return{
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      currentUser: {},
      isGeneral: true,
      general: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      }
    }
  },
  mounted(){
    this.loadCurrentUser();
  },
  methods:{
    loadCurrentUser(){
      this.currentUser = this.$store.getters.getCurrentUser;
      if(Object.keys(this.currentUser).length == 0){ //Check if object is empty
        this.$route.push('/');
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

                  //Clear inputs values
                  // that.general.oldPassword = '';
                  // that.general.newPassword = '';
                  // that.general.repeatNewPassword = '';
                  location.reload();
                })
             })
        }
      }
    },
    savePNewInfo(){
      let that = this;

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
