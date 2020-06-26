<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.lineName" clearable
              placeholder="路线名"></Input>
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <Button icon="md-add" @click="showAdd()">增加路线</Button>
          </Form-item>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除路线id为：
            <span style="color:red">{{viewData.Delete.lineId}}</span>
            的路线吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalSiteDelete" @on-ok="onSiteDeleteBtn">
            确认删除地点id为：
            <span style="color:red">{{viewData.Delete.siteId}}</span>
            的地点吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalSiteDeleteImg"
            @on-ok="delImg(viewData.delInd)">
            <span style="color:red">是否删除该图片</span>
          </Modal>

          <Modal title="查看路线详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
            <div class="order_info">
              <h3>路线信息</h3>
              <Row>
                <Col span="10">路线Id: {{viewData.Detail.lineId}}</Col>
                <Col span="10">路线状态: {{viewData.Detail.courseStatusChina}}</Col>
              </Row>
              <Row>
                <Col span="10">路线名: {{viewData.Detail.lineName}}</Col>
                <Col span="10">路线分类: {{viewData.Detail.cateName}}</Col>
              </Row>
              <Row>
                <Col span="10">路线价格: {{viewData.Detail.coursePrice}}</Col>
                <Col span="10">是否热门: {{viewData.Detail.isHot?'热门':'否'}}</Col>
              </Row>
              <Row>
                <Col span="10">是否推荐: {{viewData.Detail.isHot?'推荐':'否'}}</Col>
                <Col span="10">收藏数: {{viewData.Detail.collectCount}}</Col>
              </Row>
              <Row>
                <Col span="10">点赞数: {{viewData.Detail.likeCount}}</Col>
                <Col span="10">评论数: {{viewData.Detail.commentCount}}</Col>
              </Row>
              <!-- <h4> -->
              <div>路线描述:
                <pre>{{viewData.Detail.courseDesc}}</pre>
              </div>
              <!-- </h4> -->
            </div>
          </Modal>

          <Modal v-model="viewData.modalAdd" title="添加路线" :mask-closable="false" @on-ok="onAddBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="路线名:">
                <Input style="width: 200px" :maxlength="20" v-model="viewData.Add.lineName" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="是否上架:">
                <RadioGroup v-model="viewData.Add.lineStatus" size="large">
                  <Radio label="0">否</Radio>
                  <Radio label="1">是</Radio>
                </RadioGroup>
              </Form-item>
            </Form>
          </Modal>

          <Modal v-model="viewData.modalEdit" title="编辑路线" :mask-closable="false" @on-ok="onEditBtn" width="40"
            @on-cancel="onModelCancel">
            <Form :label-width="100">
              <Form-item class="form_item" label="路线Id:">
                <Input disabled style="width: 200px" :maxlength="20" v-model="viewData.Edit.lineId" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="路线名:">
                <Input style="width: 200px" v-model="viewData.Edit.lineName" type="text" placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="是否上架:">
                <RadioGroup v-model="viewData.Edit.lineStatus" size="large">
                  <Radio :label="0">否</Radio>
                  <Radio :label="1">是</Radio>
                </RadioGroup>
              </Form-item>
            </Form>
          </Modal>

          <Modal v-model="viewData.modalSiteAdd" title="添加地点" :mask-closable="false" @on-ok="onSiteAddBtn" width="40"
            @on-cancel="onModelCancel1">
            <Form :label-width="100">
              <Form-item class="form_item" label="地点名:">
                <Input style="width: 200px" :maxlength="20" v-model="viewData.Add.siteName" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="排序:">
                <Input style="width: 200px" :maxlength="2" v-model="viewData.Add.listOrder" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="地点简介:">
                <Input style="width: 300px" :maxlength="1000" v-model="viewData.Add.siteDesc" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item style="margin-top: -15px;padding-right: 10px;" label="地点图：">
                <div>
                  <Button class="choice_img">
                    <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                    <input multiple class="ImgC" type="file" name="avatar"
                      accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)"
                      ref="avatarInput" />
                  </Button>
                </div>
              </Form-item>
              <Form-item class="img_container">
                <div v-for="(item, index) in viewData.Img" :key="index"
                  style="position:relative;margin:0 1%;display:flex;">
                  <img @click="changeImg(index)" :src="item" style="width: 110px;height:110px;" />
                  <Icon @click="delImg(index)" size="18" style="position:absolute;top:5px;right:5px"
                    type="md-close-circle" />
                </div>
              </Form-item>
            </Form>
          </Modal>

          <Modal v-model="viewData.modalSiteEdit" title="编辑地点" :mask-closable="false" @on-ok="onSiteEditBtn" width="40"
            @on-cancel="onModelCancel1">
            <Form :label-width="100">
              <Form-item class="form_item" label="地点名:">
                <Input style="width: 200px" :maxlength="20" v-model="viewData.Edit.siteName" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="排序:">
                <Input style="width: 200px" :maxlength="2" v-model="viewData.Edit.listOrder" type="text"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item class="form_item" label="地点简介:">
                <Input style="width: 300px" :maxlength="1000" v-model="viewData.Edit.siteDesc" type="textarea"
                  placeholder="请输入"></Input>
              </Form-item>
              <Form-item style="margin-top: -15px;padding-right: 10px;" label="地点图：">
                <div>
                  <Button class="choice_img">
                    <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                    <input multiple class="ImgC" type="file" name="avatar"
                      accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)"
                      ref="avatarInput" />
                    <input style="display:none;" type="file" name="avatar"
                      accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage1($event)"
                      ref="avatarInput1" />
                  </Button>
                </div>
              </Form-item>
              <Form-item class="img_container">
                <div v-for="(item, index) in viewData.Img" :key="index"
                  style="position:relative;margin:0 1%;display:flex;">
                  <img @click="changeImg(index)" :src="item" style="width: 110px;height:110px;" />
                  <Icon @click="showDelImg(index)" size="18" style="position:absolute;top:5px;right:5px"
                    type="md-close-circle" />
                </div>
              </Form-item>
            </Form>
          </Modal>
          <Modal v-model="viewData.modalSite" title="路线地点列表" :mask-closable="false" width="55"
            @on-cancel="onModelCancel">
            <Button style="margin-bottom: 10px;" icon="md-add" @click="showSiteAdd()">增加地点</Button>
            <i-table border :columns="searchList.columns1" :data="searchList.pageData1.content"></i-table>
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

  export default {
    data() {
      return {
        searchList: {
          carList: [],
          cateList: [],
          columns: [{
              title: '路线Id',
              align: 'center',
              key: 'lineId'
            },
            {
              title: '路线标题',
              align: 'center',
              key: 'lineName'
            },
            {
              title: '路线状态',
              align: 'center',
              key: 'lineStatus',
              render: (h, params) => {
                return h('span', params.row.lineStatus ? '上架中' : '已下架')
              }
            },
            {
              title: '创建时间',
              align: 'center',
              key: 'createTime'
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
                          this.showSite(params.row)
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
                arr.push(
                  h(
                    'Button', {
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
          columns1: [{
              title: '地点Id',
              align: 'center',
              key: 'siteId'
            },
            {
              title: '地点名',
              align: 'center',
              key: 'siteName'
            },
            {
              title: '排序',
              align: 'center',
              key: 'listOrder'
            },
            {
              title: '创建时间',
              align: 'center',
              key: 'createTime'
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
                        type: 'error',
                        size: 'small'
                      },
                      style: {
                        marginRight: '15px'
                      },
                      on: {
                        click: () => {
                          this.showSiteDelete(params.row)
                        }
                      }
                    },
                    '删除'
                  ),
                  h(
                    'Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showSiteEdit(params.row)
                        }
                      }
                    },
                    '编辑'
                  )
                ]

                return h('div', arr)
              }
            }
          ],
          pageData: {
            content: [],
            pageNum: 1,
            total: 0,
          },
          pageData1: {
            content: [],
            pageNum: 1,
            total: 0,
          },
          searchCondition: {
            page: 1
          },
          pageSizeOpts: [1, 5, 10, 20, 30, 40]
        },
        viewData: {
          Img: [],
          delInd: '',
          courseIId: '',
          Detail: {},
          Add: {},
          Edit: {},
          Delete: {},
          Confirm: '',
          modalAdd: false,
          modalSite: false,
          modalSiteAdd: false,
          modalSiteEdit: false,
          modalSiteDelete: false,
          modalSiteDeleteImg: false,
          modalEdit: false,
          modalDelete: false,
          modalDetail: false,
          statusList: [{
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
      showImg(ad_picture_url) {
        this.$Modal.confirm({
          title: "预览图片",
          closable: true,
          content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
        });
      },
      // 图片操作
      changeImage(e) {
        let file = e.target.files;
        let that = this;
        let reader = new FileReader();
        if (that.viewData.Img.length + file.length > 5) {
          this.$Message.error("地点图只能上传5张图片！");
          this.$refs.avatarInput.value = "";
          return false;
        }
        for (let i = 0; i < file.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(file[i]);
          reader.onload = function (e) {
            console.log(that.viewData.Img);
            that.viewData.Img.push(this.result);
          };
        }
      },
      changeImage1(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          that.viewData.Img.splice(that.viewData.ImgId, 1, this.result);
        };
      },
      changeImg(index) {
        let img = this.viewData.Img[index],
          find = this.viewData.Img[index].indexOf("https://");
        if (find === 0) {
          let ind = img.indexOf('?time=')
          img = img.substring(0, ind)
          this.viewData.ImgDel.push(img);
        }
        this.viewData.ImgId = index;
        this.$refs.avatarInput1.value = "";
        this.$refs.avatarInput1.click();
      },
      delImg(index) {
        let img = this.viewData.Img[index],
          find = img.indexOf("https://");
        if (find === 0) {
          this.onSiteDeleteImg(img)
          // let ind = img.indexOf('?time=')
          // img = img.substring(0, ind)
          // this.viewData.ImgDel.push(img);
        }
        this.viewData.Img.splice(index, 1);
        this.$refs.avatarInput.value = "";
      },
      showDelImg(index) {
        this.viewData.delInd = index
        this.viewData.modalSiteDeleteImg = true
      },
      onPageChange(pageNum) {
        this.searchList.searchCondition.page = pageNum
        this.searchManage()
      },
      onDeleteBtn() {
        axios
          .delete('/api/line/delete', {
            data: {
              lineId: this.viewData.Delete.lineId
            }
          })
          .then(response => {
            this.$Message.success('删除成功!')
            this.searchManage()
          })
      },
      onSiteDeleteBtn() {
        axios
          .delete('/api/line/delete_site', {
            data: {
              lineId: this.viewData.Delete.lineId,
              siteId: this.viewData.Delete.siteId
            }
          })
          .then(response => {
            this.$Message.success('删除成功!')
            this.searchSite()
          })
      },
      onSiteDeleteImg(img) {
        axios
          .delete('/api/line/delete_site_gallery', {
            data: {
              imageSrc: img,
              siteId: this.viewData.Edit.siteId
            }
          })
          .then(response => {
            this.$Message.success('删除成功!')
            this.searchSite()
          })
      },
      onModelCancel() {
        this.viewData.Img = []
        this.$refs.avatarInput.value = ''
        this.searchManage()
      },
      onModelCancel1() {
        this.viewData.Img = []
        this.$refs.avatarInput.value = ''
        this.searchSite()
      },
      showDetail(row) {
        this.viewData.modalDetail = true
        this.viewData.Detail = row
        this.viewData.lineId = row.lineId
      },
      showDelete(item) {
        this.viewData.Delete = item
        this.viewData.modalDelete = true
      },
      showEdit(item) {
        this.viewData.Edit = item
        this.viewData.modalEdit = true
      },
      showAdd() {
        this.viewData.modalAdd = true
      },
      showSite(row) {
        this.viewData.modalSite = true
        this.viewData.lineId = row.lineId
        this.searchSite()
      },
      showSiteAdd() {
        this.viewData.Img = []
        this.$refs.avatarInput.value = ''
        this.viewData.modalSiteAdd = true
      },
      showSiteEdit(item) {
        this.viewData.Edit = item
        this.$refs.avatarInput.value = ''
        this.viewData.Img = item.siteGallery||[]
        this.viewData.modalSiteEdit = true
      },
      showSiteDelete(item) {
        this.viewData.Delete = item
        this.viewData.modalSiteDelete = true
      },
      onAddBtn() {
        this.$Message.warning('上传中，请稍后...')
        axios
          .post(
            '/api/line/create', {
              lineName: this.viewData.Add.lineName,
              lineStatus: this.viewData.Add.lineStatus || 0,
            }
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
            '/api/line/update', {
              lineName: this.viewData.Edit.lineName,
              lineStatus: this.viewData.Edit.lineStatus,
              lineId: this.viewData.Edit.lineId
            }
          )
          .then(response => {
            this.viewData.Edit = {}
            this.searchManage()
            this.$Message.success('编辑成功!')
          })
      },
      onSiteAddBtn() {
        this.$Message.warning('上传中，请稍后...')
        axios
          .post(
            '/api/line/create_site', {
              lineId: this.viewData.lineId,
              siteName: this.viewData.Add.siteName,
              siteDesc: this.viewData.Add.siteDesc,
              listOrder: this.viewData.Add.listOrder,
              siteGallery: this.viewData.Img,
            }
          )
          .then(response => {
            this.viewData.Add = {}
            this.viewData.Img = [];
            this.$refs.avatarInput.value = "";
            this.searchSite()
            this.$Message.success('添加成功!')
          })
      },
      onSiteEditBtn() {
        this.$Message.warning('上传中，请稍后...')
        let Img = this.viewData.Img.filter(item=>item.indexOf("https://")=== -1)
        console.log(Img);
        axios
          .put(
            '/api/line/update_site', {
              siteId: this.viewData.Edit.siteId,
              lineId: this.viewData.Edit.lineId,
              siteName: this.viewData.Edit.siteName,
              siteDesc: this.viewData.Edit.siteDesc,
              listOrder: this.viewData.Edit.listOrder,
              siteGallery: Img,
            }
          )
          .then(response => {
            this.viewData.Edit = {}
            this.viewData.Img = [];
            this.$refs.avatarInput.value = "";
            this.searchSite()
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
          .get('/api/line/get', {
            params: {
              page: this.searchList.searchCondition.page,
              lineName: this.searchList.searchCondition.lineName,
              courseStatus: this.searchList.searchCondition.courseStatus
            }
          })
          .then(response => {
            this.searchList.pageData.content = response.data.data
            this.searchList.pageData.total = response.data.total
          })
      },
      searchSite() {
        axios
          .get('/api/line/site_list', {
            params: {
              lineId: this.viewData.lineId
            }
          })
          .then(response => {
            this.searchList.pageData1.content = response.data
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

  .imgMax {
    max-width: 300px;
  }

</style>
