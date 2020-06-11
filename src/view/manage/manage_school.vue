<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Select clearable class="search_item" v-model="searchList.searchCondition.province" placeholder="请选择省份"
              @on-change="changeProvince">
              <Option v-for="item in provinceArr" :key="item.value" :value="item.label">{{ item.label }}
              </Option>
            </Select>
            <Select clearable class="search_item" v-model="searchList.searchCondition.city" placeholder="请选择城市"
              @on-change="changeCity">
              <Option v-for="item in citiesArr" :key="item.value" :value="item.label">{{ item.label }}
              </Option>
            </Select>
            <Select clearable class="search_item" v-model="searchList.searchCondition.county" placeholder="请选择区县">
              <Option v-for="item in countyArr" :key="item.value" :value="item.label">{{ item.label }}
              </Option>
            </Select>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.schoolName" clearable
              placeholder="学校名"></Input>
            <input style="display:none" class="ImgC" type="file" name="avatar"
              accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)" ref="avatarInput" />
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <Button icon="md-add" @click="showAdd()">增加学校</Button>
          </Form-item>
          <Modal title="查看学校班级详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
            <i-table border :columns="searchList.columns1" :data="searchList.pageData1.content"></i-table>
          </Modal>
          <Modal :title="viewData.Confirm.name+'添加班级名称'" :mask-closable="false" width="400" v-model="viewData.modalStart" @on-ok="onStartBtn">
            <Input class="search_item" type="text" v-model="viewData.Confirm.name1" clearable
              placeholder="班级名"></Input>
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalEnd" @on-ok="onEndBtn">
            确认删除班级id为：
            <span style="color:red">{{viewData.Confirm.gradeId}}</span>
            吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalCancel" @on-ok="onCancelBtn">
            确认删除学校id为：
            <span style="color:red">{{viewData.Confirm.schoolId}}</span>
            的学校吗？
          </Modal>
          <Modal v-model="viewData.modalAdd" title="添加学校" :mask-closable="false" @on-ok="onAddBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="省份:">
                <Select clearable class="search_item" v-model="viewData.Add.province" placeholder="请选择省份"
                  @on-change="changeProvince">
                  <Option v-for="item in provinceArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="城市:">
                <Select clearable class="search_item" v-model="viewData.Add.city" placeholder="请选择城市"
                  @on-change="changeCity">
                  <Option v-for="item in citiesArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select></Form-item>
              <Form-item class="form_item" label="县区:">
                <Select clearable class="search_item" v-model="viewData.Add.county" placeholder="请选择区县">
                  <Option v-for="item in countyArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="学校名称:">
                <Input style="width: 200px" v-model="viewData.Add.schoolName" :maxlength="30" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal v-model="viewData.modalEdit" title="编辑学校" :mask-closable="false" @on-ok="onEditBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="省份:">
                <Select clearable class="search_item" v-model="viewData.Edit.province" placeholder="请选择省份"
                  @on-change="changeProvince">
                  <Option v-for="item in provinceArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="城市:">
                <Select clearable class="search_item" v-model="viewData.Edit.city" placeholder="请选择城市"
                  @on-change="changeCity">
                  <Option v-for="item in citiesArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select></Form-item>
              <Form-item class="form_item" label="县区:">
                <Select clearable class="search_item" v-model="viewData.Edit.county" placeholder="请选择区县">
                  <Option v-for="item in countyArr" :key="item.value" :value="item.label">{{ item.label }}
                  </Option>
                </Select>
              </Form-item>
              <Form-item class="form_item" label="学校名称:">
                <Input style="width: 200px" v-model="viewData.Edit.schoolName" :maxlength="30" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
            </Form>
          </Modal>
          <!-- 绑定 -->

          <Modal v-model="viewData.modalBind" title="添加年级" :mask-closable="false" @on-ok="onBindBtn" width="40">
            <Form :label-width="100">
              <FormItem v-for="(item, index) in formDynamic.items" :key="index"
                :label="'年级 ' + item.index">
                <Row :gutter="16">
                  <Col span="8">
                  <Input type="text" v-model="item.name" placeholder="输入年级名称"></Input>
                  </Col>
                  <Col span="8">
                  <Input type="text" v-model="item.classNum" placeholder="输入需要自动生成的班级数量"></Input>
                  </Col>
                  <Col span="4" offset="1">
                  <Button @click="handleRemove(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row>
                  <Col span="12">
                  <Button type="dashed" long @click="handleAdd" icon="md-add">添加新年级</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
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
import city from './city'

