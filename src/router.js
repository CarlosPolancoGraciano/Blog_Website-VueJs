import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PostsNewPost from './views/Posts/PostsNewPost.vue'
import PostsPost from './views/Posts/PostsPost.vue'
import UserLogin from './views/User/UserLogin.vue'
import UserRegister from './views/User/UserRegister.vue'
import UserProfile from './views/User/UserProfile.vue'
import UserCompleteRegister from './views/User/UserCompleteRegister.vue'

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
      path: '/completeregister/:hash',
      name: 'completeregister',
      component: UserCompleteRegister
    }
  ]
})
