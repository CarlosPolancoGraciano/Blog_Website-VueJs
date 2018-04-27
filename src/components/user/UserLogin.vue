<template>
  <div class="container-fluid">
    <div class="container my-3">
      <div class="row">
        <div class="col-3"></div>
        <div class="col-6">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="text-center">
                    <span class="h3">Login</span>
                  </div>
                  <div class="text-left">
                    <b-form @submit.prevent="loginUser">
                      <b-form-group label="Email address:" 
                                    label-for="emailInput">
                        <b-form-input id="emailInput" 
                                      type="email" 
                                      v-model="login.email" 
                                      required 
                                      placeholder="Enter email">
                        </b-form-input>
                      </b-form-group>
                      <b-form-group label="Password:" 
                                    label-for="passwordInput">
                        <b-form-input id="passwordInput" 
                                      type="password" 
                                      v-model="login.password" 
                                      required 
                                      placeholder="Enter secret password">
                        </b-form-input>
                      </b-form-group>
                      <b-button class="btn-block" 
                                variant="primary" 
                                type="submit" 
                                size="md">
                        <AppIcon iconName="sign-in" /> Login
                      </b-button>
                      <div class="row mt-3">
                        <div class="col-6">
                          <b-form-checkbox id="checkbox1" 
                                           v-model="login.rememberMe" 
                                           value="true" 
                                           unchecked-value="false">
                            Remember me
                          </b-form-checkbox>
                        </div>
                        <div class="col-6 text-right">
                          <router-link class="text-muted" to="/forgotpassword">Forgot password?</router-link>
                        </div>
                      </div>
                    </b-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </div>
</template>
<script>
import hash from "object-hash";
import AppIcon from "@/components/app/AppIcon.vue";

export default {
  name: "Login",
  components: {
    AppIcon
  },
  data() {
    return {
      siteURL: this.websiteURL(),
      axiosURL: this.requestURL(),
      storageKey: this.webstorageKey(),
      login: {
        email: "",
        password: "",
        rememberMe: ""
      }
    };
  },
  methods: {
    loginUser() {
      let that = this;
      let isLocal = (this.login.rememberMe == "true");
        
      axios.get(`${this.axiosURL}/users?email=${this.login.email}&password=${this.login.password}`)
        .then(response => {
          const user = response.data;

          if(user.length > 0){
            if (isLocal) {
              //localStorage

              /* Mixin methods */
              // GLOBAL
              let saveResult = this.saveWebStorageCurrentUser(user[0], isLocal);

              // Save data in Vuex through Mixins - USER_AUTH
              this.setAuthCurrentUser(user);

              // USER_LOGGED
              this.setUserLogged();

              if(saveResult){
                that.$router.push("/");
              }
            }else{
              //sessionStorage

              /* Mixin methods */
              // GLOBAL
              let saveResult = this.saveWebStorageCurrentUser(user[0], isLocal);

              // Save data in Vuex through Mixins - USER_AUTH
              this.setAuthCurrentUser(user);

              // USER_LOGGED
              this.setUserLogged();

              if(saveResult){
                that.$router.push("/");
              }
            }
          }else{
            this.dynamicToastr({title: "Access Denied",
                              msg: `Your email or password is invalid`, 
                              type: "error"});
          }
          
        })
        .catch((error) => {
          console.log(error);
          this.dynamicToastr({title: "Ooops!",
                              msg: `Error while requesting to API`, 
                              type: "error"});
        });
    },
    dynamicToastr(toastrObj) {
      let that = this;

      that.$toastr("add", {
        title: toastrObj.title,
        msg: toastrObj.msg,
        clickClose: true,
        timeout: 5000,
        position: "toast-bottom-right",
        type: toastrObj.type
      });
    }
  }
};
</script>
<style scoped>
</style>
