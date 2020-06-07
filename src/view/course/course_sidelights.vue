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
                v-model="searchList.searchCondition.courseName"
                clearable
                placeholder="课程名"
              ></Input>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
            </Form-item>
            <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
              确认删除课程id为：
              <span style="color:red">{{viewData.Delete.logId}}</span>
              的花絮吗？
            </Modal>

            <Modal title="查看课程花絮详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
              <div class="order_info">
                <h3>课程花絮信息</h3>
                <Row>
                  <Col span="10">课程Id: {{viewData.Detail.logId}}</Col>
                  <Col span="10">课程名: {{viewData.Detail.courseName}}</Col>
                </Row>
                <Row>
                  <Col span="10">花絮标题: {{viewData.Detail.courseTitle}}</Col>
                  <Col span="10">课程时间: {{viewData.Detail.courseDate}}</Col>
                </Row>
                <h4>花絮详情: {{viewData.Detail.courseSummary}}</h4>
                <h3>课程花絮图片</h3>
                <Row>
                  <Col span="18">
                    <img
                      v-for="(item, index) in viewData.Detail.courseGallery" :key="index"
                      :src="item"
                      class="img_item"
                      preview="index"
                      preview-text="课程花絮"
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

export default {
  data () {
    return {
      searchList: {
        carList: [],
        cateList: [],
        columns: [
          {
            title: '课程图',
            width: 140,
            key: 'courseGallery',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.courseGallery[0]
                  },
                  style: {
                    width: '100px',
                    height: '100px'
                  },
                  on: {
                    click: () => {
                      this.showImg(params.row.courseGallery[0])
                    }
                  }
                })
              ])
            }
          },
          {
            title: '课程Id',
            align: 'center',
            key: 'logId'
          },
          {
            title: '课程名',
            align: 'center',
            key: 'courseName'
          },
          {
            title: '花絮标题',
            align: 'center',
            key: 'courseTitle'
          },
          {
            title: '点赞数',
            align: 'center',
            key: 'likeCount'
          },
          {
            title: '评论数',
            align: 'center',
            key: 'commentCount'
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
                ),
                h(
                  'Button',
                  {
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
        ImgSrc: '',
        courseIId: '',
        Detail: {},
        Add: {},
        Edit: {},
        Delete: {},
        Confirm: '',
        modalAdd: false,
        modalEdit: false,
        modalDelete: false,
        modalDetail: false,
        statusList: [
          {
            value: 1,
            label: '上架中'
          },
          {
            value: 0,
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
    changeImage (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        that.viewData.ImgSrc = this.result
      }
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/api/course_sidelights/delete', {
          data: {
            logId: this.viewData.Delete.logId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
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
      this.viewData.logId = row.logId
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
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/api/course_sidelights/get', {
          params: {
            page: this.searchList.searchCondition.page,
            courseCate: this.searchList.searchCondition.courseCate,
            courseName: this.searchList.searchCondition.courseName
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data
          this.searchList.pageData.total = response.data.total
        })
    }
  },
  created () {
    axios.get('/api/course_cate/get').then(response => {
      this.searchList.cateList = response.data
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
.imgMax {
  max-width: 300px;
}
</style>
