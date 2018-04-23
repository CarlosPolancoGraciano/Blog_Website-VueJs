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
          <b-form @submit.prevent="registerUser">
            <b-form-group label="Email Address:"
                          label-for="emailInput"
                          description="We'll sent a verification email to this address">
              <b-form-input id="emailInput"
                            type="email"
                            v-model="email"
                            required
                            placeholder="Enter your email address">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Password:"
                          label-for="passwordInput">
              <b-form-input id="passwordInput"
                            type="password"
                            v-model="password"
                            required
                            placeholder="Enter your secret password">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Confirm Password:"
                          label-for="confirmPasswordInput">
              <b-form-input id="confirmPasswordInput"
                            type="password"
                            v-model="confirmPassword"
                            required
                            placeholder="Repeat your secret password">
              </b-form-input>
            </b-form-group>
            <div id="recaptcha" class="g-recaptcha" data-sitekey="6Leo0VMUAAAAAJO5KVEWED1Pl0La8xZRSaIzGqzR"></div>
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
import hash from 'object-hash';
import { global } from '@/components/mixins/global';

export default {
  name: 'UserRegister',
  mixins: [global],
  data(){
    return{
      email: "",
      password: "",
      confirmPassword: "",
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL()
    }
  },
  mounted(){
    
  },
  methods:{
    registerUser(){
      let that = this;
      let hashVal = "";
      if(!this.checkIfEmailExist(that.email)){
        if(that.password === that.confirmPassword){

          /*Create user Hash*/
          hashVal = hash(that.email.trim().toLowerCase(), {algorithm: 'sha1'});

          /* New User Data */
          const newUser = {
            id: 1,
            email: that.email,
            password: that.password,
            active: false,
            hash: hashVal
          };

          /* Http Post with New User Data */
          axios.post(`${this.axiosURL}/users`, newUser).then((response) => {
            //Send Email to User
            that.sendVerificationEmail(newUser.hash, newUser.email); 
           });

        }else{
          // Password don't matches
          that.dynamicToastr({title: `Ooops!`, 
                            msg: `Typed passwords don't match`, 
                            type: `error`});

        }
      }else{
        // Email currently used
        that.dynamicToastr({title: `Ooops!`, 
                            msg: `Email currently beign used`, 
                            type: `error`});

      }
      // let gResponse = grecaptcha.getResponse();
      // console.log(gResponse);
    },
    checkIfEmailExist(email){
      let userEmail = [];

      // Http resquest
      axios.get(`${this.axiosURL}/users?email=${email}`).then((response) => { userEmail = response.data });

      // Validations from request response
      if(userEmail === undefined){
        return false;
      }else if(userEmail.length > 0){
        return true;
      }
      return false;
    },
    sendVerificationEmail(hash, email){
      // console.log(hash, email);
      Email.send(
                  "carlospolanco@mctekk.com",
                  `${email}`,
                  "Blog Company - Validate your account",
                  `Copy and paste or click the following link to complete your registration: ${this.siteURL}/#/completeregister/${hash}`,
                  "smtp25.elasticemail.com",
                  "carlospolanco@mctekk.com",
                  "52ddab70-dd62-4c8d-8b7d-ea181d9be63f",
                  function done(message) { 
                    swal(`Registro parcial hecho!`, 
                          `A continuación revisa tu correo electronico para validar tu cuenta, este correo puede tardar unos minutos en llegar`, 
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