export default {
  data () {
    return {
      provinceArr: city,
      citiesArr: [],
      countyArr: [],
      index: 1,
      formDynamic: {
        items: [{
          name: '',
          classNum: '',
          index: 1
        }]
      },
      searchList: {
        carList: [],
        cateList: [],
        columns: [{
          title: '学校Id',
          align: 'center',
          key: 'schoolId'
        },
        {
          title: '学校名称',
          align: 'center',
          key: 'schoolName'
        },
        {
          title: '省份',
          align: 'center',
          key: 'province'
        },
        {
          title: '城市',
          align: 'center',
          key: 'city'
        },
        {
          title: '县区',
          align: 'center',
          key: 'county'
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
                      this.showEdit(params.row)
                    }
                  }
                },
                '编辑'
              ),
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
                '删除'
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
                      this.showBind(params.row)
                    }
                  }
                },
                '添加年级'
              )
            ]
            return h('div', arr)
          }
        }
        ],
        columns1: [{
          title: '年级Id',
          align: 'center',
          key: 'gradeId'
        },
        {
          title: '年级',
          align: 'center',
          key: 'name'
        },
        {
          title: '班级',
          align: 'center',
          key: 'classList'
        }, {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            const arr = [
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
                      this.showEnd(params.row)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showStart(params.row)
                    }
                  }
                },
                '添加班级'
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
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        schoolId: '',
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
        modalCancel: false
      }
    }
  },
  methods: {
    changeProvince (val) {
      console.log(this.provinceArr)
      for (var i = 0; i < this.provinceArr.length; i++) {
        if (val === this.provinceArr[i].label) {
          this.citiesArr = this.provinceArr[i].children
          this.countyArr = []
        }
      }
    },
    changeCity (val) {
      for (var i = 0; i < this.citiesArr.length; i++) {
        if (val === this.citiesArr[i].label) {
          this.countyArr = this.citiesArr[i].children
        }
      }
    },
    handleAdd () {
      this.index++
      this.formDynamic.items.push({
        name: '',
        classNum: '',
        index: this.index
      })
    },
    handleRemove (index) {
      this.formDynamic.items.splice(index, 1)
      // this.formDynamic.items[index].status = 0;
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onStartBtn (status) {
      console.log(this.viewData.Confirm)
      axios
        .post(
          '/api/school/create_class',
          qs.stringify({
            schoolId: this.viewData.schoolId,
            gradePid: this.viewData.Confirm.gradeId,
            name: this.viewData.Confirm.name1
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('添加成功!')
          this.searchcourse()
        })
    },
    onEndBtn (status) {
      axios
        .delete(
          '/api/school/delete_grade', {
            params: {
              gradeId: this.viewData.Confirm.gradeId
            }
          }
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('删除成功!')
          this.searchcourse()
        })
    },
    onCancelBtn (status) {
      axios
        .delete(
          '/api/school/delete', {
            params: {
              schoolId: this.viewData.Confirm.schoolId
            }
          }
        )
        .then(response => {
          this.viewData.Confirm = {}
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
      console.log(row.schoolId)
      this.viewData.schoolId = row.schoolId
      console.log(this.viewData.schoolId)
      this.searchcourse()
    },
    showStart (row) {
      this.viewData.Confirm = row
      this.viewData.modalStart = true
    },
    showEnd (row) {
      this.viewData.Confirm = row
      this.viewData.modalEnd = true
    },
    showCancel (row) {
      this.viewData.Confirm = row
      this.viewData.modalCancel = true
    },
    showBind (row) {
      this.viewData.bind.schoolId = row.schoolId
      this.viewData.modalBind = true
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
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/api/school/create',
          qs.stringify({
            province: this.viewData.Add.province,
            city: this.viewData.Add.city,
            county: this.viewData.Add.county,
            schoolName: this.viewData.Add.schoolName
          })
        )
        .then(response => {
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn () {
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/api/school/update',
          qs.stringify({
            schoolId: this.viewData.Edit.schoolId,
            province: this.viewData.Edit.province,
            city: this.viewData.Edit.city,
            county: this.viewData.Edit.county,
            schoolName: this.viewData.Edit.schoolName
          })
        )
        .then(response => {
          this.viewData.Edit = {}
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
    },
    onBindBtn () {
      axios
        .post(
          '/api/school/create_grade',
          qs.stringify({
            schoolId: this.viewData.bind.schoolId,
            gradeList: this.formDynamic.items
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
    searchManage () {
      axios
        .get('/api/school/get', {
          params: {
            page: this.searchList.searchCondition.page,
            province: this.searchList.searchCondition.province,
            city: this.searchList.searchCondition.city,
            county: this.searchList.searchCondition.county,
            schoolName: this.searchList.searchCondition.schoolName
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data
          this.searchList.pageData.total = response.data.total
        })
    },
    searchcourse () {
      axios
        .get('/api/school/detail', {
          params: {
            schoolId: this.viewData.schoolId
          }
        })
        .then(response => {
          this.searchList.pageData1.content = response.data
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

  .imgMax {
    max-width: 300px;
  }

</style>
