import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PostsNewPost from './views/Posts/PostsNewPost.vue'
import PostsPost from './views/Posts/PostsPost.vue'
import UserLogin from './views/User/UserLogin.vue'
import UserRegister from './views/User/UserRegister.vue'
import UserCompleteRegister from './views/User/UserCompleteRegister.vue'
import UserForgotPassword from './views/User/UserForgotPassword.vue'
import UserCompleteForgotPassword from './views/User/UserCompleteForgotPassword.vue'
import UserProfile from './views/User/UserProfile.vue'
import UserSettings from './views/User/UserSettings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/newpost',
      name: 'newpost',
      component: PostsNewPost
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostsPost
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegister
    },
    {
      path: '/completeregister/:hash',
      name: 'completeregister',
      component: UserCompleteRegister
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: UserForgotPassword
    },
    {
      path: '/completeforgotpassword/:hash',
      name: 'completeforgotpassword',
      component: UserCompleteForgotPassword
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile
    },
    {
      path: '/settings',
      name: 'settings',
      component: UserSettings
    }
  ]
})
