<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Select
                clearable
                placeholder="课程分类"
                @on-change="searchManage"
                v-model="searchList.searchCondition.courseCate"
                class="search_item"
              >
                <Option
                  v-for="item in searchList.cateList"
                  :value="item.cateId"
                  :key="item.cateId"
                >{{ item.cateName }}</Option>
              </Select>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.courseName"
                clearable
                placeholder="课程名"
              ></Input>
              <Select
                clearable
                placeholder="课程状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.courseStatus"
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
              <Button icon="md-add" @click="showAdd()">增加课程</Button>
            </Form-item>
            <Modal
              title="查看开展课程详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>课程信息</h3>
                <Row>
                  <Col span="10">开展课程Id: {{viewData.Detail.logId}}</Col>
                  <Col span="10">审核状态: {{viewData.Detail.courseStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">课程Id: {{viewData.Detail.courseId}}</Col>
                  <Col span="10">课程名: {{viewData.Detail.courseName}}</Col>
                </Row>
                <Row>
                  <Col span="10">课程分类: {{viewData.Detail.cateName}}</Col>
                  <Col span="10">课程价格: {{viewData.Detail.coursePrice}}</Col>
                </Row>
                <Row>
                  <Col span="10">结束报名: {{viewData.Detail.applyEndTime}}</Col>
                  <Col span="10">开展时间: {{viewData.Detail.courseStartTime}}</Col>
                </Row>
                <Row>
                  <Col span="10">报名人数: {{viewData.Detail.enrollCount}}</Col>
                </Row>
                <h3>承办机构</h3>
                <Row>
                  <Col span="10">导师: {{viewData.Detail.tutorName}}</Col>
                  <Col span="10">机构: {{viewData.Detail.merchantName}}</Col>
                </Row>
                <h4>机构介绍: {{viewData.Detail.merchantDesc}}</h4>
                <Row>
                  <Col span="10">课程花絮: {{viewData.Detail.isUploadSidelights?'已上传':'未上传'}}</Col>
                  <Col span="10">基地: {{viewData.Detail.baseName}}</Col>
                </Row>
                <h4>基地介绍: {{viewData.Detail.baseDesc}}</h4>
              </div>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除课程id为：
              <span style="color:red">{{viewData.Delete.logId}}</span>
              的课程吗？
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加课程"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="40"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="100">
                <Form-item class="form_item" label="课程名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.courseName"
                    type="text"
                    placeholder="请输入"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.coursePrice"
                    type="text"
                    placeholder="请输入正数"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程简介:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.courseDesc"
                    type="textarea"
                    placeholder="请输入"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程分类:">
                  <Select
                    clearable
                    placeholder="课程分类"
                    @on-change="searchManage"
                    v-model="viewData.Add.courseCate"
                    class="search_item"
                  >
                    <Option
                      v-for="item in searchList.cateList"
                      :value="item.cateId"
                      :key="item.cateId"
                    >{{ item.cateName }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="是否热门:">
                  <RadioGroup v-model="viewData.Add.isHot" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item class="form_item" label="是否推荐:">
                  <RadioGroup v-model="viewData.Add.isRecommend" size="large">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </Form-item>
                <Form-item class="form_item" label="课程封面图：">
                  <Button class="choice_img">
                    <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                    <input
                      class="ImgC"
                      type="file"
                      name="avatar"
                      accept="image/gif, image/jpeg, image/jpg, image/png"
                      @change="changeImage($event)"
                      ref="avatarInput"
                    />
                  </Button>
                </Form-item>
                <Form-item label="预览图：">
                  <img class="imgMax" :src="viewData.ImgSrc" />
                </Form-item>
              </Form>
            </Modal>

            <Modal
              v-model="viewData.modalEdit"
              title="编辑课程"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="40"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="100">
                <Form-item class="form_item" label="课程名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.courseName"
                    type="text"
                    placeholder="请输入"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.coursePrice"
                    type="text"
                    placeholder="请输入正数"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程简介:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.courseDesc"
                    type="textarea"
                    placeholder="请输入"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="课程分类:">
                  <Select
                    clearable
                    placeholder="课程分类"
                    @on-change="searchManage"
                    v-model="viewData.Edit.courseCate"
                    class="search_item"
                  >
                    <Option
                      v-for="item in searchList.cateList"
                      :value="item.cateId"
                      :key="item.cateId"
                    >{{ item.cateName }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="课程封面图：">
                  <Button class="choice_img">
                    <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                    <input
                      class="ImgC"
                      type="file"
                      name="avatar"
                      accept="image/gif, image/jpeg, image/jpg, image/png"
                      @change="changeImage($event)"
                      ref="avatarInput"
                    />
                  </Button>
                </Form-item>
                <Form-item label="预览图：">
                  <img class="imgMax" :src="viewData.ImgSrc" />
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
      searchList: {
        carList: [],
        cateList: [],
        columns: [
          {
            title: '课程Id',
            align: 'center',
            key: 'logId'
          },
          {
            title: '课程标题',
            align: 'center',
            key: 'courseName'
          },
          {
            title: '课程分类',
            align: 'center',
            key: 'cateName'
          },
          {
            title: '课程价格',
            align: 'center',
            key: 'coursePrice',
            render: (h, params) => {
              return h('span', params.row.coursePrice + '元')
            }
          },
          {
            title: '课程状态',
            align: 'center',
            key: 'courseStatusChina'
          },
          {
            title: '导师',
            align: 'center',
            key: 'tutorName'
          },
          {
            title: '机构',
            align: 'center',
            key: 'merchantName'
          },
          {
            title: '基地',
            align: 'center',
            key: 'baseName'
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
              arr.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showEdit(params.row)
                      }
                    }
                  },
                  '编辑'
                )
              )

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
            value: 0,
            label: '待上架'
          },
          {
            value: 1,
            label: '报名中'
          },
          {
            value: 2,
            label: '开展中'
          },
          {
            value: 3,
            label: '已完成'
          },
          {
            value: -1,
            label: '已取消'
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
    changeImage(e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      let that = this
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.viewData.ImgSrc = this.result
      }
    },
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn() {
      axios
        .delete('/api/course_launch/delete', {
          data: {
            logId: this.viewData.Delete.logId
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    onChangeStatus(status, row, type) {
      axios
        .put(
          '/api/course_launch/update_status',
          qs.stringify({
            logId: row.logId,
            courseStatus: type === 0 ? status : row.courseStatus,
            isHot: type === 1 ? status : row.isHot,
            isRecommend: type === 2 ? status : row.isRecommend
          })
        )
        .then(() => {
          if (type === 0) row.courseStatus = status
          else if (type === 1) row.isHot = status
          else if (type === 2) row.isRecommend = status
          this.$Message.success('操作成功!')
          this.searchManage()
        })
        .catch(() => {
          this.searchManage()
        })
    },
    onAuditBtn(status) {
      axios
        .put(
          '/api/course_launch/audit',
          qs.stringify({
            logId: this.viewData.Confirm.logId,
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
      this.viewData.Img = []
      this.$refs.avatarInput.value = ''
      this.searchManage()
    },
    showDetail(row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.logId = row.logId
      this.searchcourse()
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
    showEdit(item) {
      this.viewData.ImgSrc = item.imageSrc
      this.viewData.Edit = item
      this.viewData.modalEdit = true
    },
    showAdd() {
      this.viewData.ImgSrc = ''
      this.$refs.avatarInput.value = ''
      this.viewData.modalAdd = true
    },
    onAddBtn() {
      if (this.viewData.ImgSrc === '') {
        this.$Message.error('请上传课程封面图')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/api/course_launch/create',
          qs.stringify({
            courseName: this.viewData.Add.courseName,
            coursePrice: this.viewData.Add.coursePrice,
            courseDesc: this.viewData.Add.courseDesc,
            courseCate: this.viewData.Add.courseCate,
            isHot: this.viewData.Add.isHot || 0,
            isRecommend: this.viewData.Add.isRecommend || 0,
            imageSrc: this.viewData.ImgSrc
          })
        )
        .then(response => {
          this.viewData.ImgSrc = ''
          this.$refs.avatarInput.value = ''
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn() {
      if (this.viewData.ImgSrc === '') {
        this.$Message.error('请上传课程封面图')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/api/course_launch/update',
          qs.stringify({
            courseName: this.viewData.Edit.courseName,
            coursePrice: this.viewData.Edit.coursePrice,
            courseDesc: this.viewData.Edit.courseDesc,
            courseCate: this.viewData.Edit.courseCate,
            logId: this.viewData.Edit.logId,
            imageSrc: this.viewData.ImgSrc || ''
          })
        )
        .then(response => {
          this.viewData.ImgSrc = ''
          this.$refs.avatarInput.value = ''
          this.viewData.Edit = {}
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
    },
    searchPageReturn() {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage() {
      axios
        .get('/api/course_launch/get', {
          params: {
            page: this.searchList.searchCondition.page,
            courseCate: this.searchList.searchCondition.courseCate,
            courseName: this.searchList.searchCondition.courseName,
            courseStatus: this.searchList.searchCondition.courseStatus
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data
          this.searchList.pageData.total = response.data.total
        })
    },
    searchcourse() {
      axios
        .get('/api/course_launch/detail', {
          params: {
            logId: this.viewData.logId
          }
        })
        .then(response => {
          this.viewData.Detail = response.data
          this.$previewRefresh()
        })
    }
  },
  created() {
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
