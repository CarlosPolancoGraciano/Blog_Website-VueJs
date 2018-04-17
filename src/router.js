import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NewPost from './views/Posts/NewPost.vue'
import Post from './views/Posts/Post.vue'

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
    }
  ]
})
