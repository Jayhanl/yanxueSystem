<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Button icon="md-add" @click="showAdd()">增加</Button>
          </Form-item>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除
            <span style="color:red">{{viewData.Delete.categoryName}}</span>
            Banner图吗？
          </Modal>
          <Modal v-model="viewData.modalAdd" title="添加Banner图" :mask-closable="false" @on-ok="onAddBtn" width="35"
            @on-cancel="onModelCancel">
            <Form :label-width="80">
              <Form-item class="form_item" label="排序序号:">
                <Input style="width: 200px" v-model="viewData.Add.listOrder" type="text" placeholder="请输入正整数"></Input>
              </Form-item>
              <Form-item class="form_item" label="备注:">
                <Input style="width: 200px" v-model="viewData.Add.remark" type="text" placeholder="备注"></Input>
              </Form-item>
              <Form-item class="form_item" label="Banner图：">
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
          <Modal v-model="viewData.modalEdit" title="编辑Banner图" :mask-closable="false" @on-ok="onEditBtn" width="35"
            @on-cancel="onModelCancel">
            <Form :label-width="80">
              <Form-item class="form_item" label="排序序号:">
                <Input style="width: 200px" v-model="viewData.Edit.listOrder" type="text" placeholder="请输入正整数"></Input>
              </Form-item>
              <Form-item class="form_item" label="备注:">
                <Input style="width: 200px" v-model="viewData.Edit.remark" type="text" placeholder="备注"></Input>
              </Form-item>
              <Form-item class="form_item" label="Banner图：">
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
        </Form-item>
      </Form-item>
    </Form>
    </Col>
  </Row>
</template>
<script>
  import service from "@/libs/api.request";
  import axios from "axios";
  import qs from "qs";

  export default {
    data() {
      return {
        fileName: "",
        uploadFile: {},
        searchList: {
          Info: [],
          columns: [{
              title: "Banner图",
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
            },
            {
              title: "id",
              align: "center",
              key: "id"
            },
            {
              title: "排序序号",
              align: "center",
              key: "listOrder"
            },
            {
              title: "备注",
              align: "center",
              key: "remark"
            },
            {
              title: "操作",
              key: "action",
              width: 200,
              align: "center",
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
            rankTime: ""
          },
          searchCondition: {
            page: 1,
            size: 5
          },
          pageSizeOpts: [1, 5, 10, 20, 30, 40]
        },
        viewData: {
          Add: {
            categoryName: "",
            listOrder: ""
          },
          Edit: {
            categoryName: "",
            listOrder: ""
          },
          ImgSrc: '',
          pList: [],
          modalEdit: false,
          modalAdd: false,
          modalDelete: false,
          Delete: ""
        }
      };
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
          .delete("/api/banner/delete", {
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
        if (this.viewData.Add.listOrder === "") {
          this.$Message.error("请输入排序序号");
          return;
        }
        if (this.viewData.ImgSrc !== '') {
          this.$Message.warning("上传中，请稍后...");
          axios
            .post(
              "/api/banner/create",
              qs.stringify({
                remark: this.viewData.Add.remark,
                listOrder: this.viewData.Add.listOrder,
                imageSrc: this.viewData.ImgSrc
              })
            )
            .then(response => {
              this.viewData.ImgSrc = '';
              this.$refs.avatarInput.value = "";
              this.viewData.Add = {};
              this.searchManage();
              this.$Message.success("添加成功!");
            });
        }
      },
      onEditBtn() {
        if (this.viewData.Edit.listOrder === "") {
          this.$Message.error("请输入排序序号");
          return;
        }
        if (this.viewData.ImgSrc !== '') {
          this.$Message.warning("上传中，请稍后...");
          let image = {
            id: this.viewData.Edit.id,
            remark: this.viewData.Edit.remark,
            listOrder: this.viewData.Edit.listOrder
          };
          if (this.viewData.Edit.imageSrc !== this.viewData.ImgSrc) {
            image.imageSrc = this.viewData.ImgSrc;
          }
          axios
            .put(
              "/api/banner/update",
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
        }
      },
      onModelCancel() {
        this.viewData.ImgSrc = '';
        this.$refs.avatarInput.value = "";
        this.searchManage();
      },
      showAdd() {
        this.viewData.ImgSrc = ''
        this.viewData.modalAdd = true;
      },
      showEdit(item) {
        this.viewData.ImgSrc = item.imageSrc;
        this.viewData.Edit = item;
        this.viewData.modalEdit = true;
      },
      showDelete(item) {
        this.viewData.Delete = item;
        this.viewData.modalDelete = true;
      },
      searchPageReturn() {
        this.searchList.searchCondition.page = 1;
        this.searchManage();
        this.$Message.success("搜索完成!");
      },
      searchManage() {
        console.log(this.searchList.searchCondition.pid);
        axios.get('/api/banner/get').then(response => {
          this.searchList.pageData.content = response.data
        })
      }
    },
    created() {
      this.searchManage();
    }
  };

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

  .ivu-form-item-content button[data-cmd="imageUpload"] {
    display: none !important;
    color: black !important;
  }

  .ivu-form-item-content button[data-cmd="imageByURL"] {
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
