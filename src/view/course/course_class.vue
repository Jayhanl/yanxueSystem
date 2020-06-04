<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <!-- <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="20" type="ios-search" />
              </Button> -->
              <Button icon="md-add" @click="showAdd()">增加</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除
              <span style="color:red">{{viewData.Delete.cateName}}</span>
              分类吗？
              <p>(*将会把该分类下的所有课程将删除！)</p>
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加分类"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="分类名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.cateName"
                    type="text"
                    placeholder="分类"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.listOrder"
                    type="text"
                    placeholder="请输入正整数"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              clearable
              v-model="viewData.modalEdit"
              title="编辑分类"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="分类名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.cateName"
                    type="text"
                    placeholder="请输入分类名"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.listOrder"
                    type="text"
                    placeholder="请输入正整数"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="上下架:">
                  <RadioGroup v-model="viewData.Edit.cateStatus" size="large">
                    <Radio label="0">下架</Radio>
                    <Radio label="1">上架</Radio>
                  </RadioGroup>
                </Form-item>
              </Form>
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px;">
            <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
          </Form-item>
        </Form-item>
      </Form>
    </Col>
  </Row>
</template>
<script>
import service from '@/libs/api.request'
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
            title: '分类Id',
            align: 'center',
            key: 'cateId'
          },
          {
            title: '分类名',
            align: 'center',
            key: 'cateName'
          },
          {
            title: '排序序号',
            align: 'center',
            key: 'listOrder'
          },
          {
            title: '状态',
            align: 'center',
            key: 'cateStatus',
            render(h, params) {
              return h('span', params.row.cateStatus === 1 ? '上架中' : '已下架')
            }
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
          numberOfElements: 0,
          total: 0,
          totalPages: 0,
          size: 5,
          rankTime: ''
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {
          cateName: '',
          listOrder: ''
        },
        Edit: {
          cateName: '',
          listOrder: ''
        },
        ImgSrc: '',
        pList: [],
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        Delete: ''
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
    changeImage(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.viewData.ImgSrc = this.result
      }
    },
    onDeleteBtn() {
      axios
        .delete('/api/course_cate/delete', {
          data: {
            cateId: this.viewData.Delete.cateId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
          this.searchPid()
        })
    },
    onAddBtn() {
      if (this.viewData.Add.cateName === '') {
        this.$Message.error('请输入分类名')
        return
      }
      if (this.viewData.Add.listOrder === '') {
        this.$Message.error('请输入排序序号')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/api/course_cate/create',
          qs.stringify({
            cateName: this.viewData.Add.cateName,
            listOrder: this.viewData.Add.listOrder,
            pid: this.viewData.Add.pid || 0,
            imageSrc: this.viewData.ImgSrc
          })
        )
        .then(response => {
          this.viewData.ImgSrc = ''
          this.viewData.Add = {}
          this.searchManage()
          this.searchPid()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn() {
      if (this.viewData.Edit.cateName === '') {
        this.$Message.error('请输入分类名')
        return
      }
      if (this.viewData.Edit.listOrder === '') {
        this.$Message.error('请输入排序序号')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/api/course_cate/update',
          qs.stringify({
            cateId: this.viewData.Edit.cateId,
            cateName: this.viewData.Edit.cateName,
            listOrder: this.viewData.Edit.listOrder,
            cateStatus: this.viewData.Edit.cateStatus
          })
        )
        .then(response => {
          this.viewData.ImgSrc = ''
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
      this.viewData.ImgSrc = ''
      this.viewData.modalAdd = true
    },
    showEdit(item) {
      this.viewData.ImgSrc = item.imageSrc
      item.cateStatus = item.cateStatus.toString()
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
    searchManage() {
      console.log(this.searchList.searchCondition.pid)
      axios
        .get('/api/course_cate/get', {
          params: {
            pid: this.searchList.searchCondition.pid
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data
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
  padding: 10px 20px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
}

.ImgC {
  opacity: 0;
  width: 120px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
}

.imgMax {
  max-width: 300px;
}
</style>
