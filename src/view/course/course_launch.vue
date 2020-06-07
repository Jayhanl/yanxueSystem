<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Select clearable placeholder="课程分类" @on-change="searchManage"
              v-model="searchList.searchCondition.courseCate" class="search_item">
              <Option v-for="item in searchList.cateList" :value="item.cateId" :key="item.cateId">{{ item.cateName }}
              </Option>
            </Select>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.courseName" clearable
              placeholder="课程名"></Input>
            <Select clearable placeholder="课程状态" @on-change="searchManage"
              v-model="searchList.searchCondition.courseStatus" class="search_item">
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
            <Button icon="md-add" @click="showAdd()">增加课程</Button>
          </Form-item>
          <Modal title="查看开展课程详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
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
          <Modal :mask-closable="false" width="400" v-model="viewData.modalStart" @on-ok="onStartBtn">
            确认开始课程id为：
            <span style="color:red">{{viewData.Confirm.logId}}</span>
            的报名吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalEnd" @on-ok="onEndBtn">
            确认结束课程id为：
            <span style="color:red">{{viewData.Confirm.logId}}</span>
            的报名吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalConfirm" @on-ok="onConfirmBtn">
            确认完成课程id为：
            <span style="color:red">{{viewData.Confirm.logId}}</span>
            的课程吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalCancel" @on-ok="onCancelBtn">
            确认取消课程id为：
            <span style="color:red">{{viewData.Confirm.logId}}</span>
            的课程吗？
          </Modal>
          <Modal v-model="viewData.modalCourse" title="课程模板" :mask-closable="false" width="55"
            @on-cancel="onModelCancel">
            <i-table border :columns="searchList.columns1" :data="searchList.pageData1.content"></i-table>
            <Page style="padding-top: 10px" :total="searchList.pageData1.total" :current="searchList.pageData1.pageNum"
              :page-size="8" @on-change="onPageChange1" size="small" show-total></Page>
          </Modal>
          <Modal v-model="viewData.modalAdd" title="添加课程" :mask-closable="false" @on-ok="onAddBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="选择模板:">
                <Button type="primary" @click="showCourse(0)">点击选择</Button>
              </Form-item>
              <Form-item class="form_item" label="课程名:">
                <Input style="width: 200px" v-model="viewData.Add.courseName" type="text" placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程价格:">
                <Input style="width: 200px" v-model="viewData.Add.coursePrice" type="text" placeholder="请输入正数"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程简介:">
                <Input style="width: 200px" v-model="viewData.Add.courseDesc" :maxlength="300" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程分类:">
                <Select clearable placeholder="课程分类" @on-change="searchManage" v-model="viewData.Add.courseCate"
                  class="search_item">
                  <Option v-for="item in searchList.cateList" :value="item.cateId" :key="item.cateId">
                    {{ item.cateName }}</Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="课程地址:">
                <Input style="width: 200px" v-model="viewData.Add.courseAddr" :maxlength="100" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="开始时间:">
                <DatePicker type="datetime" confirm v-model="viewData.Add.courseStartTime"
                  @on-change="date=>viewData.Add.courseStartTime=date" placeholder="请选择" style="width: 200px">
                </DatePicker>
              </Form-item>
              <Form-item class="form_item" label="报名截止时间:">
                <DatePicker type="datetime" confirm v-model="viewData.Add.applyEndTime"
                  @on-change="date=>viewData.Add.applyEndTime=date" placeholder="请选择" style="width: 200px">
                </DatePicker>
              </Form-item>
              <Form-item label="原课程图：">
                <img class="imgMax" :src="viewData.Add.imageSrc" />
              </Form-item>
              <Form-item class="form_item" label="修改封面图：">
                <Button class="choice_img">
                  <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                  <input class="ImgC" type="file" name="avatar" accept="image/gif, image/jpeg, image/jpg, image/png"
                    @change="changeImage($event)" ref="avatarInput" />
                </Button>
              </Form-item>
              <Form-item label="预览图：">
                <img class="imgMax" :src="viewData.ImgSrc" />
              </Form-item>
            </Form>
          </Modal>
          <Modal v-model="viewData.modalEdit" title="编辑课程" :mask-closable="false" @on-ok="onEditBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="课程名:">
                <Input style="width: 200px" v-model="viewData.Edit.courseName" type="text" placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程价格:">
                <Input style="width: 200px" v-model="viewData.Edit.coursePrice" type="text" placeholder="请输入正数"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程简介:">
                <Input style="width: 200px" v-model="viewData.Edit.courseDesc" :maxlength="300" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="课程分类:">
                <Select clearable placeholder="课程分类" @on-change="searchManage" v-model="viewData.Edit.courseCate"
                  class="search_item">
                  <Option v-for="item in searchList.cateList" :value="item.cateId" :key="item.cateId">
                    {{ item.cateName }}</Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="课程地址:">
                <Input style="width: 200px" v-model="viewData.Edit.courseAddr" :maxlength="100" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="开始时间:">
                <DatePicker type="datetime" confirm v-model="viewData.Edit.courseStartTime"
                  @on-change="date=>viewData.Edit.courseStartTime=date" placeholder="请选择" style="width: 200px">
                </DatePicker>
              </Form-item>
              <Form-item class="form_item" label="报名截止时间:">
                <DatePicker type="datetime" confirm v-model="viewData.Edit.applyEndTime"
                  @on-change="date=>viewData.Edit.applyEndTime=date" placeholder="请选择" style="width: 200px">
                </DatePicker>
              </Form-item>
              <Form-item class="form_item" label="修改封面图：">
                <Button class="choice_img">
                  <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                  <input class="ImgC" type="file" name="avatar" accept="image/gif, image/jpeg, image/jpg, image/png"
                    @change="changeImage($event)" ref="avatarInput" />
                </Button>
              </Form-item>
              <Form-item label="预览图：">
                <img class="imgMax" :src="viewData.ImgSrc" />
              </Form-item>
            </Form>
          </Modal>
          <!-- 绑定 -->

          <Modal v-model="viewData.modalBind" title="绑定组织" :mask-closable="false" @on-ok="onBindBtn" width="40">
            <Form :label-width="100">
              <Form-item class="form_item" label="绑定导师:">
                <span>{{viewData.bind.tutor}}</span>
                <Button type="primary" style="margin-left: 20px;" @click="showBindT">点击选择导师</Button>
              </Form-item>
              <Form-item class="form_item" label="绑定机构:">
                <span>{{viewData.bind.organization}}</span>
                <Button type="primary" style="margin-left: 20px;" @click="showBindM(4)">点击选择机构</Button>
              </Form-item>
              <Form-item class="form_item" label="绑定基地:">
                <span>{{viewData.bind.base}}</span>
                <Button type="primary" style="margin-left: 20px;" @click="showBindM(5)">点击选择基地</Button>
              </Form-item>
            </Form>
          </Modal>

          <Modal v-model="viewData.modalBindT" title="请选择绑定组织" :mask-closable="false" width="55">
            <Input class="search_item" type="text" v-model="searchList.searchCondition2.name" clearable
              placeholder="姓名"></Input>
            <Button style="margin-right:10px" @click="searchPageReturn2">
              <Icon size="18" type="ios-search" />
            </Button>
            <i-table border :columns="searchList.columns2" :data="searchList.pageData2.content"></i-table>
            <Page style="padding-top: 10px" :total="searchList.pageData2.total" :current="searchList.pageData2.pageNum"
              :page-size="8" @on-change="onPageChange2" size="small" show-total></Page>
          </Modal>

          <Modal v-model="viewData.modalBindM" title="请选择绑定组织" :mask-closable="false" width="55">
            <Input class="search_item" type="text" v-model="searchList.searchCondition3.merchantName" clearable
              placeholder="组织名"></Input>
            <Button style="margin-right:10px" @click="searchPageReturn3">
              <Icon size="18" type="ios-search" />
            </Button>
            <i-table border :columns="searchList.columns3" :data="searchList.pageData3.content"></i-table>
            <Page style="padding-top: 10px" :total="searchList.pageData3.total" :current="searchList.pageData3.pageNum"
              :page-size="8" @on-change="onPageChange3" size="small" show-total></Page>
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
      searchList: {
        carList: [],
        cateList: [],
        columns: [{
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
          width: 220,
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
            if (params.row.courseStatus === 0 || params.row.courseStatus === 1) {
              arr.push(
                h(
                  'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showCancel(params.row)
                      }
                    }
                  },
                  '取消'
                )
              )
            }
            if (params.row.courseStatus === 0) {
              arr.push(
                h(
                  'Button', {
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
                  'Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showBind(params.row)
                      }
                    }
                  },
                  '绑定组织'
                ),
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
                        this.showStart(params.row)
                      }
                    }
                  },
                  '开始报名'
                )
              )
            } else if (params.row.courseStatus === 1) {
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
                        this.showEnd(params.row)
                      }
                    }
                  },
                  '结束报名'
                )
              )
            } else if (params.row.courseStatus === 2) {
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
                        this.showConfirm(params.row)
                      }
                    }
                  },
                  '完成'
                )
              )
            }
            return h('div', arr)
          }
        }
        ],
        columns1: [{
          title: '课程图',
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
          title: '课程Id',
          align: 'center',
          key: 'courseId'
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
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            const arr = [
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
                      this.onCourse(params.row)
                    }
                  }
                },
                '选择'
              )
            ]
            return h('div', arr)
          }
        }
        ],
        columns2: [{
          title: '用户Id',
          align: 'center',
          key: 'registerId'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name'
        },
        {
          title: '性别',
          align: 'center',
          key: 'gender'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'contactNumber'
        },
        {
          title: '身份证',
          align: 'center',
          key: 'identityCard'
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
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.viewData.modalBindT = false
                      this.viewData.bind.tutor = params.row.name
                      this.viewData.bind.tutorId = params.row.openId
                    }
                  }
                },
                '选择'
              )
            ]
            return h('div', arr)
          }
        }
        ],
        columns3: [{
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
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            const arr = [
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
                      this.viewData.modalBindM = false
                      if (this.viewData.role === 4) {
                        this.viewData.bind.organization = params.row.merchantName
                        this.viewData.bind.organizationId = params.row.openId
                      }
                      if (this.viewData.role === 5) {
                        this.viewData.bind.base = params.row.merchantName
                        this.viewData.bind.baseId = params.row.openId
                      }
                    }
                  }
                },
                '选择'
              )
            ]
            return h('div', arr)
          }
        }
        ],

        data: [],
        pageData: {
          content: [],
          pageNum: 1
        },
        searchCondition: {},
        pageData1: {
          content: [],
          pageNum: 1
        },
        searchCondition1: {},
        pageData2: {
          content: [],
          pageNum: 1
        },
        searchCondition2: {},
        pageData3: {
          content: [],
          pageNum: 1
        },
        searchCondition3: {},
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        logId: '',
        isEdit: 0,
        role: '',
        ImgSrc: '',
        courseIId: '',
        Detail: {},
        Add: {},
        Edit: {},
        Delete: {},
        Confirm: {},
        bind: {},
        modalAdd: false,
        modalEdit: false,
        modalDelete: false,
        modalDetail: false,
        modalCourse: false,
        modalBind: false,
        modalBindT: false,
        modalBindM: false,
        modalStart: false,
        modalEnd: false,
        modalConfirm: false,
        modalCancel: false,
        statusList: [{
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
    dateTime (a, b) {
      console.log(a)
      console.log(b)
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onPageChange1 (pageNum) {
      this.searchList.searchCondition1.page = pageNum
      this.searchMuban()
    },
    onPageChange2 (pageNum) {
      this.searchList.searchCondition2.page = pageNum
      this.searchBindT()
    },
    onPageChange3 (pageNum) {
      this.searchList.searchCondition3.page = pageNum
      this.searchBindM()
    },
    onChangeStatus (status, row, type) {
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
    onStartBtn (status) {
      axios
        .put(
          '/api/course_launch/start_enroll',
          qs.stringify({
            logId: this.viewData.Confirm.logId
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onEndBtn (status) {
      axios
        .put(
          '/api/course_launch/end_enroll',
          qs.stringify({
            logId: this.viewData.Confirm.logId
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onConfirmBtn (status) {
      axios
        .put(
          '/api/course_launch/done',
          qs.stringify({
            logId: this.viewData.Confirm.logId
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
          '/api/course_launch/cancel',
          qs.stringify({
            logId: this.viewData.Confirm.logId
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
      this.viewData.logId = row.logId
      this.searchcourse()
    },
    showCourse () {
      this.searchMuban()
      this.viewData.modalCourse = true
    },
    showStart (row) {
      this.viewData.Confirm = row
      this.viewData.modalStart = true
    },
    showEnd (row) {
      this.viewData.Confirm = row
      this.viewData.modalEnd = true
    },
    showConfirm (row) {
      this.viewData.Confirm = row
      this.viewData.modalConfirm = true
    },
    showCancel (row) {
      this.viewData.Confirm = row
      this.viewData.modalCancel = true
    },
    onBindM () {

    },
    showBind (row) {
      this.viewData.bind.logId = row.logId
      this.viewData.modalBind = true
    },
    showBindT () {
      this.searchBindT()
      this.viewData.modalBindT = true
    },
    showBindM (status) {
      console.log(status)
      this.viewData.role = status
      this.searchBindM()
      this.viewData.modalBindM = true
    },
    onCourse (row) {
      this.viewData.Add = row
      this.viewData.modalCourse = false
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    showEdit (item) {
      this.viewData.ImgSrc = item.imageSrc
      this.viewData.Edit = item
      this.viewData.modalEdit = true
    },
    showAdd () {
      this.viewData.ImgSrc = ''
      this.$refs.avatarInput.value = ''
      this.viewData.modalAdd = true
    },
    onAddBtn () {
      console.log(this.viewData.Add)
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/api/course_launch/create',
          qs.stringify({
            courseId: this.viewData.Add.courseId,
            courseName: this.viewData.Add.courseName,
            coursePrice: this.viewData.Add.coursePrice,
            courseDesc: this.viewData.Add.courseDesc,
            courseCate: this.viewData.Add.courseCate,
            courseAddr: this.viewData.Add.courseAddr,
            courseStartTime: this.viewData.Add.courseStartTime,
            applyEndTime: this.viewData.Add.applyEndTime,
            isNewImage: this.viewData.ImgSrc ? 1 : 0,
            imageSrc: this.viewData.ImgSrc || ''
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
    onEditBtn () {
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/api/course_launch/update',
          qs.stringify({
            courseName: this.viewData.Edit.courseName,
            coursePrice: this.viewData.Edit.coursePrice,
            courseDesc: this.viewData.Edit.courseDesc,
            courseCate: this.viewData.Edit.courseCate,
            courseAddr: this.viewData.Edit.courseAddr,
            courseStartTime: this.viewData.Edit.courseStartTime,
            applyEndTime: this.viewData.Edit.applyEndTime,
            logId: this.viewData.Edit.logId,
            imageSrc: this.viewData.ImgSrc.substring(0, 5) === 'https'
              ? '' : this.viewData.ImgSrc
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
    onBindBtn () {
      axios
        .put(
          '/api/course_launch/bind_organization',
          qs.stringify({
            logId: this.viewData.bind.logId,
            tutor: this.viewData.bind.tutorId,
            organization: this.viewData.bind.organizationId,
            base: this.viewData.bind.baseId
          })
        )
        .then(response => {
          this.viewData.bind = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchPageReturn2 () {
      this.searchList.searchCondition2.page = 1
      this.searchBindT()
      this.$Message.success('搜索完成!')
    },
    searchPageReturn3 () {
      this.searchList.searchCondition3.page = 1
      this.searchBindM()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
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
    searchcourse () {
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
    },
    searchMuban () {
      axios
        .get('/api/course/get', {
          params: {
            page: this.searchList.searchCondition1.page,
            courseCate: this.searchList.searchCondition1.courseCate,
            courseName: this.searchList.searchCondition1.courseName
          }
        })
        .then(response => {
          this.searchList.pageData1.content = response.data.data
          this.searchList.pageData1.total = response.data.total
        })
    },
    searchBindT () {
      axios
        .get('/api/user/personal_list', {
          params: {
            page: this.searchList.searchCondition2.page,
            name: this.searchList.searchCondition2.name,
            role: 3,
            auditStatus: 1
          }
        })
        .then(res => {
          this.searchList.pageData2.content = res.data.data
          this.searchList.pageData2.total = res.data.total
        })
    },
    searchBindM () {
      axios
        .get('/api/user/merchant_list', {
          params: {
            page: this.searchList.searchCondition3.page,
            merchantName: this.searchList.searchCondition3.merchantName,
            role: this.viewData.role,
            auditStatus: 1
          }
        })
        .then(res => {
          this.searchList.pageData3.content = res.data.data
          this.searchList.pageData3.total = res.data.total
        })
    }
  },
  created () {
    console.log(1)
    this.searchManage()
    console.log(1)
    axios.get('/api/course_cate/get').then(response => {
      this.searchList.cateList = response.data
    })
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
