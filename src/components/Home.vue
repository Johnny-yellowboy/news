<template>
  <el-container class="home">
    <el-header>
      <div class="fl logo"></div>
      <div class="fl title">
        <h1>后台管理系统</h1>
      </div>
      <div class="fr">
        欢迎光临
        <a href="javascript:;" class="login-out" @click="loginOut">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="this.$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu :data="menuList" :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-user-solid" v-if="menu.path =='users'"></i>
              <i class="el-icon-s-tools" v-else-if="menu.path =='rights'"></i>
              <i class="el-icon-menu" v-else-if="menu.path =='roles'"></i>
              <i class="el-icon-s-goods" v-else-if="menu.path =='goods'"></i>
              <i class="el-icon-menu" v-else-if="menu.path =='roles'"></i>
              <i class="el-icon-s-order" v-else-if="menu.path =='orders'"></i>
              <i class="el-icon-s-marketing" v-else-if="menu.path =='reports'"></i>
              <!-- <i :class="menu.path =='goods'?'el-icon-s-goods':''"></i> -->
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="rights">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-s-operation"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-s-grid"></i>
              <span slot="title">商品分类</span>
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    async loginOut() {
      try {
        await this.$confirm('你确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // .then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        // })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    async getMenuList() {
      let res = await this.axios.get('menus')
      // console.log(res)
      let {
        data,
        meta: { status }
      } = res

      if (status === 200) {
        this.menuList = data
      }
    }
  },
  created() {
    this.getMenuList()
    // console.log(this.$route)
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header,
  .el-footer {
    background-color: #9ec8ff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .title {
    color: #fff;
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
  .logo {
    width: 180px;
    height: 100%;
    background: url('../assets/images/logo.png') no-repeat center;
    background-size: 90% 125%;
    background-position-x: -20px;
  }
  .login-out {
    color: #007dbe;
  }
}
</style>
