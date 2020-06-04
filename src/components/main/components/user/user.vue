<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator" />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <div class="ivu-dropdown-item" @click="change">修改密码</div>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="modalPsw" title="修改密码" :mask-closable="false" @on-ok="changePsw()">
      <Form :label-width="80">
        <FormItem label="修改密码">
          <Input style="width:200px" :maxlength="16" v-model="password" placeholder="请输入新密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { changeUserPsw } from '@/api/user'
import axios from 'axios'
export default {
  name: 'User',
  data() {
    return {
      modalPsw: false,
      password: ''
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    change() {
      this.modalPsw = true
    },
    changePsw() {
      changeUserPsw(this.password).then(() => {
          this.password = ''
          this.$Message.success('修改成功!')
        })
      // axios
      //   .put('/api/login/admin/update_password', {
      //     password: this.password
      //   })
      //   .then(response => {
      //     this.password = ''
      //     this.$Message.success('修改成功!')
      //   })
    },
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message() {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  }
}
</script>
