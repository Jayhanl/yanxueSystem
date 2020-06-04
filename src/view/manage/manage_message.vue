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
                v-model="searchList.searchCondition.msgTitle"
                clearable
                placeholder="信息标题"
              ></Input>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <Button icon="md-add" @click="showAdd()">增加</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color:red">{{viewData.Delete.msgId}}</span>
              的信息吗？
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加信息"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="信息标题:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.msgTitle"
                    type="text"
                    placeholder="请输入标题"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="信息正文:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.msgContent"
                    type="text"
                    placeholder="请输入信息正文"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              v-model="viewData.modalEdit"
              title="编辑信息"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="信息标题:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.msgTitle"
                    type="text"
                    placeholder="请输入正整数"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="信息正文:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.msgContent"
                    type="text"
                    placeholder="请输入信息正文"
                  ></Input>
                </Form-item>
              </Form>
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
            title: 'id',
            align: 'center',
            key: 'msgId',
            width: 120
          },
          {
            title: '信息标题',
            align: 'center',
            key: 'msgTitle'
          },
          {
            title: '信息内容',
            align: 'center',
            key: 'msgContent'
          },
          {
            title: '发送时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showEdit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showDelete(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        data: [],
        pageData: {
          content: [],
          pageNum: 1,
          total: 0
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {
          categoryName: '',
          listorder: ''
        },
        Edit: {
          categoryName: '',
          listorder: ''
        },
        Delete: {},
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        Confirm: ''
      }
    }
  },
  methods: {
    onDeleteBtn() {
      axios
        .delete('/api/message/delete', {
          data: {
            msgId: this.viewData.Delete.msgId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    onAddBtn() {
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/api/message/create',
          qs.stringify({
            msgContent: this.viewData.Add.msgContent,
            msgTitle: this.viewData.Add.msgTitle
          })
        )
        .then(response => {
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn() {
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/api/message/update',
          qs.stringify({
            msgId: this.viewData.Edit.msgId,
            msgContent: this.viewData.Edit.msgContent,
            msgTitle: this.viewData.Edit.msgTitle
          })
        )
        .then(response => {
          this.viewData.Edit = {}
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
        .catch(() => {
          this.searchManage()
        })
    },
    onModelCancel() {
      this.searchManage()
    },
    showAdd() {
      this.viewData.modalAdd = true
    },
    showEdit(item) {
      this.viewData.Edit = item
      this.viewData.modalEdit = true
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
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    searchManage() {
      axios
        .get(`/api/message/get`, {
          params: {
            page: this.searchList.searchCondition.page,
            msgTitle: this.searchList.searchCondition.msgTitle
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
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
