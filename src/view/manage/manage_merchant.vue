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
                v-model="searchList.searchCondition.merchantName"
                clearable
                placeholder="商家名称"
              ></Input>
              <Select
                clearable
                placeholder="商家状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.merchantStatus"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <input
                style="display:none"
                class="ImgC"
                type="file"
                name="avatar"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="changeImage($event)"
                ref="avatarInput"
              />
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <!-- <Button icon="md-add" @click="showAdd()">增加商家</Button> -->
            </Form-item>
            <Modal
              :mask-closable="false"
              title="更改认证状态"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="onUpdateBtn()"
            >
              <Form :label-width="100">
                <Form-item class="form_item" label="商家名称:">{{viewData.Confirm.merchantName}}</Form-item>
                <Form-item class="form_item" label="供应商认证:">
                  <RadioGroup v-model="viewData.Audit.isSupplier" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item class="form_item" label="采购商认证:">
                  <RadioGroup v-model="viewData.Audit.isPurchaser" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              :title="'商家id:'+viewData.Confirm.merchantId+'审核'"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onAuditBtn()"
            >
              <Form :label-width="100">
                <Form-item class="form_item" label="商家名称:">{{viewData.Confirm.merchantName}}</Form-item>
                <Form-item class="form_item" label="是否通过认证:">
                  <RadioGroup v-model="viewData.Audit.isPass" size="large">
                    <Radio label="0">拒绝</Radio>
                    <Radio label="1">通过</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item v-show="viewData.Audit.isPass==='1'" class="form_item" label="供应商认证:">
                  <RadioGroup v-model="viewData.Audit.isSupplier" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item v-show="viewData.Audit.isPass==='1'" class="form_item" label="采购商认证:">
                  <RadioGroup v-model="viewData.Audit.isPurchaser" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item v-show="viewData.Audit.isPass==='0'" class="form_item" label="拒绝原因:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Audit.reason"
                    type="text"
                    placeholder="请输入拒绝原因"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除商家id为：
              <span style="color:red">{{viewData.Delete.merchantId}}</span>
              的商家吗？
            </Modal>
            <Modal
              title="查看商家信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>商家信息</h3>
                <Row>
                  <Col span="10">商家id: {{viewData.Detail.merchantId}}</Col>
                  <Col span="10">状态: {{viewData.Detail.merchantStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">商家名称: {{viewData.Detail.merchantName}}</Col>
                  <Col span="10">联系电话: {{viewData.Detail.merchantPhone}}</Col>
                </Row>
                <Row>
                  <Col span="10">微信号: {{viewData.Detail.merchantWechat}}</Col>
                  <Col span="10">浏览次数: {{viewData.Detail.browseCount}}</Col>
                </Row>
                <Row>
                  <Col span="10">所在地区:{{viewData.Detail.merchantArea}}</Col>
                  <Col span="10">详细地址: {{viewData.Detail.merchantAddr}}</Col>
                </Row>
                <h4>商家简介: {{viewData.Detail.merchantDesc}}</h4>
                <Row>
                  <Col span="10">供应商认证: {{viewData.Detail.isSupplier?'是':'否'}}</Col>
                  <Col span="10">采购商认证: {{viewData.Detail.isPurchaser?'是':'否'}}</Col>
                </Row>
                <Row>
                  <Col span="10">发布供应信息数: {{viewData.Detail.goodsReleaseCount}}</Col>
                  <Col span="10">发布采购信息数: {{viewData.Detail.purchaseReleaseCount}}</Col>
                </Row>
                <!-- <h4>发布时间: {{viewData.Detail.createTime}}</h4> -->
                <!-- 采购信息 -->
                <h3>图片视频</h3>
                <Row>
                  <Col span="4">商家头像:</Col>
                  <Col span="18">
                    <img
                      :src="viewData.Detail.merchantAvatarUrl"
                      class="img_item"
                      preview="0"
                      preview-text="商家封面图"
                    />
                  </Col>
                </Row>
                <Row v-if="viewData.Detail.merchantVideo">
                  <Col span="4">商家视频:</Col>
                  <Col span="18">
                    <video :src="viewData.Detail.merchantVideo" height="200" width="400px" controls></video>
                  </Col>
                </Row>
                <Row>
                  <Col span="4">商家图:</Col>
                  <Col span="18">
                    <img
                      v-for="(item,index) in viewData.Detail.merchantGallery"
                      :key="index"
                      :src="item"
                      class="img_item"
                      preview="1"
                      preview-text="商家图"
                    />
                  </Col>
                </Row>

                <!-- 用户信息 -->
                <!-- <h3>信息认证</h3>是否通过认证：
              <Switch :value="viewData.Detail.isAuthentication===1" @on-change="changeAuthentication" size="large">
                <span slot="open">通过</span>
                <span slot="close">暂不</span>
                </Switch>-->
              </div>
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
  data () {
    return {
      formDynamic: {
        index: 1,
        items: [
          {
            key: '',
            value: '',
            index: 1,
            status: 1
          }
        ]
      },
      searchList: {
        carList: [],
        categoryList: [],
        columns: [
          {
            title: '商家Id',
            align: 'center',
            key: 'merchantId'
          },
          {
            title: '商家名称',
            align: 'center',
            key: 'merchantName'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'merchantPhone'
          },
          {
            title: '所在地区',
            align: 'center',
            key: 'merchantArea'
          },
          {
            title: '详细地址',
            align: 'center',
            key: 'merchantAddr'
          },
          {
            title: '供应商认证',
            align: 'center',
            key: 'isSupplier',
            render (h, params) {
              return h('span', params.row.isSupplier ? '供应商' : '否')
            }
          },
          {
            title: '采购商认证',
            align: 'center',
            key: 'isPurchaser',
            render (h, params) {
              return h('span', params.row.isPurchaser ? '采购商' : '否')
            }
          },
          {
            title: '商家状态',
            align: 'center',
            key: 'merchantStatusChina'
          },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              const arr = [
                h(
                  'Button',
                  {
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
              if (params.row.merchantStatus === 2) {
                arr.push(
                  h(
                    'Button',
                    {
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
                    '审核'
                  )
                )
              } else if (params.row.merchantStatus === 3) {
                arr.push(
                  h(
                    'Button',
                    {
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
                    '更新认证'
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
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        goodsIId: '',
        Detail: '',
        Delete: {},
        Confirm: {},
        Audit: {
          isPass: '1'
        },
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalPass: false,
        statusList: [
          {
            value: 1,
            label: '未认证'
          },
          {
            value: 2,
            label: '申请中'
          },
          {
            value: 3,
            label: '已认证'
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
            merchantId: this.viewData.Delete.merchantId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },

    onAuditBtn () {
      axios
        .put(
          '/api/merchant/audit',
          qs.stringify({
            merchantId: this.viewData.Confirm.merchantId,
            isPass: this.viewData.Audit.isPass,
            isPurchaser: this.viewData.Audit.isPurchaser,
            isSupplier: this.viewData.Audit.isSupplier,
            reason: this.viewData.Audit.reason
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onUpdateBtn () {
      axios
        .put(
          '/api/merchant/update_authentication',
          qs.stringify({
            merchantId: this.viewData.Confirm.merchantId,
            isPurchaser: this.viewData.Audit.isPurchaser,
            isSupplier: this.viewData.Audit.isSupplier
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onModelCancel () {
      this.viewData.Img = []
      this.$refs.avatarInput.value = ''
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.merchantId = row.merchantId
      this.searchGoods()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.Audit = {
        isPass: '1'
      }
      this.viewData.modalPass = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.Audit = {
        isSupplier: item.isSupplier.toString(),
        isPurchaser: item.isPurchaser.toString()
      }
      this.viewData.modalRefuse = true
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    changeAuthentication (status) {
      axios
        .put(
          '/api/merchant/update_status',
          qs.stringify({
            merchantId: this.viewData.merchantId,
            isAuthentication: status ? 1 : 0
          })
        )
        .then(response => {
          this.viewData.merchantId = ''
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/api/merchant/get', {
          params: {
            page: this.searchList.searchCondition.page,
            merchantName: this.searchList.searchCondition.merchantName,
            merchantStatus: this.searchList.searchCondition.merchantStatus
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data.data
          this.searchList.pageData.total = response.data.data.total
        })
    },
    searchGoods () {
      axios
        .get('/api/merchant/detail', {
          params: {
            merchantId: this.viewData.merchantId
          }
        })
        .then(response => {
          this.viewData.Detail = response.data.data
          this.$previewRefresh()
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
