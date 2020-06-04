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
                v-model="searchList.searchCondition.orderId"
                clearable
                placeholder="订单编号"
              ></Input>
              <Select
                clearable
                placeholder="支付方式"
                @on-change="searchManage"
                v-model="searchList.searchCondition.payWay"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.payList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                placeholder="订单状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.status"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px;" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
            </Form-item>
          </Form>
          <Modal
            width="400"
            :title="'订单：'+viewData.confirmId+' 发货'"
            :mask-closable="false"
            v-model="viewData.modalConfirm"
            @on-ok="showSend()"
            @on-cancel="searchManage()"
          >
            <Form>
              <Form-item label="快递公司:">
                <Input
                  style="width: 200px;"
                  type="text"
                  :maxlength="10"
                  v-model="viewData.confirm.expressCompany"
                  clearable
                  placeholder="快递公司"
                ></Input>
              </Form-item>
              <Form-item label="快递单号:">
                <Input
                  style="width: 200px;"
                  type="text"
                  :maxlength="30"
                  v-model="viewData.confirm.expressNumber"
                  clearable
                  placeholder="快递单号"
                ></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal
            width="400"
            :title="'订单：'+viewData.confirmId+' 取消确认'"
            :mask-closable="false"
            v-model="viewData.modalCancel"
            @on-ok="cancelBtn()"
            @on-cancel="searchManage()"
          >
            <p>是否取消该订单？</p>
          </Modal>
          <Modal
            width="300"
            title="确认发货"
            :mask-closable="false"
            v-model="viewData.modalSend"
            @on-ok="confirmBtn()"
          >
            <p>确认快递信息并已发货？</p>
          </Modal>
          <Form-item style="padding-top: 10px;">
            <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
            <Page
              style="padding-top: 10px;"
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
      <Modal title="查看订单详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalInfo">
        <div class="order_info">
          <h3>订单信息</h3>
          <h4>订单号： {{viewData.Info.orderId}}</h4>
          <h4>状态： {{viewData.Info.orderStatusChina}}</h4>
          <h4>订单备注： {{viewData.Info.orderRemarks}}</h4>
          <Row>
            <Col span="10">价格：￥{{viewData.Info.orderPrice}}</Col>
            <Col span="10">类型： {{viewData.Info.payWayChina}}</Col>
          </Row>
          <Row>
            <Col span="10">下单时间： {{viewData.Info.createTime}}</Col>
            <Col span="10">付款时间： {{viewData.Info.payTime}}</Col>
          </Row>
          <Row>
            <Col span="10">发货时间： {{viewData.Info.sendTime}}</Col>
            <Col span="10">完成时间： {{viewData.Info.doneTime}}</Col>
          </Row>
          <!-- 商品信息 -->
          <h3>商品信息</h3>
          <div
            class="order_item"
            v-for="(items,index) in viewData.Info.goodsList"
            :key="items.stockId"
          >
            <h4 class="title">商品 {{index+1}} ：{{items.goodsName}}</h4>
            <Row style="margin-left:30px;">
              <Col span="10">编号：{{items.goodsId}}</Col>
              <Col span="10">规格：{{items.goodsStandards}}</Col>
            </Row>
            <Row style="margin-left:30px;">
              <Col span="10">数量：{{items.goodsQty}}</Col>
              <Col span="10">商品单价：￥{{items.goodsPrice}}</Col>
            </Row>
            <Row style="margin-left:30px;">
              <Col span="10">商品总价：￥{{items.totalPrice}}</Col>
            </Row>
          </div>
          <!-- 用户信息 -->
          <h3>用户信息</h3>
          <Row>
            <Col span="10">姓名： {{viewData.Info.contactName}}</Col>
            <Col span="10">联系方式： {{viewData.Info.contactNumber}}</Col>
          </Row>
          <h4>地址：{{viewData.Info.contactAddress}}</h4>
        </div>
      </Modal>
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
        columns: [
          {
            title: "订单号",
            align: "center",
            key: "orderId"
          },
          {
            title: "状态",
            align: "center",
            width: 80,
            key: "orderStatusChina"
          },
          {
            title: "姓名",
            align: "center",
            key: "contactName"
          },
          {
            title: "手机号",
            align: "center",
            key: "contactNumber"
          },
          {
            title: "详细地址",
            align: "center",
            key: "contactAddress"
          },
          {
            title: "价格",
            width: 120,
            align: "center",
            key: "orderPrice",
            render: (h, params) => {
              return h("div", params.row.orderPrice + " 元");
            }
          },
          {
            title: "支付方式",
            align: "center",
            width: 100,
            key: "payWayChina"
          },
          {
            title: "下单时间",
            align: "center",
            key: "createTime"
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              let arr = [
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
                        this.showInfo(params.row);
                      }
                    }
                  },
                  "查看详情"
                )
              ];
              if (params.row.orderStatus === 1) {
                arr.push(
                  h(
                    "Button",
                    {
                      props: {
                        type: "success",
                        size: "small"
                      },
                      style: {
                        marginRight: "10px"
                      },
                      on: {
                        click: () => {
                          this.showConfirm(params.row);
                        }
                      }
                    },
                    "发货"
                  )
                );
              }
              if (
                params.row.orderStatus === 0 ||
                params.row.orderStatus === 1 ||
                params.row.orderStatus === 2
              ) {
                arr.push(
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.showCancel(params.row);
                        }
                      }
                    },
                    "取消"
                  )
                );
              }
              return h("div", arr);
            }
          }
        ],
        data: [],
        pageData: {
          content: [],
          pageNum: 0,
          numberOfElements: 0,
          total: 0,
          totalPages: 0,
          size: 5
        },
        searchCondition: {
          page: 1,
          size: 5,
          name: "",
          orderId: "",
          status: "all"
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        confirmId: "",
        Info: {},
        confirm: {},
        modalConfirm: false,
        modalSend: false,
        modalCancel: false,
        modalInfo: false,
        payList: [
          {
            value: 0,
            label: "微信支付"
          },
          {
            value: 1,
            label: "钱包支付"
          }
        ],
        statusList: [
          {
            value: 0,
            label: "未付款"
          },
          {
            value: 1,
            label: "待发货"
          },
          {
            value: 2,
            label: "待收货"
          },
          {
            value: 3,
            label: "已完成"
          },
          {
            value: -1,
            label: "已取消"
          },
          {
            value: -2,
            label: "退款处理中"
          },
          {
            value: -3,
            label: "退款申请中"
          }
        ]
      }
    };
  },
  methods: {
    onPageChange(pageNum) {
      this.searchList.searchCondition.page = pageNum;
      this.searchManage();
    },
    showConfirm(row) {
      this.viewData.confirm = {};
      this.viewData.confirmId = row.orderId;
      this.viewData.modalConfirm = true;
    },
    showCancel(row) {
      this.viewData.confirmId = row.orderId;
      this.viewData.modalCancel = true;
    },
    showSend(row) {
      this.viewData.modalSend = true;
    },
    showInfo(item) {
      axios
        .get("/api/order/detail", {
          params: {
            orderId: item.orderId
          }
        })
        .then(response => {
          this.viewData.modalInfo = true;
          this.viewData.Info = response.data.data;
        });
    },
    confirmBtn(value) {
      axios
        .put(
          "/api/order/send",
          qs.stringify({
            orderId: this.viewData.confirmId,
            expressCompany: this.viewData.confirm.expressCompany,
            expressNumber: this.viewData.confirm.expressNumber
          })
        )
        .then(response => {
          this.viewData.confirm = {};
          this.viewData.confirmId = "";
          this.$Message.success("发货成功!");
          this.searchManage();
        });
    },
    cancelBtn(value) {
      axios
        .put(
          "/api/order/cancel",
          qs.stringify({
            orderId: this.viewData.confirmId
          })
        )
        .then(response => {
          this.viewData.confirmId = "";
          this.$Message.success("取消成功!");
          this.searchManage();
        });
    },
    onConfirmBallad() {},
    onModelCancel() {
      this.searchManage();
    },
    searchPageReturn() {
      this.searchList.searchCondition.page = 1;
      this.searchManage();
      this.$Message.success("搜索完成!");
    },
    searchManage() {
      axios
        .get("/api/order/get", {
          params: {
            page: this.searchList.searchCondition.page,
            orderStatus: this.searchList.searchCondition.status,
            orderId: this.searchList.searchCondition.orderId,
            payWay: this.searchList.searchCondition.payWay
          }
        })
        .then(response => {
          console.log(response.data);
          this.searchList.pageData.content = response.data.data.data;
          this.searchList.pageData.pageNum = this.searchList.searchCondition.page;
          this.searchList.pageData.total = response.data.data.total;
        })
        .catch(error => {
          this.$Message.error(error.response.data.msg);
          if (error.response.data.code === 401) {
            this.$store
              .dispatch("LogOut")
              .then(() => {
                this.$router.push({ path: "/login" });
              })
              .catch(err => {
                this.$Message.error(err);
              });
          }
        });
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
</style>
