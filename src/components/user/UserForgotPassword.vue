<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <div class="text-center">
                <span class="h3 text-muted">Recuperar contraseña</span>
                <b-form @submit.prevent="sendForgotPasswordEmail">
                  <b-form-group label="Email address:"
                                label-for="emailInput"
                                description="We'll send you an email to this address to change your password">
                    <b-form-input id="emailInput"
                                  type="email"
                                  v-model="email"
                                  required
                                  placeholder="Enter account email">
                    </b-form-input>
                  </b-form-group>
                  <b-button type="submit"
                            variant="primary"
                            size="md">
                    <AppIcon iconName="envelope" />
                    &nbsp;
                    Send email
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
import hash from 'object-hash';
import AppIcon from '@/components/app/AppIcon.vue';

export default {
  name: 'ForgotPassword',
  components:{
    AppIcon
  },
  data(){
    return{
      email: "",
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL()
    }
  },
  methods:{
    sendForgotPasswordEmail(){
      let that = this;
      axios.get(`${this.axiosURL}/users?email=${this.email}`)
           .then((response) => {
             let user = response.data;
             if(user !== null){
               that.saveNewHashInUsers(hash(that.email.trim().toLowerCase(), {algorithm: 'sha1'}), user[0].id, that.email);
             }else{
               // Email currently used
              that.dynamicToastr({title: `Ooops!`, 
                                  msg: `Email is not registered!`, 
                                  type: `error`});
             }
           });
    },
    saveNewHashInUsers(hashEmail, userId, email){
      let that = this;
      axios.patch(`${this.axiosURL}/users/${userId}`, { hash: hashEmail })
                    .then((response) => {
                      that.sendEmailVerification(hashEmail, email);
                    });
    },
    sendEmailVerification(hash, email){
      Email.send(
                "carlospolanco@mctekk.com",
                `${email}`,
                "Blog Company - Forgot password",
                `Copy and paste or click the following link to complete your registration: ${this.siteURL}/#/completeforgotpassword/${hash}`,
                "smtp25.elasticemail.com",
                "carlospolanco@mctekk.com",
                "52ddab70-dd62-4c8d-8b7d-ea181d9be63f",
                function done(message) { 
                  swal(`Email sent!`, 
                        `Go to your email service and check for carlospolanco@mctekk.com emails`, 
                        `success`);
                }    
               );
    },
    dynamicToastr(toastrObj){
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
