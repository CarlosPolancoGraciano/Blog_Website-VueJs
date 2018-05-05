<template>
   <div class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="text-center">
                <span class="h3 text-muted">Completar recuperar contraseña</span>
                <b-form @submit.prevent="saveNewPasswords">
                  <b-form-group label="New password:"
                                label-for="newPasswordInput"
                                description="We'll reset you old password for this one">
                    <b-form-input id="newPasswordInput"
                                  type="password"
                                  v-model="newPassword"
                                  required
                                  placeholder="Enter your secret password">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group label="Confirm new password:"
                                label-for="confirmNewPasswordInput"
                                description="Password must match">
                    <b-form-input id="confirmNewPasswordInput"
                                  type="password"
                                  v-model="confirmNewPassword"
                                  required
                                  placeholder="Re-enter your secret password">
                    </b-form-input>
                  </b-form-group>
                  <b-button type="submit"
                            variant="primary"
                            size="md">
                    <AppIcon iconName="floppy-o" />
                    &nbsp;
                    Save new passwords
                  </b-button>
                </b-form>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CompleteForgotPassword',
  data(){
    return {
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      user: [],
      newPassword: "",
      confirmNewPassword: ""
    }
  },
  mounted(){
    this.checkForHash();
  },
  methods:{
    checkForHash(){
      if(this.$route.params.hash === null){
        this.$router.push('/', () => { swal("Ooops!", "You don't have access!", "error") })
      }
      this.dynamicToastr({title: `Validation successful!`, 
                           msg: `Fill the following fields to complete your password reset`,
                           position: `toast-top-full-width`,
                           type: `success`});
      this.checkUserWithHash();
    },
    checkUserWithHash(){
      let that = this;
      let user = null;
      let hashVal = this.$route.params.hash;

      axios.get(`${this.axiosURL}/users?hash=${hashVal}`).then((response) => { 
        user = response.data;
        this.user = user;
      });
    },
    saveNewPasswords(){
      if(this.newPassword === this.confirmNewPassword){
        axios.patch(`${this.axiosURL}/users/${this.user[0].id}`, { password: this.newPassword, hash: "", isPublic: "true" })
             .then((response) => {
               swal("Password changed!", "You'll be logged in and redirected to create a new post", "success")
               .then((success) => {
                 if(success){
                  /* Methods in mixins */
                  // GLOBAL
                  this.saveCurrentUser(this.user[0], 'true'); // Log user [true = local | false = session]

                  // USER_LOGGED
                  this.setUserLogged();
                  this.$router.push('/newpost');
                 }
               })
             })
      }else{
        this.dynamicToastr({title: `Ooops!`, 
                           msg: `Passwords should match!`,
                           position: `toast-bottom-right`,
                           type: `error`});
      }
    }
  }
}
</script>
<style scoped>

</style>
