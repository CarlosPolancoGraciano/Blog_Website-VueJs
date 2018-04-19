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
  import axios from "axios";
  import swal from "sweetalert";
  import hash from "object-hash";
  import { global } from "@/components/mixins/global";
  import AppIcon from "@/components/AppIcon.vue";

  export default {
    name: "Login",
    mixins: [global],
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
        let isLocal = (that.login.rememberMe == "true");
        
        axios.get(`${that.axiosURL}/users?email=${that.login.email}&password=${that.login.password}`)
          .then((response) => {
            const user = response.data;
            if (isLocal) {
              let saveResult = that.saveCurrentUser(user[0], isLocal);
              if(saveResult){
                this.$router.push("/", () => { location.reload(); });
              }

            }else{
              let saveResult = that.saveCurrentUser(user[0], isLocal);
              if(saveResult){
                this.$router.push("/", () => { location.reload(); });
              }

            }
          })
          .catch((error) => {
            that.dynamicToastr({title: "Ooops!",
                                msg: `Error while requesting to API`, 
                                type: "error"});
          });
          
      },
      dynamicToastr(toastrObj) {
        var that = this;

        that.$toastr("add", {
          title: toastrObj.title,
          msg: toastrObj.msg,
          clickClose: true,
          timeout: 10000,
          position: "toast-bottom-right",
          type: toastrObj.type
        });
      }
    }
  };
</script>
<style scoped>
</style>
