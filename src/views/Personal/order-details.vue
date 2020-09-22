<template>
  <div class="order-wrapper">
    <header class="header">
      <img alt=""
           src="../../assets/images/img-back.png"
           @click="handleGoHome" />
      查看订单
    </header>
    <!-- 送电费成功 -->
    <div class="order-status">
      <div class="order-status-title">
        {{formatStatus(orderObject.commission_status)}}
      </div>
      <img alt="" :src="statusImg"/>
    </div>
    <!-- 送电费信息 -->
    <div class="order-info">
      <!-- <p v-if="orderObject.commission_status != 2">送电费金额</p> -->
      <div class="order-info__content">
        <!-- 无送电费 -->
        <div class="order-info__content--value default" v-if="orderObject.commission_status == 2">
          {{orderObject.commission_desc}}
        </div>
          <!-- 送电费成功 -->
        <template v-if="orderObject.commission_status == 0">
          <div class="order-info__content--value">已送
            <span>￥{{orderObject.order_commission}}</span></div>
        </template>
        <template v-if="orderObject.commission_status == 1">
          <div class="order-info__content--value">待送电费
            <span>￥{{orderObject.order_commission}}</span></div>
        </template>
        <span class="order-info__content--tips"
              v-if="orderObject.commission_status == 1">{{orderObject.commission_desc}}</span>
        <span class="order-info__content--tips"
        v-if="orderObject.commission_status == 0">到账时间{{orderObject.commission_time}}</span>
        <div class="btn-blue" @click="viewRule()">查看规则</div>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="order-list">
      <p>订单信息</p>
      <div class="list-item" v-for="(item, index) in orderObject.good_infos" :key="index">
        <img alt="" :src="item.image_url"/>
        <div class="list-item__info">
          <p class="list-item__info--title">{{item.sku_name}}</p>
          <p class="list-item__info--value">
            ￥{{item.sku_pay_price}}
            <span v-if="Number(item.sku_num)>0" style="margin-left:0.2rem; color:#999999;">
              &times; {{item.sku_num}}</span>
            <span class="list-item__info--value--profit"
                  v-if="orderObject.commission_status == 0">
              已送￥{{item.commission}}
            </span>
            <span class="list-item__info--value--profit"
                  v-if="orderObject.commission_status == 1">
              待送电费￥{{item.commission}}
            </span>
          </p>
        </div>
      </div>
      <div class="list-form">
        <div class="list-form__item">商城名称：{{orderObject.mall_name}}</div>
        <div class="list-form__item">订单金额：{{orderObject.pay_price}}元</div>
        <div class="list-form__item">
          订单编号：{{orderObject.order_id}}
          <button class="list-form__item--copyBut" v-clipboard:copy="orderObject.order_id"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"> 复制 </button>
        </div>
        <div class="list-form__item">下单时间：{{orderObject.order_time}}</div>
        <div class="list-form__item">温馨提示：商品配送及物流请联系相关商城</div>
        <div class="list-form__item">联系方式：400-606-5500</div>
      </div>
    </div>
    <div class="footer" v-if="bool_new_sdk">
      <div class="btn-blue" @click="viewOrderDetail()">订单详情</div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { getOrderUrl } from '@/libs/utils';
import hybird from '@/utils/hybird';

const STATUS = {
  0: require('../../assets/images/img-success.png'),
  1: require('../../assets/images/img-process.png'),
  2: require('../../assets/images/img-no-status.png'),
};

// @ is an alias to /src
export default {
  name: 'order-details',
  components: {
  },
  data() {
    return {
      typeStatus: {
        0: '送电费成功',
        1: '送电费进行中',
        2: '无送电费',
      },
      // 是否新的SDK
      bool_new_sdk: window.isNewSDK,
      orderObject: {},
      routeQuery: {},
    };
  },
  filters: {
  },
  computed: {
    statusImg() {
      return STATUS[this.orderObject.commission_status];
    },
    ...mapState({
      reqbase: state => state.app.reqbase,
    }),
  },
  created() {
    this.$nextTick(() => {
      this.getParams();
    });
  },
  methods: {
    // 字节截断
    // formatValue(value) {
    //   const flag = calculationBytes(value, 35);
    //   if (flag) {
    //     const res = value.substring(0, 35);
    //     return `${res}...`;
    //   }
    //   return value;
    // },
    ...mapActions([
      'postOrderDetailsApi',
    ]),
    // 查看返利规则
    viewRule() {
      this.$router.push({
        name: 'rules',
      });
    },
    // 查看订单详情
    viewOrderDetail() {
      const url = getOrderUrl(this.routeQuery.order_id);
      const { userid } = this.reqbase;
      hybird.bridge(
        'openKplUrl',
        window.boolJsonVersion ? { kplUrl: url, userId: userid } : url,
        (respons) => {
          console.log(respons);
        },
        (error) => {
          console.log(error);
        },
      );
    },
    onCopy() {
      this.$toast('复制成功');
    },
    onError() {
      this.$toast('复制失败');
    },
    formatStatus(value) {
      return this.typeStatus[Number(value)];
    },
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
    // 接收传参
    getParams() {
      this.routeQuery = this.$route.query;
      this.fetchOrderDetails();
    },
    fetchOrderDetails() {
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc',
        },
        reqparam: {
          order_id: this.routeQuery.order_id,
        },
      };
      this.postOrderDetailsApi(data).then((res) => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam) {
            this.orderObject = result.respparam.order;
          }
        }
      });
    },
  },
};
</script>
<!-- 公用样式 -->
<style scoped>

  .btn-blue {
    white-space: nowrap;
    width: 1.628571rem;
    height: 0.628571rem;
    line-height: 0.628571rem;
    text-align: center;
    background-image: url(../../assets/images/common/btn-border.png);
    background-size: 100% 100%;
    color: #0C82F1;
    font-size: 0.228571rem;
  }
  .btn-flex-auto {
    flex: 1 0 auto;
  }
