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
                placeholder="组织名"
              ></Input>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.legalPerson"
                clearable
                placeholder="法人名"
              ></Input>
              <Select
                clearable
                placeholder="状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.auditStatus"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select
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
              <input
                style="display:none"
                class="ImgC"
                type="file"
                merchantName="avatar"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="changeImage($event)"
                ref="avatarInput"
              />
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <!-- <Button icon="md-add" @click="showAdd()">增加组织</Button> -->
            </Form-item>
            <Modal
              :mask-closable="false"
              title="拒绝确认"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="onAuditBtn(0)"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认拒绝组织id：
                  <span style="color:red">{{viewData.Confirm.registerId}}</span>
                  的审核吗？
                </Form-item>
                <Form-item class="form_item" label="拒绝原因:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Confirm.reason"
                    type="text"
                    placeholder="请输入拒绝原因"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="通过确认"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onAuditBtn(1)"
            >
              确认通过组织id：
              <span style="color:red">{{viewData.Confirm.registerId}}</span>
              的审核吗？
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除组织id为：
              <span style="color:red">{{viewData.Delete.registerId}}</span>
              的组织吗？
            </Modal>
            <Modal
              title="查看组织信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>组织信息</h3>
                <Row>
                  <Col span="10">组织id: {{viewData.Detail.registerId}}</Col>
                  <Col span="10">审核状态: {{viewData.Detail.auditStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">组织名: {{viewData.Detail.merchantName}}</Col>
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
                <h4>组织简介: {{viewData.Detail.merchantDesc}}</h4>
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
            title: '组织Id',
            align: 'center',
            key: 'registerId'
          },
          {
            title: '组织名',
            align: 'center',
            key: 'merchantName'
          },
          {
            title: '法人名',
            align: 'center',
            key: 'legalPerson'
          },
          {
            title: '单位电话',
            align: 'center',
            key: 'merchantPhone'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'contactNumber'
          },
          {
            title: '地址',
            align: 'center',
            key: 'merchantAddr'
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'auditStatusChina'
          },
          {
            title: '审核时间',
            align: 'center',
            key: 'auditTime'
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
              if (params.row.auditStatus === 0) {
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
                    '通过'
                  ),
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
        modalPass: false,
        statusList: [
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 1,
            label: '已通过'
          },
          {
            value: -1,
            label: '不通过'
          }
        ],
        roleList: [
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
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn() {
      axios
        .delete('/api/merchant/delete', {
          data: {
            registerId: this.viewData.Delete.registerId
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    onAuditBtn(status) {
      axios
        .put(
          '/api/user/merchant_audit',
          qs.stringify({
            registerId: this.viewData.Confirm.registerId,
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
    onModelCancel() {
      this.searchManage()
    },
    showDetail(row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.registerId = row.registerId
      this.searchDetail()
    },
    showPass(item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showRefuse(item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    showDelete(item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    searchPageReturn() {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage() {
      axios
        .get('/api/user/merchant_list', {
          params: {
            page: this.searchList.searchCondition.page,
            merchantName: this.searchList.searchCondition.merchantName,
            role: this.searchList.searchCondition.role,
            auditStatus: this.searchList.searchCondition.auditStatus
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail() {
      axios
        .get('/api/user/merchant_detail', {
          params: {
            registerId: this.viewData.registerId
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
