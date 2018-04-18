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
            <b-form-file v-model="userCompletedData.file" placeholder="Upload your profile picture..."></b-form-file>
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
import axios from 'axios';
import swal from 'sweetalert';

export default {
  name: 'CompleteRegister',
  data(){
    return{
      user: [],
      userCompletedData: {
        username: "",
        firstName: "",
        lastName: "",
        file: null,
        description: ""
      }
    }
  },
  mounted(){
    //this.checkForHash();
  },
  methods:{
    checkForHash(){
      if(this.$route.query.q === undefined){
        this.$router.push('/');
      }
      if(checkIfHashExistInUser(this.$route.query.q)){
        swal('Cuenta verificada', 'Completa los siguientes campos para terminar de registrarte', 'success');
      }
    },
    checkIfHashExistInUser(hash){
      let that = this;
      let user = [];
      axios.get(`http://localhost:3000/users?hash=${hash}`)
           .then((response) => {
             user = response.data;
           });
      if(user.length > 0){
        that.user = user;
        return true;
      }
      return false;
    },
    completeUserRegister(){

    }
  }
}
</script>
<style scoped>

</style>