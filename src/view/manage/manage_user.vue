<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.nickName" clearable
              placeholder="微信名"></Input>
            <Select clearable placeholder="性别" @on-change="searchManage" v-model="searchList.searchCondition.gender"
              class="search_item">
              <Option v-for="item in viewData.genderList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <Button icon="md-add" @click="showCollect()">增加</Button>
          </Form-item>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除id为：
            <span style="color:red">{{viewData.Delete.openid}}</span>
            的信息吗？
          </Modal>
          <Modal v-model="viewData.modalPay" title="意向购买" :mask-closable="false" width="55" @on-cancel="onModelCancel">
            <i-table border :columns="searchList.columns1" :data="searchList.pageData1.content"></i-table>
            <Page style="padding-top: 10px" :total="searchList.pageData1.total" :current="searchList.pageData1.pageNum"
              :page-size="8" @on-change="onPageChange1" size="small" show-total></Page>
          </Modal>
          <Modal v-model="viewData.modalCollect" title="收藏商品" :mask-closable="false" width="55"
            @on-cancel="onModelCancel">
            <i-table border :columns="searchList.columns1" :data="searchList.pageData1.content"></i-table>
            <Page style="padding-top: 10px" :total="searchList.pageData1.total" :current="searchList.pageData1.pageNum"
              :page-size="8" @on-change="onPageChange1" size="small" show-total></Page>
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
    data() {
      return {
        fileName: '',
        uploadFile: {},
        searchList: {
          Info: [],
          columns: [{
              title: "头像",
              width: 140,
              key: "avatarUrl",
              render: (h, params) => {
                return h("div", [
                  h("img", {
                    attrs: {
                      src: params.row.avatarUrl
                    },
                    style: {
                      width: "100px",
                      height: "100px"
                    },
                    on: {
                      click: () => {
                        this.showImg(params.row.avatarUrl);
                      }
                    }
                  })
                ]);
              }
            }, {
              title: 'openid',
              align: 'center',
              key: 'openid',
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
              key: 'genderChina'
            },
            {
              title: '手机号',
              align: 'center',
              key: 'mobile'
            },
            {
              title: '首次登陆时间',
              align: 'center',
              key: 'createTime'
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              align: 'center',
              render: (h, params) => {
                return h("div", [
                  h(
                    "Button", {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "15px"
                      },
                      on: {
                        click: () => {
                          this.showPay(params.row);
                        }
                      }
                    },
                    "意向购买"
                  ),
                  h(
                    "Button", {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      style: {
                        marginRight: "15px"
                      },
                      on: {
                        click: () => {
                          this.showCollect(params.row);
                        }
                      }
                    },
                    "收藏商品"
                  )
                ]);
              }
            }
          ],

          columns1: [{
              title: "商品图",
              width: 140,
              key: "imageSrc",
              render: (h, params) => {
                return h("div", [
                  h("img", {
                    attrs: {
                      src: params.row.imageSrc
                    },
                    style: {
                      width: "100px",
                      height: "100px"
                    },
                    on: {
                      click: () => {
                        this.showImg(params.row.imageSrc);
                      }
                    }
                  })
                ]);
              }
            }, {
              title: '商品id',
              align: 'center',
              key: 'goodsId',
              width: 120
            },
            {
              title: '商品标题',
              align: 'center',
              key: 'goodsDesc'
            },
            {
              title: '商品价格',
              align: 'center',
              key: 'goodsPrice',
              render: (h, parmas) => {
                return h('span', parmas.row.goodsPrice + '元')
              }
            },
            {
              title: '发货地',
              align: 'center',
              key: 'goodsFhdd'
            },
            {
              title: '发布者',
              align: 'center',
              key: 'nickName'
            }
          ],
          data: [],
          pageData: {
            content: [],
            total: 0,
            pageNum: 1,
          },
          searchCondition: {
            page: 1,
            limit: 10
          },
          pageData1: {
            content: [],
            total: 0,
            pageNum: 1,
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
          Confirm: '',
          Delete: {},
          genderList: [{
              value: 0,
              label: '未知'
            },
            {
              value: 1,
              label: '男'
            },
            {
              value: 2,
              label: '女'
            }
          ]
        }
      }
    },
    methods: {
      showImg(ad_picture_url) {
        this.$Modal.info({
          title: "预览图片",
          closable: true,
          content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
        });
      },
      onDeleteBtn() {
        axios
          .delete("/api/user/delete", {
            data: {
              openid: this.viewData.Delete.openid
            }
          })
          .then(response => {
            this.$Message.success("删除成功!");
            this.searchManage();
          });
      },
      onModelCancel() {
        this.searchManage()
      },
      showCollect(item) {
        this.searchList.pageData1.pageNum=1
        this.viewData.Confirm = item
        this.searchCollect()
        this.viewData.modalCollect = true;
      },
      showPay(item) {
        this.searchList.pageData1.pageNum=1
        this.viewData.Confirm = item
        this.searchPay()
        this.viewData.modalPay = true;
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
      onPageChange1(pageNum) {
        this.searchList.searchCondition1.page = pageNum
        this.searchPay()
      },
      onPageChangeCollect(pageNum) {
        this.searchList.searchCondition2.page = pageNum
        this.searchCollect()
      },
      searchManage() {
        axios
          .get(`/api/user/get`, {
            params: {
              page: this.searchList.searchCondition.page,
              nickName: this.searchList.searchCondition.nickName,
              gender: this.searchList.searchCondition.gender,
            }
          })
          .then(response => {
            this.searchList.pageData.content = response.data.data.data
            this.searchList.pageData.total = response.data.data.total;
          })
      },
      searchPay() {
        axios
          .get(`/api/user/to_buy_list`, {
            params: {
              page: this.searchList.searchCondition1.page,
              limit: this.searchList.searchCondition1.limit,
              openid: this.viewData.Confirm.openid,
            }
          })
          .then(response => {
            this.searchList.pageData1.content = response.data.data.data
            this.searchList.pageData1.total = response.data.data.total;
          })
      },
      searchCollect() {
        axios
          .get(`/api/user/collect_list`, {
            params: {
              page: this.searchList.searchCondition1.page,
              limit: this.searchList.searchCondition1.limit,
              openid: this.viewData.Confirm.openid,
            }
          })
          .then(response => {
            this.searchList.pageData1.content = response.data.data.data
            this.searchList.pageData1.total = response.data.data.total
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
