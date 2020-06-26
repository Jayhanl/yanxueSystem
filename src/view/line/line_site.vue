<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Select
                clearable
                placeholder="商品分类"
                @on-change="searchManage"
                v-model="searchList.searchCondition.categoryId"
                style="width:200px"
              >
                <Option
                  v-for="item in searchList.categoryList"
                  :value="item.categoryId"
                  :key="item.categoryId"
                >{{ item.categoryName }}</Option>
              </Select>
              <Input
                style="width: 200px"
                type="text"
                v-model="searchList.searchCondition.goodsName"
                clearable
                placeholder="商品名"
              ></Input>
              <Select
                clearable
                placeholder="商品状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.goodsStatus"
                style="width:200px"
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
              <Button icon="md-add" @click="showAdd()">增加商品</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDetailDel"
              @on-ok="onDetailDelBtn"
            >
              确认删除规格名为：
              <span style="color:red">{{viewData.DetailDel.goodsStandards}}</span>
              的规格吗？
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加商品"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="50"
              height="10"
            >
              <Form inline>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品名:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Add.goodsName"
                    type="text"
                    placeholder="商品名"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品分类:">
                  <Select
                    clearable
                    placeholder="商品分类"
                    v-model="viewData.Add.categoryId"
                    style="width:180px"
                  >
                    <Option
                      v-for="item in searchList.categoryList"
                      :value="item.categoryId"
                      :key="item.categoryId"
                    >{{ item.categoryName }}</Option>
                  </Select>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品单位:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Add.goodsUnit"
                    type="text"
                    placeholder="商品单位"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品描述:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Add.goodsDesc"
                    type="textarea"
                    placeholder="商品描述"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品图：">
                  <div>
                    <Button class="choice_img">
                      <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                      <input
                        multiple
                        class="ImgC"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage($event)"
                        ref="avatarInput"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="position:relative;margin:0 1%;display:flex;"
                  >
                    <img @click="changeImg(index)" :src="item" style="width: 110px;height:110px;" />
                    <Icon
                      @click="delImg(index)"
                      size="18"
                      style="position:absolute;top:5px;right:5px"
                      type="md-close-circle"
                    />
                  </div>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              v-model="viewData.modalEdit"
              title="编辑商品"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form inline>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品编号:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Edit.goodsId"
                    disabled
                    type="text"
                    placeholder="商品编号"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品名:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Edit.goodsName"
                    type="text"
                    placeholder="商品名"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品分类:">
                  <Select
                    clearable
                    placeholder="商品分类"
                    v-model="viewData.Edit.categoryId"
                    style="width:180px"
                  >
                    <Option
                      v-for="item in searchList.categoryList"
                      :value="item.categoryId"
                      :key="item.categoryId"
                    >{{ item.categoryName }}</Option>
                  </Select>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品单位:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Edit.goodsUnit"
                    type="text"
                    placeholder="商品单位"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品描述:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.Edit.goodsDesc"
                    type="text"
                    placeholder="商品描述"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品图：">
                  <div>
                    <Button class="choice_img">
                      <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                      <input
                        multiple
                        class="ImgC"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage($event)"
                        ref="avatarInput"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="position:relative;margin:0 1%;display:flex;"
                  >
                    <img @click="changeImg(index)" :src="item" style="width: 110px;height:110px;" />
                    <Icon
                      @click="delImg(index)"
                      size="20"
                      style="position:absolute;top:5px;right:5px"
                      type="md-close-circle"
                    />
                  </div>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              v-model="viewData.modalDetail"
              title="商品规格"
              :mask-closable="false"
              @on-ok="onDetailBtn"
              width="50"
              @on-cancel="onModelCancel"
            >
              <Button icon="md-add" @click="showDetailAdd()">增加规格</Button>
              <div class="all_detail" v-for="(item, index) in viewData.Detail" :key="item.stockId">
                <h4 class="title_detail">规格{{index+1}}:</h4>
                <Form inline style="flex:4">
                  <Form-item style="margin-top: -15px;padding-right: 10px;" label="规格:">
                    <Input
                      style="width: 180px"
                      v-model="item.goodsStandards"
                      disabled
                      type="text"
                      placeholder="商品规格"
                    ></Input>
                  </Form-item>
                  <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品库存:">
                    <Input
                      style="width: 180px"
                      disabled
                      v-model="item.goodsStock"
                      type="text"
                      placeholder="商品库存"
                    ></Input>
                  </Form-item>
                  <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品价格:">
                    <Input
                      style="width: 180px"
                      disabled
                      v-model="item.goodsPrice"
                      type="text"
                      placeholder="商品价格"
                    ></Input>
                  </Form-item>
                  <Form-item style="margin-top: -15px;padding-right: 10px;" label="上下架:">
                    <Switch
                      :value="item.isPutaway===1"
                      size="large"
                      @on-change="stockChange(index)"
                    >
                      <span slot="open">上架</span>
                      <span slot="close">下架</span>
                    </Switch>
                  </Form-item>
                </Form>
                <div class="img_detail">
                  <div style="height:120px;position:relative;margin:5%;">
                    <img :src="item.imageSrc" style="width: 110px;height:110px;" />
                  </div>
                </div>
                <div class="btn_detail">
                  <Button @click="showDetailEdit(index)" size="small" type="primary">编辑</Button>
                  <Button @click="showDetailDel(index)" size="small" type="error">删除</Button>
                </div>
              </div>
            </Modal>

            <Modal
              v-model="viewData.modalDetailAdd"
              title="添加规格"
              :mask-closable="false"
              @on-ok="onDetailAddBtn"
              width="50"
              height="10"
            >
              <Form inline>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品规格:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailAdd.goodsStandards"
                    type="text"
                    placeholder="商品规格"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品价格:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailAdd.goodsPrice"
                    type="number"
                    placeholder="商品价格"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品库存:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailAdd.goodsStock"
                    type="number"
                    placeholder="商品库存"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品图：">
                  <div>
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
                      <input
                        style="display:none;"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage1($event)"
                        ref="avatarInput1"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="width: 18%;height:120px;position:relative;margin:0 1%;display:flex;"
                  >
                    <img @click="changeImg(index)" :src="item" style="width: 100%;height:110px;" />
                    <Icon
                      @click="delImg(index)"
                      size="18"
                      style="position:absolute;top:5px;right:5px"
                      type="md-close-circle"
                    />
                  </div>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              v-model="viewData.modalDetailEdit"
              title="编辑规格"
              :mask-closable="false"
              @on-ok="onDetailEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form inline>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品规格:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailEdit.goodsStandards"
                    type="text"
                    placeholder="商品规格"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品价格:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailEdit.goodsPrice"
                    type="number"
                    placeholder="商品价格"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品库存:">
                  <Input
                    style="width: 180px"
                    v-model="viewData.DetailEdit.goodsStock"
                    type="number"
                    placeholder="商品库存"
                  ></Input>
                </Form-item>
                <Form-item style="margin-top: -15px;padding-right: 10px;" label="商品图：">
                  <div>
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
                      <input
                        style="display:none;"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage1($event)"
                        ref="avatarInput1"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="height:120px;position:relative;margin:0 1%;display:flex;"
                  >
                    <img @click="changeImg(index)" :src="item" style="width: 110px;height:110px;" />
                    <Icon
                      @click="delImg(index)"
                      size="20"
                      style="position:absolute;top:5px;right:5px"
                      type="md-close-circle"
                    />
                  </div>
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
          <!-- </TabPane>
          </Tabs>-->
        </Form-item>
      </Form>
    </Col>
  </Row>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      searchList: {
        carList: [],
        categoryList: [],
        columns: [
          {
            title: "商品图",
            width: 140,
            key: "goodGallery",
            render: (h, params) => {
              return h("div", [
                h("img", {
                  attrs: {
                    src: params.row.goodGallery
                  },
                  style: {
                    width: "100px",
                    height: "100px"
                  },
                  on: {
                    click: () => {
                      this.showImg(params.row.goodGallery);
                    }
                  }
                })
              ]);
            }
          },
          {
            title: "商品Id",
            align: "center",
            key: "goodsId"
          },
          {
            title: "商品名",
            align: "center",
            key: "goodsName"
          },
          {
            title: "商品分类",
            align: "center",
            key: "categoryName"
          },
          {
            title: "商品单位",
            align: "center",
            key: "goodsUnit"
          },
          {
            title: "商品描述",
            align: "center",
            key: "goodsDesc"
          },
          {
            title: "商品价格",
            align: "center",
            key: "goodsPrice",
            render: (h, params) => {
              return params.row.goodsPrice + "元";
            }
          },
          {
            title: "销售量",
            align: "center",
            key: "payCount"
          },
          {
            title: "是否上架",
            align: "center",
            key: "action",
            render: (h, params) => {
              return h("i-switch", {
                props: {
                  value: params.row.goodsStatus === 1,
                  size: "large"
                },
                slot: {},
                on: {
                  "on-change": e => {
                    params.row.goodsStatus = e ? 1 : 0;
                    axios
                      .put(
                        "/api/goods/update_status",
                        qs.stringify({
                          goodsId: params.row.goodsId,
                          goodsStatus: e ? 1 : 0
                        })
                      )
                      .then(res => {
                        this.$Message.success("操作成功!");
                        // this.searchManage()
                      });
                  }
                }
              });
            }
          },
          {
            title: "操作",
            key: "action",
            width: 160,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small"
                    },
                    style: {
                      width: "80px"
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row);
                      }
                    }
                  },
                  "商品详情"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (params.row.goodsStatus === 1) {
                          this.$Message.error("请先下架商品后再编辑");
                        } else {
                          this.showEdit(params.row);
                        }
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
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
          totalPages: 0
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {},
        Edit: {},
        Img: [],
        ImgDel: [],
        ImgId: "",
        goodsId: "",
        isGoods: false,
        Detail: "",
        DetailAdd: {},
        DetailEdit: {},
        DetailDel: {},
        Delete: {},
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        modalDetail: false,
        modalDetailAdd: false,
        modalDetailEdit: false,
        modalDetailDel: false,
        statusList: [
          {
            value: 0,
            label: "已下架"
          },
          {
            value: 1,
            label: "上架中"
          }
        ]
      }
    };
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
      var file = e.target.files;
      var that = this;
      var reader = new FileReader();
      if (that.viewData.isGoods) {
        if (that.viewData.Img.length + file.length > 5) {
          this.$Message.error("商品图只能上传5张图片！");
          this.$refs.avatarInput.value = "";
          return false;
        }
        for (let i = 0; i < file.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(file[i]);
          reader.onload = function(e) {
            that.viewData.Img.push(this.result);
          };
        }
      } else {
        reader.readAsDataURL(file[0]);
        reader.onload = function(e) {
          that.viewData.Img = [];
          that.viewData.Img.push(this.result);
        };
      }
    },
    changeImage1(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      let that = this;
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        that.viewData.Img.splice(that.viewData.ImgId, 1, this.result);
      };
    },
    changeImg(index) {
      let img = this.viewData.Img[index],
        find = this.viewData.Img[index].indexOf("https://");
      if (find === 0) {
        let ind = img.indexOf('?time=')
        img = img.substring(0,ind)
        this.viewData.ImgDel.push(img);
      }
      this.viewData.ImgId = index;
      this.$refs.avatarInput1.value = "";
      this.$refs.avatarInput1.click();
    },
    delImg(index) {
      let img = this.viewData.Img[index],
        find = this.viewData.Img[index].indexOf("https://");
      if (find === 0) {
        let ind = img.indexOf('?time=')
        img = img.substring(0,ind)
        this.viewData.ImgDel.push(img);
      }
      this.viewData.Img.splice(index, 1);
    },
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum;
      this.searchManage();
    },
    onDeleteBtn() {
      axios
        .delete(`/api/goods/delete`, {
          data: {
            goodsId: this.viewData.Delete.goodsId
          }
        })
        .then(response => {
          this.$Message.success("删除成功!");
          this.searchManage();
        });
    },
    onAddBtn() {
      if (this.viewData.Img.length !== 0) {
        this.$Message.warning("上传中，请稍后...");
        axios
          .post(
            "/api/goods/create",
            qs.stringify({
              goodsName: this.viewData.Add.goodsName,
              categoryId: this.viewData.Add.categoryId,
              goodsUnit: this.viewData.Add.goodsUnit,
              goodsDesc: this.viewData.Add.goodsDesc,
              goodGallery: this.viewData.Img
            })
          )
          .then(response => {
            this.viewData.Add = {};
            this.viewData.Img = [];
            this.$refs.avatarInput.value = "";
            this.searchManage();
            this.$Message.success("添加成功!");
          });
      } else {
        this.$Message.error("请上传商品图！");
      }
    },
    onEditBtn() {
      let image = {
        goodsId: this.viewData.Edit.goodsId,
        goodsName: this.viewData.Edit.goodsName,
        categoryId: this.viewData.Edit.categoryId,
        goodsUnit: this.viewData.Edit.goodsUnit,
        goodsDesc: this.viewData.Edit.goodsDesc,
        delGoodGallery: this.viewData.ImgDel,
        addGoodGallery: []
      };
      if (this.viewData.Edit.goodGallery !== this.viewData.Img) {
        let imgAdd = [];
        this.viewData.Img.forEach((item, i) => {
          let find = item.indexOf("https://");
          if (find === -1) {
            imgAdd.push(item);
          }
        });
        image.addGoodGallery = imgAdd;
      }
      this.$Message.warning("上传中，请稍后...");
      axios
        .put("/api/goods/update", image)
        .then(response => {
          this.viewData.Edit = {};
          this.viewData.Img = [];
          this.viewData.ImgDel = [];
          this.$refs.avatarInput.value = "";
          this.$Message.success("编辑成功!");
          this.searchManage();
        })
        .catch(error => {
          this.searchManage();
        });
    },
    onDetailDelBtn() {
      axios
        .delete(`/api/goods/delete_stock`, {
          data: {
            stockId: this.viewData.DetailDel.stockId
          }
        })
        .then(response => {
          this.$Message.success("删除成功!");
          this.searchGoods();
        });
    },
    onDetailAddBtn() {
      if (this.viewData.Img.length !== 0) {
        this.$Message.warning("上传中，请稍后...");
        axios
          .post(
            "/api/goods/create_stock",
            qs.stringify({
              goodsId: this.viewData.goodsId,
              goodsStandards: this.viewData.DetailAdd.goodsStandards,
              goodsPrice: this.viewData.DetailAdd.goodsPrice,
              goodsStock: this.viewData.DetailAdd.goodsStock,
              imageSrc: this.viewData.Img[0]
            })
          )
          .then(response => {
            console.log(response);
            this.viewData.DetailAdd = {};
            this.viewData.Img = [];
            this.$refs.avatarInput.value = "";
            this.searchGoods();
            this.$Message.success("添加规格成功!");
          })
          .catch(fail => {
            console.log(fail);
          });
      } else {
        this.$Message.error("请上传商品图！");
      }
    },
    onDetailEditBtn() {
      let image = {
        stockId: this.viewData.DetailEdit.stockId,
        goodsStandards: this.viewData.DetailEdit.goodsStandards,
        goodsPrice: this.viewData.DetailEdit.goodsPrice,
        goodsStock: this.viewData.DetailEdit.goodsStock
      };
      if (this.viewData.DetailEdit.imageSrc !== this.viewData.Img[0]) {
        image.imageSrc = this.viewData.Img[0];
      }
      this.$Message.warning("上传中，请稍后...");
      axios
        .put("/api/goods/update_stock", image)
        .then(response => {
          this.viewData.DetailEdit = {};
          this.viewData.Img = [];
          this.$refs.avatarInput.value = "";
          this.$Message.success("编辑规格成功!");
          this.searchGoods();
        })
        .catch(error => {
          this.viewData.Img = [];
          this.$refs.avatarInput.value = "";
          this.searchGoods();
        });
    },
    onModelCancel() {
      this.viewData.Img = [];
      this.$refs.avatarInput.value = "";
      this.searchManage();
    },
    showDetail(row) {
      this.viewData.modalDetail = true;
      this.viewData.isGoods = false;
      this.viewData.Detail = row;
      this.viewData.goodsId = row.goodsId;
      this.searchGoods();
    },
    showAdd() {
      this.viewData.modalAdd = true;
      this.viewData.isGoods = true;
    },
    showDetailAdd() {
      this.viewData.modalDetailAdd = true;
    },
    showDetailDel(ind) {
      this.viewData.DetailDel = this.viewData.Detail[ind];
      this.viewData.modalDetailDel = true;
    },
    showDetailEdit(ind) {
      this.viewData.DetailEdit = this.viewData.Detail[ind];
      console.log(this.viewData.Detail[ind]);
      this.viewData.Img = [];
      this.viewData.Img.push(this.viewData.Detail[ind].imageSrc);
      this.$refs.avatarInput.value = "";
      this.viewData.modalDetailEdit = true;
    },
    showEdit(item) {
      this.viewData.Edit = item;
      this.viewData.Img = [];
      this.viewData.ImgDel = [];
      this.viewData.Img = JSON.parse(JSON.stringify(item.goodGallery));
      this.$refs.avatarInput.value = "";
      this.viewData.modalEdit = true;
      this.viewData.isGoods = true;
    },
    showDelete(item) {
      this.viewData.Delete = item;
      this.viewData.modalDelete = true;
    },
    stockChange(ind) {
      this.viewData.Detail[ind].isPutaway =
        this.viewData.Detail[ind].isPutaway === 1 ? 0 : 1;
      axios
        .put(
          "/api/goods/update_stock_status",
          qs.stringify({
            stockId: this.viewData.Detail[ind].stockId,
            isPutaway: this.viewData.Detail[ind].isPutaway
          })
        )
        .then(res => {
          this.$Message.success("操作成功!");
        });
    },
    searchPageReturn() {
      this.searchList.searchCondition.page = 1;
      this.searchManage();
      this.$Message.success("搜索完成!");
    },
    searchManage() {
      axios
        .get(`/api/goods/get`, {
          params: {
            page: this.searchList.searchCondition.page,
            categoryId: this.searchList.searchCondition.categoryId,
            goodsName: this.searchList.searchCondition.goodsName,
            goodsStatus: this.searchList.searchCondition.goodsStatus
          }
        })
        .then(response => {
          this.searchList.pageData.content = response.data.data.data;
          this.searchList.pageData.total = response.data.data.total;
        });
    },
    searchGoods() {
      axios
        .get(`/api/goods/detail`, {
          params: {
            goodsId: this.viewData.goodsId
          }
        })
        .then(response => {
          console.log(response.data.data);
          this.viewData.Detail = response.data.data;
        });
    },
    onDetailBtn(common) {
      let target = this.searchList.targetCar;
      let carList = [];
      if (common === 0) {
        carList = target.map(item => {
          let ind = item.indexOf("&");
          return (item = {
            brandId: item.substring(0, ind),
            capacityName: item.substring(ind + 1)
          });
        });
      }
      if (target.length !== 0 || common) {
        this.$Message.warning("上传中，请稍后...");
        axios
          .put(
            "/api/goods/match_car",
            JSON.stringify({
              goodsId: this.viewData.Detail.goodsId,
              isCommon: common,
              carList: carList
            }),
            {
              headers: {
                Authorization: this.$Cookies.get("Admin-Token"),
                "Content-Type": "application/json"
              }
            }
          )
          .then(response => {
            this.viewData.detailId = "";
            this.viewData.modalDetail = false;
            this.searchManage();
            this.$Message.success("编辑成功!");
          });
      }
    }
  },
  created() {
    axios.get(`/api/goods_category/get`).then(response => {
      this.searchList.categoryList = response.data.data;
    });
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
.all_detail {
  display: flex;
  border-bottom: 1px solid #eee;
  margin: 20px 0;
}
.img_detail {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title_detail {
  align-items: center;
  display: flex;
  margin-right: 10px;
}
.btn_detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}
.btn_detail button {
  margin: 5px;
}
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #0c0c0c !important;
}
</style>