</style>

<style lang="scss" scoped>
.order-wrapper {
  display: flex;
  // overflow: hidden;
  height: 100vh;
  flex-direction: column;
  position: relative;
  .header {
    position: absolute;
    top: 0;
    z-index: 9999;
    width: 10rem;
    height: 1.173333rem;
    line-height: 1.173333rem;
    background: white;
    img {
      position: absolute;
      left: 0.4rem;
      top: 0.293333rem;
      width: 0.253333rem;
      height: 0.453333rem;
    }
  }
  .order-status {
    display: flex;
    -webkit-box-align: center;
    top: 1.173333rem;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 9999;
    -ms-flex-align: center;
    align-items: center;
    height: 1.866667rem;
    padding: 0 .4rem;
    line-height: 1.866667rem;
    background: -webkit-gradient(linear, right top, left top, from(#4ba7fc), to(#0c82f1));
    background: linear-gradient(-90deg, #4ba7fc, #0c82f1);
    text-align: left;
    font-size: .426667rem;
    color: #ffffff;
    img {
      width: 1rem;
      max-height: 1.066667rem;
    }
    .order-status-title {
      flex: 1;
      overflow: hidden;
    }
  }
  .order-info {
    margin-top: 3.0rem;
    position: absolute;
    display: flex;
    // margin-left: 0.142857rem;
    flex: none;
    left: 0;
    right: 0;
    z-index: 9999;
    lay: flex;
    flex-direction: column;
    justify-content: center;
    height: 1.866667rem;
    margin-bottom: .266667rem;
    background: #ffffff;
    padding: 0 .4rem;
    color: #333333;
    font-size: .373333rem;
    text-align: left;
    @include e(content) {
      display: flex;
      color: #FC6D53;
      align-items: center;
      justify-content: space-between;
      padding-top: .066667rem;
      font-size: .32rem;
      @include m(value) {
        // width: 4.266667rem;
        &.default {
          color: #333333;
        }
        span {
          font-size: .533333rem;
        }
      }
      @include m(tips) {
        // text-align: right;
        color: #5C5C5C;
        font-size: .32rem;
      }
    }
  }
  .order-list::-webkit-scrollbar{
    display: none;
  }
  .order-list {
    background: #ffffff;
    text-align: left;
    overflow: scroll;
    margin-top: 5rem;
    padding-bottom: 1.242857rem;
    margin-bottom: 1.242857rem;
    > p {
      padding: .266667rem .4rem;
      color: #333333;
      font-size: .32rem;
    }
    .list-item {
      padding: 0 .4rem;
      display: flex;
      height: 2.133333rem;
      border-radius: .213333rem;
      margin-bottom: .266667rem;
      background: #ffffff;
      align-items: center;
      img {
        border-radius: .213333rem;
        width: 2.133333rem;
        height: 2.133333rem;
      }
      @include e(info) {
        flex: 1;
        padding-left: .24rem;
        overflow: hidden;
        @include m(title) {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-bottom: .266667rem;
          color: #5C5C5C;
          font-size: .32rem;
          overflow: hidden;
        }
        @include m(value) {
          position: relative;
          color: #FC6D53;
          font-size: .373333rem;
          @include modifier(profit) {
            position: absolute;
            right: 0.04rem;
            color: #FC6D53;
            font-size: .32rem;
          }
        }
      }
    }
    .list-form {
      margin: 0 .4rem;
      padding-top: .266667rem;
      color: #5C5C5C;
      font-size: .32rem;
      overflow: hidden;
      .list-form__item {
        margin-bottom: .133333rem;
        button {
          text-decoration: none;
          margin-left: .5rem;
          padding-left: .1rem;
          padding-right: .1rem;
          background-color: white;
          border-radius: .1rem;
          font-size: .28rem;
          color: #5C5C5C;
          border: 1px solid #5C5C5C;
        }
      }
    }
  }
  .footer {
    position: fixed;
    background-color: #fff;
    width: 100%;
    height: 1.242857rem;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.4rem;
    box-sizing: border-box;
    box-shadow:-9px -5px 49px 5px rgba(92,92,92,0.19);
  }
}
</style>
