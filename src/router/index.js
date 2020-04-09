import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
import Users from 'components/Users'
import Rights from 'components/Rights'
import Roles from 'components/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
})
// vue的导航守卫登录拦截
router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  // 如果是去登录直接放行
  if (to.path === '/login') {
    next()
    return
  }
  // 如果不是登录，查看有没有token，有放行，没有去等录
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
