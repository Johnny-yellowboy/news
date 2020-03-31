<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-form"
      status-icon
    >
      <img src="../assets/images/15242978.jpg" alt />
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset(form)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                showClose: true,
                message: '恭喜你，登录成功',
                type: 'success'
              })
              // 存储后台给的token
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
            } else {
              this.$message({
                showClose: true,
                message: res.data.meta.msg,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    reset() {
      console.log(this.$refs.form)

      this.$refs.form.resetFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #068ae6;
  overflow: hidden;
  .login-form {
    width: 500px;
    background-color: #fff;
    padding: 80px 30px 20px;
    border-radius: 15px;
    position: relative;
    margin: 200px auto;
    img {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -25%;
      transform: translateX(-50%);
      box-sizing: border-box;
      border: 10px solid #fff;
    }
  }
}
</style>
