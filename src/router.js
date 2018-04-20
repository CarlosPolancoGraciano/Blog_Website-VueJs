import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home/Home.vue'
import PostsNewPost from './components/posts/PostsNewPost.vue'
import PostsPost from './components/posts/PostsPost.vue'
import UserLogin from './components/user/UserLogin.vue'
import UserRegister from './components/user/UserRegister.vue'
import UserCompleteRegister from './components/user/UserCompleteRegister.vue'
import UserForgotPassword from './components/user/UserForgotPassword.vue'
import UserCompleteForgotPassword from './components/user/UserCompleteForgotPassword.vue'
import UserProfile from './components/user/UserProfile.vue'
import UserSettings from './components/user/UserSettings.vue'

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
