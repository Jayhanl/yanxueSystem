<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.orderId" clearable
              placeholder="订单ID"></Input>
            <Select clearable placeholder="状态" @on-change="searchManage"
              v-model="searchList.searchCondition.orderStatus" class="search_item">
              <Option v-for="item in viewData.statusList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
            <input style="display:none" class="ImgC" type="file" merchantName="avatar"
              accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)" ref="avatarInput" />
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
          </Form-item>modalCancel
          <Modal :mask-closable="false" title="取消确认" width="400" v-model="viewData.modalCancel" @on-ok="onCancelBtn">
            <Form :label-width="80">
              <Form-item class="">
                确认拒绝订单id：
                <span style="color:red">{{viewData.Confirm.orderId}}</span>
                的审核吗？
              </Form-item>
              <Form-item class="form_item" label="拒绝原因:">
                <Input style="width: 200px" v-model="viewData.Confirm.reason" type="text" placeholder="请输入拒绝原因"></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal :mask-closable="false" title="拒绝退款确认" width="400" v-model="viewData.modalRefuse" @on-ok="onAuditBtn(0)">
            <Form :label-width="80">
              <Form-item class="">
                确认拒绝订单id：
                <span style="color:red">{{viewData.Confirm.orderId}}</span>
                的退款吗？
              </Form-item>
              <Form-item class="form_item" label="拒绝原因:">
                <Input style="width: 200px" v-model="viewData.Confirm.reason" type="text" placeholder="请输入拒绝原因"></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal :mask-closable="false" title="通过退款确认" width="400" v-model="viewData.modalPass" @on-ok="onAuditBtn(1)">
            确认通过订单id：
            <span style="color:red">{{viewData.Confirm.orderId}}</span>
            的退款吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除订单id为：
            <span style="color:red">{{viewData.Delete.orderId}}</span>
            的订单吗？
          </Modal>
          <Modal title="查看订单信息详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
            <div class="order_info">
              <h3>订单信息</h3>
              <Row>
                <Col span="10">订单id: {{viewData.Detail.orderId}}</Col>
                <Col span="10">订单状态: {{viewData.Detail.orderStatusChina}}</Col>
              </Row>
              <Row>
                <Col span="10">开展课程ID: {{viewData.Detail.courseLogId}}元</Col>
                <Col span="10">创建时间: {{viewData.Detail.createTime}}</Col>
              </Row>
              <Row>
                <Col span="10">订单价格: {{viewData.Detail.orderPrice}}元</Col>
                <Col span="10">付款时间: {{viewData.Detail.payTime}}</Col>
              </Row>
              <Row>
                <Col span="10">课程名: {{viewData.Detail.courseName}}</Col>
                <Col span="10">课程开展时间: {{viewData.Detail.courseStartTime}}</Col>
              </Row>
              <Row>
                <Col span="10">学生名: {{viewData.Detail.stuName}}</Col>
                <Col span="10">身份证号: {{viewData.Detail.stuIdentityCard}}</Col>
              </Row>
              <h4>学校: {{viewData.Detail.stuSchool}}</h4>
              <Row>
                <Col span="10">班级: {{viewData.Detail.stuGrade}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.stuMobile}}</Col>
              </Row>
              <Row>
                <Col span="10">紧急联系人: {{viewData.Detail.emergencyContact}}</Col>
                <Col span="10">紧急联系电话: {{viewData.Detail.emergencyContactNumber}}</Col>
              </Row>
              <h3>承办机构</h3>
              <Row>
                <Col span="10">导师: {{viewData.Detail.tutorName}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.tutorContactNumber}}</Col>
              </Row>
              <Row>
                <Col span="10">机构: {{viewData.Detail.merchantName}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.merchantContactNumber}}</Col>
              </Row>
              <Row>
                <Col span="10">基地: {{viewData.Detail.baseName}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.baseContactNumber}}</Col>
              </Row>
            </div>
          </Modal>
        </Form>
        <Form-item style="padding-top: 10px;">
          <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
          <Page style="padding-top: 10px" :total="searchList.pageData.total" :current="searchList.pageData.pageNum"
            :page-size="10" @on-change="onPageChange" size="small" show-total></Page>
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
  data () {
    return {
      formDynamic: {
        index: 1,
        items: [{
          key: '',
          value: '',
          index: 1,
          status: 1
        }]
      },
      searchList: {
        carList: [],
        categoryList: [],
        columns: [{
          title: '订单Id',
          align: 'center',
          key: 'orderId'
        },
        {
          title: '课程名',
          align: 'center',
          key: 'courseName'
        },
        {
          title: '学生名',
          align: 'center',
          key: 'stuName'
        },
        {
          title: '学校',
          align: 'center',
          key: 'stuSchool'
        },
        {
          title: '班级',
          align: 'center',
          key: 'stuGrade'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'stuMobile'
        },
        {
          title: '订单价格',
          align: 'center',
          key: 'orderPrice'
        },
        {
          title: '订单状态',
          align: 'center',
          key: 'orderStatusChina'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            const arr = [
              h(
                'Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.row)
                    }
                  }
                },
                '详情'
              )
            ]
            if (params.row.orderStatus === -3) {
              arr.push(
                h(
                  'Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showPass(params.row)
                      }
                    }
                  },
                  '通过退款'
                ),
                h(
                  'Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showRefuse(params.row)
                      }
                    }
                  },
                  '拒绝退款'
                )
              )
            } else if (params.row.orderStatus === 1 || params.row.orderStatus === 2) {
              arr.push(
                h(
                  'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showRefuse(params.row)
                      }
                    }
                  },
                  '取消'
                )
              )
            }
            return h('div', arr)
          }
        }
        ],
        data: [],
        pageData: {
          content: [],
          pageNum: 1,
          numberOfElements: 0,
          total: 0,
          totalPages: 0
        },
        searchCondition: {
          page: 1,
          size: 5,
          role: 4
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        goodsIId: '',
        Detail: '',
        Delete: {},
        Confirm: {},
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalCancel: false,
        modalPass: false,
        statusList: [{
          value: 0,
          label: '待付款'
        },
        {
          value: 1,
          label: '待参加'
        },
        {
          value: 2,
          label: '参加中'
        },
        {
          value: 3,
          label: '已完成'
        },
        {
          value: -1,
          label: '已取消'
        },
        {
          value: -2,
          label: '退款中'
        },
        {
          value: -3,
          label: '申请退款中'
        }
        ]
      }
    }
  },
  methods: {
    showImg (ad_picture_url) {
      this.$Modal.info({
        title: '预览图片',
        closable: true,
        content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
      })
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/api/merchant/delete', {
          data: {
            orderId: this.viewData.Delete.orderId
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    onAuditBtn (status) {
      axios
        .put(
          '/api/order/audit',
          qs.stringify({
            orderId: this.viewData.Confirm.orderId,
            isPass: status,
            reason: status ? '' : this.viewData.Confirm.reason
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onCancelBtn (status) {
      axios
        .put(
          '/api/order/cancel',
          qs.stringify({
            orderId: this.viewData.Confirm.orderId,
            reason: this.viewData.Confirm.reason
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.orderId = row.orderId
      this.searchDetail()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    showCancel (item) {
      this.viewData.Confirm = item
      this.viewData.modalCancel = true
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/api/order/get', {
          params: {
            page: this.searchList.searchCondition.page,
            orderId: this.searchList.searchCondition.orderId,
            orderStatus: this.searchList.searchCondition.orderStatus
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/api/order/detail', {
          params: {
            orderId: this.viewData.orderId
          }
        })
        .then(res => {
          this.viewData.Detail = res.data
        })
    }
  },
  created () {
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

  .btnR {
    float: left;
    padding: 10px 18px;
  }

  .btnR span {
    display: flex;
    line-height: 20px;
    padding-left: 5px;
  }

  .choice_img {
    width: 120px;
    position: relative;
  }

  .ImgC {
    opacity: 0;
    width: 120px;
    height: 32px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .img_container {
    width: 100%;
  }

  .img_container .ivu-form-item-content {
    display: flex;
  }

  .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    color: #0c0c0c !important;
  }

  .order_info {
    font-size: 18px;
    margin-left: 20px;
    color: #666;
  }

  .order_info h3 {
    margin: 10px 0;
    color: #222;
  }

  .order_info h4 {
    margin: 20px;
    font-weight: 1 !important;
  }

  .order_info .ivu-row {
    margin: 20px;
  }

  .order_info .order_item {
    border-bottom: 1px solid #eee;
  }

  .order_info .order_item .title {
    color: #333;
  }

  .order_info .img_item {
    width: 70px;
    height: 70px;
    margin-right: 10px;
  }

</style>
