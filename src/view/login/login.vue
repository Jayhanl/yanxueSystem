<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <div class="login-icon">
        <img style="width: 100%;" src="../../assets/images/logo-min.png" alt />
      </div>
      <Card :bordered="false" style="background: rgba(0,0,0,.2);">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { login } from '@/api/user'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit({ username, password }) {
      this.$Message.warning('登录中,请稍等...')
      this.handleLogin({ username, password }).then(res => {
        this.getUserInfo()
          .then(res => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
          .then(() => {
            sessionStorage.setItem(
              'admin',
              JSON.stringify(this.$store.state.user)
            )
          })
      })
    }
  }
}
</script>

<style>
</style>
