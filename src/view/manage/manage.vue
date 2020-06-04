<template>
  <c-layout>
    <c-menu>
      <div v-if="Allrole.length" v-for="(item,index) in Allrole" :key="index">
        <c-menu-item :path="item.path" icon="bookmark-o" :name="item.name"/>
      </div>
    </c-menu>
  </c-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    data () {
      return {
        Allrole: [],
        dashboard: false
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    mounted () {
      this.Allrole = [];
      console.log(this.roles)
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i].name === '管理') {
          this.roles[i].children.forEach(e => {
            let arr = {};
            arr.path = '/manage/' + e.path;
            arr.name = e.name;
            this.Allrole.push(arr)
          });
        }
      }
      const name = this.$store.getters.name;
      if (this.$store.getters.dashboard !== false) {
        this.$Notice.success({
          title: '欢迎登录保卫队后台系统',
          desc: `您的账户角色是 ${name}`,
          duration: 4
        });
        this.$store.dispatch('ChangeDashboard', this.dashboard);
      }
    }
  }
</script>

<style>

</style>
