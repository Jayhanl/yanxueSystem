<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.name" clearable
              placeholder="管理员名"></Input>
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
            <Button icon="md-add" @click="showAdd()">增加</Button>
          </Form-item>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除id为：
            <span style="color:red">{{viewData.Delete.id}}</span>
            的管理员吗？
          </Modal>
          <Modal v-model="viewData.modalAdd" title="添加管理员" :mask-closable="false" @on-ok="onAddBtn" width="35"
            @on-cancel="onModelCancel">
            <Form :label-width="80">
              <Form-item class="form_item" label="管理员名:">
                <Input style="width: 200px" :maxlength="20" v-model="viewData.Add.name" type="text"
                  placeholder="请输入管理员名"></Input>
              </Form-item>
              <Form-item class="form_item" label="账号:">
                <Input style="width: 200px" :maxlength="30" v-model="viewData.Add.account" type="text"
                  placeholder="请输入账号"></Input>
              </Form-item>
              <Form-item class="form_item" label="密码:">
                <Input style="width: 200px" v-model="viewData.Add.password" type="text" placeholder="请输入密码"></Input>
              </Form-item>
              <Form-item class="form_item" label="头像：">
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
          <Modal v-model="viewData.modalEdit" title="编辑管理员" :mask-closable="false" @on-ok="onEditBtn" width="35"
            @on-cancel="onModelCancel">
            <Form :label-width="80">
              <Form-item class="form_item" label="管理员名:">
                <Input display style="width: 200px" :maxlength="20" v-model="viewData.Edit.name" type="text"
                  placeholder="请输入管理员名"></Input>
              </Form-item>
              <Form-item class="form_item" label="账号:">
                <Input style="width: 200px" :maxlength="30" v-model="viewData.Edit.account" type="text"
                  placeholder="请输入账号"></Input>
              </Form-item>
              <Form-item class="form_item" label="密码:">
                <Input style="width: 200px" v-model="viewData.Edit.password" type="text" placeholder="请输入密码"></Input>
              </Form-item>
              <Form-item class="form_item" label="头像：">
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
              title: 'id',
              align: 'center',
              key: 'id',
              width: 120
            },
            {
              title: '管理员名',
              align: 'center',
              key: 'name'
            },
            {
              title: '账号',
              align: 'center',
              key: 'account'
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
                          this.showEdit(params.row);
                        }
                      }
                    },
                    "编辑"
                  ),
                  h(
                    "Button", {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        marginRight: "15px"
                      },
                      on: {
                        click: () => {
                          this.showDelete(params.row);
                        }
                      }
                    },
                    "删除"
                  )
                ]);
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
            categoryName: '',
            listorder: ''
          },
          Edit: {
            categoryName: '',
            listorder: ''
          },
          ImgSrc: '',
          Delete: {},
          modalEdit: false,
          modalAdd: false,
          modalDelete: false,
          Confirm: ''
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
      changeImage(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          that.viewData.ImgSrc = this.result;
        }
      },
      onDeleteBtn() {
        axios
          .delete("/api/admin/delete", {
            data: {
              id: this.viewData.Delete.id
            }
          })
          .then(response => {
            this.$Message.success("删除成功!");
            this.searchManage();
          });
      },
      onAddBtn() {
        this.$Message.warning("上传中，请稍后...");
        axios
          .post(
            "/api/admin/create",
            qs.stringify({
              name: this.viewData.Add.name,
              account: this.viewData.Add.account,
              password: this.viewData.Add.password,
              rolePath: ['manage'],
              avatarUrl: this.viewData.ImgSrc
            })
          )
          .then(response => {
            this.viewData.Add = {};
            this.searchManage();
            this.$Message.success("添加成功!");
          });

      },
      onEditBtn() {
        this.$Message.warning("上传中，请稍后...");
        let image = {
          id: this.viewData.Edit.id,
          name: this.viewData.Edit.name,
          password: this.viewData.Edit.password,
          // rolePath: ['manage']
        };
        if (this.viewData.Edit.avatarUrl !== this.viewData.ImgSrc) {
          image.avatarUrl = this.viewData.ImgSrc;
        }
        axios
          .put(
            "/api/admin/update",
            image
          )
          .then(response => {
            this.viewData.ImgSrc = '';
            this.$refs.avatarInput.value = "";
            this.viewData.Edit = {};
            this.searchManage();
            this.$Message.success("编辑成功!");
          })
          .catch(() => {
            this.searchManage();
          });

      },
      onModelCancel() {
        this.viewData.ImgSrc = '';
        this.$refs.avatarInput.value = "";
        this.searchManage()
      },
      showAdd() {
        this.viewData.modalAdd = true;
      },
      showEdit(item) {
        this.viewData.Edit = item;
        this.viewData.ImgSrc = item.avatarUrl;
        this.viewData.modalEdit = true;
      },
      showDelete(item) {
        this.viewData.Delete = item;
        this.viewData.modalDelete = true;
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
          .get(`/api/admin/get`, {
            params: {
              page: this.searchList.searchCondition.page,
              name: this.searchList.searchCondition.name
            }
          })
          .then(res => {
            this.searchList.pageData.content = res.data.data.data
            this.searchList.pageData.total = res.data.data.total;
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
