import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NewPost from './views/Posts/NewPost.vue'
import Login from './views/User/Login.vue'
import Register from './views/User/Register.vue'
import Profile from './views/User/Profile.vue'
import Post from './views/Posts/Post.vue'
import CompleteRegister from './views/User/CompleteRegister.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/NewPost',
      name: 'newpost',
      component: NewPost
    },
    {
      path: '/Post',
      name: 'post',
      component: Post
    },
    {
      path: '/Register',
      name: 'register',
      component: Register
    },
    {
      path: '/Login',
      name: 'login',
      component: Login
    },
    {
      path: '/Profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/CompleteRegister',
      name: 'completeregister',
      component: CompleteRegister
    }
  ]
})
