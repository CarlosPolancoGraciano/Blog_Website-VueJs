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
import axios from 'axios';
import swal from 'sweetalert';
import hash from 'object-hash';

export default {
  name: 'Register',
  data(){
    return{
      email: "",
      password: "",
      confirmPassword: ""
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
          hashVal = hash(that.email, {algorithm: 'sha1'});

          /* New User Data */
          let newUser = {
            id: 1,
            email: that.email,
            password: that.password,
            active: false,
            hash: hashVal
          };

          /* Http Post with New User Data */
          axios.post('http://localhost:3000/users', newUser).then((response) => {
            
            //Send Email to User
            that.$toastr('success', 'User Created!', 'User created successfully');
            //that.sendVerificationEmail(hash, that.email); 
           });

        }else{
          that.$toastr( 'add',
                      { title: 'Ooops!', 
                        msg: 'Las contraseñas ingresadas no coinciden', 
                        clickClose: true, 
                        timeout: 10000, 
                        position: 'toast-bottom-right', 
                        type: 'error' });
        }
      }else{
        that.$toastr( 'add',
                    { title: 'Ooops!', 
                      msg: 'El correo que intentas utilizar ya existe', 
                      clickClose: true, 
                      timeout: 10000, 
                      position: 'toast-bottom-right', 
                      type: 'error' });

      }
      // let gResponse = grecaptcha.getResponse();
      // console.log(gResponse);
    },
    checkIfEmailExist(email){
      let userEmail = [];
      axios.get(`http://localhost:3000/users?email=${email}`).then((response) => {
        userEmail = response.data;
      });
      if(userEmail === undefined){
        return false;
      }else if(userEmail.length > 0){
        return true;
      }
      return false;
    },
    sendVerificationEmail(hash, email){
      Email.sendWithAttachment(
                  "carlospolanco@mctekk.com",
                  `${email}`,
                  "Blog Company - Validate your account",
                  `this is the body`,
                  "smtp25.elasticemail.com",
                  "carlospolanco@mctekk.com",
                  "52ddab70-dd62-4c8d-8b7d-ea181d9be63f",
                  `http://localhost:8080/#/Register?h=${hash}`,
                  function done(message) { 
                    swal(`Registro parcial hecho!`, 
                          `A continuación revisa tu correo electronico para validar tu cuenta, este correo puede tardar unos minutos en llegar`, 
                          `success`);
                  }    
               );
    }
  }
}
</script>
<style scoped>

</style>
