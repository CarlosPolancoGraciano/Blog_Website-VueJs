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
import AppIcon from '@/components/app/AppIcon.vue';
import { global } from '@/components/mixins/global.js';

export default {
  name: 'CompleteForgotPassword',
  mixins:[global],
  components:{
    AppIcon
  },
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
      let that = this;

      if(that.newPassword === that.confirmNewPassword){
        axios.patch(`${this.axiosURL}/users/${that.user[0].id}`, { password: that.newPassword, hash: "", isPublic: "true" })
             .then((response) => {
               swal("Password changed!", "You'll be logged in and redirected to create a new post", "success")
               .then((success) => {
                 if(success){
                   that.saveCurrentUser(that.user[0], 'true'); // Log user [true = local | false = session]
                   that.$router.push('/newpost', () => { location.reload(); });
                 }
               })
             })
      }else{
        this.dynamicToastr({title: `Ooops!`, 
                           msg: `Passwords should match!`,
                           position: `toast-bottom-right`,
                           type: `error`});
      }
    },
    dynamicToastr(toastrObj){
      let that = this;
      that.$toastr( 'add',
                      { title: toastrObj.title, 
                        msg: toastrObj.msg, 
                        clickClose: true, 
                        timeout: 10000, 
                        position: toastrObj.position, 
                        type: toastrObj.type });
    }
  }
}
</script>
<style scoped>

</style>
