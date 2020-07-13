<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.nickName"
                clearable
                placeholder="微信名"
              ></Input>
              <Select
                clearable
                placeholder="状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.registerStatus"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                placeholder="身份"
                @on-change="searchManage"
                v-model="searchList.searchCondition.role"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.roleList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <Button icon="md-add" @click="showCollect()">增加</Button>
            </Form-item>
            
            <Modal
              title="查看用户信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>用户信息</h3>
                <Row>
                  <Col span="10">用户id: {{viewData.Detail.registerId}}</Col>
                  <Col span="10">审核状态: {{viewData.Detail.auditStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">用户名: {{viewData.Detail.merchantName}}</Col>
                  <Col span="10">身份: {{viewData.Detail.roleChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">单位电话: {{viewData.Detail.merchantPhone}}</Col>
                  <Col span="10">审核时间: {{viewData.Detail.auditTime}}</Col>
                </Row>
                <Row>
                  <Col span="10">联系电话: {{viewData.Detail.contactNumber}}</Col>
                  <Col span="10">法人姓名: {{viewData.Detail.legalPerson}}</Col>
                </Row>
                <h4>地址: {{viewData.Detail.merchantAddr}}</h4>
                <h4>用户简介: {{viewData.Detail.merchantDesc}}</h4>
                <h3>营业执照</h3>
                <Row>
                  <Col span="18">
                    <img
                      :src="viewData.Detail.businessLicense"
                      class="img_item"
                      preview="0"
                      preview-text="信息封面图"
                    />
                  </Col>
                </Row>
              </div>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color:red">{{viewData.Delete.openid}}</span>
              的信息吗？
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px;">
            <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
            <Page
              style="padding-top: 10px"
              :total="searchList.pageData.total"
              :current="searchList.pageData.pageNum"
              :page-size="10"
              @on-change="onPageChange"
              size="small"
              show-total
            ></Page>
          </Form-item>
        </Form-item>
      </Form>
    </Col>
  </Row>
</template>
<script>
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      fileName: '',
      uploadFile: {},
      searchList: {
        Info: [],
        columns: [
          {
            title: '头像',
            width: 140,
            key: 'avatarUrl',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.avatarUrl
                  },
                  style: {
                    width: '100px',
                    height: '100px'
                  },
                  on: {
                    click: () => {
                      this.showImg(params.row.avatarUrl)
                    }
                  }
                })
              ])
            }
          },
          {
            title: 'openid',
            align: 'center',
            key: 'openId',
            width: 120
          },
          {
            title: '微信名',
            align: 'center',
            key: 'nickName'
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile'
          },
          {
            title: '注册状态',
            align: 'center',
            key: 'registerStatus'
          },
          {
            title: '注册身份',
            align: 'center',
            key: 'roleChina'
          },
          // {
          //   title: '操作',
          //   key: 'action',
          //   width: 200,
          //   align: 'center',
          //   render: (h, params) => {
          //     return h('div', [
          //       h(
          //         'Button',
          //         {
          //           props: {
          //             type: 'primary',
          //             size: 'small'
          //           },
          //           style: {
          //             marginRight: '15px'
          //           },
          //           on: {
          //             click: () => {
          //               this.showDetail(params.row)
          //             }
          //           }
          //         },
          //         '详情'
          //       )
          //     ])
          //   }
          // }
        ],
        data: [],
        pageData: {
          content: [],
          total: 0,
          pageNum: 1
        },
        searchCondition: {
          page: 1,
          limit: 10
        },
        pageData1: {
          content: [],
          total: 0,
          pageNum: 1
        },
        searchCondition1: {
          page: 1,
          limit: 8
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        modalPay: false,
        modalCollect: false,
        modalDelete: false,
        modalDetail: false,
        Confirm: '',
        Detail: {},
        Delete: {},
        statusList: [
          {
            value: 0,
            label: '未注册'
          },
          {
            value: 1,
            label: '注册中'
          },
          {
            value: 2,
            label: '已通过'
          },
          {
            value: -1,
            label: '审核失败'
          }
        ],
        roleList: [
          {
            value: 0,
            label: '普通用户'
          },
          {
            value: 1,
            label: '学生'
          },
          {
            value: 2,
            label: '教师'
          },
          {
            value: 3,
            label: '导师'
          },
          {
            value: 4,
            label: '机构'
          },
          {
            value: 5,
            label: '基地'
          }
        ]
      }
    }
  },
  methods: {
    showImg(ad_picture_url) {
      this.$Modal.info({
        title: '预览图片',
        closable: true,
        content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
      })
    },
    onDeleteBtn() {
      axios
        .delete('/api/user/delete', {
          data: {
            openid: this.viewData.Delete.openid
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    showDetail(row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.registerId = row.registerId
      this.searchDetail()
    },
    onModelCancel() {
      this.searchManage()
    },
    searchPageReturn() {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    searchManage() {
      axios
        .get(`/api/user/get`, {
          params: {
            page: this.searchList.searchCondition.page,
            nickName: this.searchList.searchCondition.nickName,
            registerStatus: this.searchList.searchCondition.registerStatus,
            role: this.searchList.searchCondition.role
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail() {
      axios
        .get('/api/user/personal_detail', {
          params: {
            openId: this.viewData.Detail.openId,
            role: this.viewData.Detail.role,
          }
        })
        .then(res => {
          this.viewData.Detail = res.data
        })
    }
  },
  created() {
    this.searchManage()
  }
}
</script>
<style>
.ivu-form-inline .ivu-form-item {
  margin-right: 0px !important;
}

.ivu-modal-confirm-body-icon {
  display: none;
}

.ivu-modal-confirm-body {
  padding-left: 0 !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.ivu-modal-confirm-footer {
  margin-top: 20px;
}

.ivu-form-item-content button[data-cmd='imageUpload'] {
  display: none !important;
  color: black !important;
}

.ivu-form-item-content button[data-cmd='imageByURL'] {
  display: none !important;
  color: black !important;
}

.ivu-form-item-content .fr-popup .fr-image-upload-layer {
  display: none !important;
}

.btnR {
  float: left;
  padding: 10px 18px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
}
</style>
