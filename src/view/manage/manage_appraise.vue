<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.name" clearable
              placeholder="姓名"></Input>
            <Select placeholder="身份" @on-change="searchManage" v-model="searchList.searchCondition.role"
              class="search_item">
              <Option v-for="item in viewData.roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <input style="display:none" class="ImgC" type="file" name="avatar"
              accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)" ref="avatarInput" />
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <!-- <Button icon="md-add" @click="showAdd()">增加用户</Button> -->
          </Form-item>

          <Modal v-model="viewData.modalDetail" title="用户评价详情" :mask-closable="false" width="55"
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
          title: '用户openId',
          align: 'center',
          key: 'openId'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name'
        },
        {
          title: '评价人数',
          align: 'center',
          key: 'appraisePersonNum'
        },
        {
          title: '待评价',
          align: 'center',
          key: 'toAppraiseNum'
        },
        {
          title: '平均分',
          align: 'center',
          key: 'appraiseAvgScope'
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
              )
            ]
            return h('div', arr)
          }
        }
        ],
        columns1: [{
          title: '课程名称',
          align: 'center',
          key: 'courseName'
        },
        {
          title: '评价内容',
          align: 'center',
          key: 'appraiseText'
        },
        {
          title: '评价时间',
          align: 'center',
          key: 'createTime'
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
          size: 5,
          role: 1
        },
        pageData1: {
          content: [],
          pageNum: 1,
          total: 0
        },
        searchCondition1: {
          page: 1,
          size: 5,
          role: 1
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        goodsIId: '',
        Detail: {},
        Delete: {},
        Confirm: {},
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalPass: false,
        roleText: ['学生', '教师', '导师', '机构', '基地'],
        roleList: [{
          value: 1,
          label: '学生'
        },
        {
          value: 2,
          label: '教师'
        },
        {
          value: 3,
          label: '导师'
        },
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
    onPageChange1 (pageNum) {
      this.searchList.searchCondition1.page = pageNum
      this.searchDetail()
    },
    onDeleteBtn () {
      axios
        .delete('/api/merchant/delete', {
          data: {
            openId: this.viewData.Delete.openId
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    onAuditBtn (status) {
      axios
        .put(
          '/api/user/personal_audit',
          qs.stringify({
            openId: this.viewData.Confirm.openId,
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
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.openId = row.openId
      this.searchDetail()
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/admin/appraise/msg', {
          params: {
            page: this.searchList.searchCondition.page,
            name: this.searchList.searchCondition.name,
            role: this.searchList.searchCondition.role
          }
        })
        .then(res => {
          console.log(res)
          this.searchList.pageData.content = res.data.records
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/admin/appraise/detail', {
          params: {
            openId: this.viewData.openId,
            page: this.searchList.searchCondition1.page
          }
        })
        .then(res => {
          this.searchList.pageData1.content = res.data.records
          this.searchList.pageData1.total = res.data.total
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
