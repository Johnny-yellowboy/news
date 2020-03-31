import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'

Vue.use(Router)
Vue.use(ElementUI)

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
      component: Home
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
