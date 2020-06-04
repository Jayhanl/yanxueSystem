<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Select clearable placeholder="信息分类" @on-change="searchManage"
              v-model="searchList.searchCondition.categoryId" class="search_item">
              <Option v-for="item in searchList.categoryList" :value="item.cid" :key="item.cid">{{ item.categoryName }}
              </Option>
            </Select>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.goodsDesc" clearable
              placeholder="信息标题"></Input>
            <Select clearable placeholder="信息状态" @on-change="searchManage"
              v-model="searchList.searchCondition.goodsStatus" class="search_item">
              <Option v-for="item in viewData.statusList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
            <input style="display:none" class="ImgC" type="file" name="avatar"
              accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)" ref="avatarInput" />
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <!-- <Button icon="md-add" @click="showAdd()">增加信息</Button> -->
          </Form-item>
          <Modal :mask-closable="false" title="拒绝确认" width="400" v-model="viewData.modalRefuse" @on-ok="onAuditBtn(0)">
            <Form :label-width="80">
              <Form-item class="form_item">
                确认拒绝信息id：
                <span style="color:red">{{viewData.Confirm.goodsId}}</span>
                的审核吗？
              </Form-item>
              <Form-item class="form_item" label="拒绝原因:">
                <Input style="width: 200px" v-model="viewData.Confirm.reason" type="text" placeholder="请输入拒绝原因"></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal :mask-closable="false" title="通过确认" width="400" v-model="viewData.modalPass" @on-ok="onAuditBtn(1)">
            确认通过信息id：
            <span style="color:red">{{viewData.Confirm.goodsId}}</span>
            的审核吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除信息id为：
            <span style="color:red">{{viewData.Delete.goodsId}}</span>
            的信息吗？
          </Modal>
          <Modal title="查看供应详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
            <div class="order_info">
              <h3>供应信息</h3>
              <Row>
                <Col span="10">信息id: {{viewData.Detail.goodsId}}</Col>
                <Col span="10">状态: {{viewData.Detail.goodsStatusChina}}</Col>
              </Row>
              <h4>供应标题: {{viewData.Detail.goodsDesc}}</h4>
              <Row>
                <Col span="10">价格:￥{{viewData.Detail.goodsPrice}}</Col>
                <Col span="10">类型: {{viewData.Detail.categoryName}}</Col>
              </Row>
              <Row>
                <Col span="10">执行标准:{{viewData.Detail.goodsStandard}}</Col>
                <Col span="10">日产能: {{viewData.Detail.dailyOutput}}</Col>
              </Row>
              <Row>
                <Col span="10">箱规:{{viewData.Detail.goodsSize}}</Col>
                <Col span="10">箱重: {{viewData.Detail.goodsWeight}}</Col>
              </Row>
              <Row>
                <Col span="10">包装规格:{{viewData.Detail.goodsBzgg}}</Col>
                <Col span="10">净重: {{viewData.Detail.goodsSuttle}}</Col>
              </Row>
              <Row>
                <Col span="10">产地: {{viewData.Detail.goodsOrigin}}</Col>
                <Col span="10">发货地: {{viewData.Detail.goodsFhdd}}</Col>
              </Row>
              <Row>
                <Col span="10">发布人: {{viewData.Detail.nickName}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.contactNumber}}</Col>
              </Row>
              <Row>
                <Col span="10">微信号: {{viewData.Detail.contactWechat}}</Col>
                <Col span="10">发布时间: {{viewData.Detail.createTime}}</Col>
              </Row>
              <!-- <h4>发布时间: {{viewData.Detail.createTime}}</h4> -->
              <!-- 信息信息 -->
              <h3>信息图</h3>
              <Row>
                <Col span="4">信息封面图:</Col>
                <Col span="18">
                <img :src="viewData.Detail.imageSrc" class="img_item" preview="0" preview-text="信息封面图" />
                </Col>
              </Row>
              <Row>
                <Col span="4">信息图:</Col>
                <Col span="18">
                <img v-for="(item,index) in viewData.Detail.goodsGallery" :key="index" :src="item" class="img_item"
                  preview="1" preview-text="信息图" />
                </Col>
              </Row>
              <Row>
                <Col span="4">营业执照:</Col>
                <Col span="4">
                <img :src="viewData.Detail.businessLicense" class="img_item" preview="2" preview-text="营业执照" />
                </Col>
                <Col span="4">医疗器械注册证:</Col>
                <Col span="4">
                <img :src="viewData.Detail.ylqxLicense" class="img_item" preview="3" preview-text="医疗器械注册证" />
                </Col>
              </Row>
              <Row>
                <Col span="4">CE证书:</Col>
                <Col span="4">
                <img :src="viewData.Detail.ceLicense" class="img_item" preview="4" preview-text="CE证书" />
                </Col>
                <Col span="4">FDA证书:</Col>
                <Col span="4">
                <img :src="viewData.Detail.fdaLicense" class="img_item" preview="5" preview-text="FDA证书" />
                </Col>
              </Row>
              <Row>
                <Col span="4">检测报告:</Col>
                <Col span="18">
                <img v-for="(item,index) in viewData.Detail.examiningReport" :key="index" :src="item" class="img_item"
                  preview="6" preview-text="信息图" />
                </Col>
              </Row>

              <!-- 用户信息 -->
              <h3>信息认证</h3>是否通过认证：
              <Switch :value="viewData.Detail.isAuthentication===1" @on-change="changeAuthentication" size="large">
                <span slot="open">通过</span>
                <span slot="close">暂不</span>
              </Switch>
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
          title: '信息图',
          width: 140,
          key: 'imageSrc',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imageSrc
                },
                style: {
                  width: '100px',
                  height: '100px'
                },
                on: {
                  click: () => {
                    this.showImg(params.row.imageSrc)
                  }
                }
              })
            ])
          }
        },
        {
          title: '信息Id',
          align: 'center',
          key: 'goodsId'
        },
        {
          title: '发布者',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '信息标题',
          align: 'center',
          key: 'goodsDesc'
        },
        {
          title: '信息分类',
          align: 'center',
          key: 'categoryName'
        },
        {
          title: '信息价格',
          align: 'center',
          key: 'goodsPrice',
          render: (h, params) => {
            return h('span', params.row.goodsPrice + '元')
          }
        },
        {
          title: '发货地址',
          align: 'center',
          key: 'goodsFhdd'
        },
        {
          title: '信息状态',
          align: 'center',
          key: 'goodsStatusChina'
        },
        {
          title: '是否上架',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.goodsStatus,
                'false-value': -1,
                'true-value': 1,
                size: 'large'
              },
              slot: {},
              on: {
                'on-change': e => {
                  axios
                    .put(
                      '/api/goods/update_status',
                      qs.stringify({
                        goodsId: params.row.goodsId,
                        goodsStatus: e
                      })
                    )
                    .then(() => {
                      this.$Message.success('操作成功!')
                    })
                    .catch(() => {
                      this.searchManage()
                    })
                }
              }
            })
          }
        },
        {
          title: '是否认证',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.isAuthentication === 1,
                size: 'large'
              },
              slot: {},
              on: {
                'on-change': e => {
                  params.row.isAuthentication = e ? 1 : 0
                  axios
                    .put(
                      '/api/goods/update_authentication',
                      qs.stringify({
                        goodsId: params.row.goodsId,
                        isAuthentication: e ? 1 : 0
                      })
                    )
                    .then(() => {
                      this.$Message.success('操作成功!')
                    })
                    .catch(() => {
                      this.searchManage()
                    })
                }
              }
            })
          }
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
              ),
              h(
                'Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showDelete(params.row)
                    }
                  }
                },
                '删除'
              )
            ]
            if (params.row.goodsStatus === 0) {
              arr.push(
                h(
                  'Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showPass(params.row)
                      }
                    }
                  },
                  '通过'
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
                  '拒绝'
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
        Confirm: '',
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalPass: false,
        statusList: [{
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '上架中'
        },
        {
          value: -1,
          label: '已下架'
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
        .delete('/api/goods/delete', {
          data: {
            goodsId: this.viewData.Delete.goodsId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },

    onAuditBtn (status) {
      axios
        .put(
          '/api/goods/audit',
          qs.stringify({
            goodsId: this.viewData.Confirm.goodsId,
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
    onModelCancel () {
      this.viewData.Img = []
      this.$refs.avatarInput.value = ''
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.goodsId = row.goodsId
      this.searchGoods()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    changeAuthentication (status) {
      axios
        .put(
          '/api/goods/update_authentication',
          qs.stringify({
            goodsId: this.viewData.goodsId,
            isAuthentication: status ? 1 : 0
          })
        )
        .then(response => {
          this.viewData.goodsId = ''
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
        .get('/api/goods/get', {
          params: {
            page: this.searchList.searchCondition.page,
            categoryId: this.searchList.searchCondition.categoryId,
            goodsDesc: this.searchList.searchCondition.goodsDesc,
            goodsStatus: this.searchList.searchCondition.goodsStatus
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data.data
          this.searchList.pageData.total = response.data.data.total
        })
    },
    searchGoods () {
      axios
        .get('/api/goods/detail', {
          params: {
            goodsId: this.viewData.goodsId
          }
        })
        .then(response => {
          this.viewData.Detail = response.data.data
          this.$previewRefresh()
        })
    }
  },
  created () {
    axios.get('/api/goods_category/get').then(response => {
      this.searchList.categoryList = response.data.data
    })
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
