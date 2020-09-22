<template>
  <div class="rebates-wrapper">
    <header class="header">
      <img alt=""
            class="header-img"
            src="../../assets/images/img-back.png"
            @click="handleGoHome" />
        待送电费
      <div class="content">
        <div class="content-info">
          <img alt="" class="content-info-img" src="../../assets/images/img-wait-rebates.png"/>
          <div class="content-value">
            <div class="content-value--cost">
              {{propertyInfo.wait_assets.length > 0 ? propertyInfo.wait_assets : '0.0'}}</div>
            <div class="content-value--label">待送电费（元）</div>
          </div>
        </div>
        <!-- 没有送电费 -->
        <!-- 您还没有待送电费的订单，赶快去下单吧 -->
        <div class="content-tips">
          {{orderList.length > 0 ?
            '购物送的电费将自动充入您的电费红包，快去看看吧' : '您还没有待送电费的订单，赶快去下单吧'}}</div>
      </div>
    </header>
    <div class="list" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="isMoreLoading"
          infinite-scroll-distance="20">
      <template v-for="(item, index) in orderList">
        <div :key="index">
          <div class="list__title">
            {{item.mall_name}}
            <span class="list__title--time">预计{{item.commission_time}}发放
              <img src="../../assets/images/img-btn-help-gray.png" @click="handleHelp">
            </span>
          </div>
          <div class="list__item" v-for="(child, childIndex) in item.good_infos"
                @click="handleOrderDetails(item)"
                :key="childIndex">
            <img alt="" :src="child.image_url" />
            <div class="list__item--info">
              <p class="list__item--info--title">{{child.sku_name}}</p>
              <p class="list__item--info--value">待送电费<span>￥{{child.commission}}</span></p>
            </div>
            <div class="list__item--arrow">
              <img alt="" src="../../assets/images/arrow-right.png"/>
            </div>
          </div>
        </div>
      </template>
      <template v-if="orderList.length > 0">
        <p class="tips line-text" v-if="isLoading"><span>正在加载中...</span></p>
        <p class="tips" v-if="noMore"><span></span></p>
      </template>
    </div>
    <back-top target=".rebates-wrapper .list"></back-top>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';
import { MessageBox } from 'mint-ui';
import BackTop from '@/components/back-to-top.vue';
// import { calculationBytes } from '@/libs/utils';

export default {
  name: 'wait-rebates',
  components: {
    BackTop,
  },
  data() {
    return {
      // 资产信息
      propertyInfo: {
        total_assets: 0.0,
        wait_assets: 0.0,
      },
      orderList: [],
      // 分页参数
      pagination: {
        start: 0,
        count: 10,
      },
      // 无限滚动
      isMoreLoading: false,
      noMore: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase,
      // propertyInfo: state => state.personal.propertyInfo,
    }),
  },
  created() {
    this.$nextTick(() => {
      this.fetchUserData();
    });
  },
  methods: {
    ...mapActions([
      'postUserInfoApi',
      'postOrderInfoApi',
    ]),
    // ...mapMutations([
    //   'set_property',
    //   'set_orderType',
    // ]),
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
    // 字节截断
    // formatValue(value) {
    //   const flag = calculationBytes(value, 35);
    //   if (flag) {
    //     const res = value.substring(0, 35);
    //     return `${res}...`;
    //   }
    //   return value;
    // },
    // 无限滚动
    loadMore() {
      this.isMoreLoading = true;
      this.isLoading = true;
      this.noMore = false;
      setTimeout(() => {
        if (this.pagination.start > 0) {
          this.fetchRecomm();
        } else {
          this.fetchRecomm('isFirst');
        }
        this.pagination.start++;
      }, 0);
    },
    // 获取资产信息
    fetchUserData() {
      const { userid } = this.reqbase;
      const isLogin = userid && userid.length > 0;
      if (isLogin) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
          },
        };
        this.postUserInfoApi(data).then((res) => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            if (result.respbase && result.respbase.status === 'false') {
              this.$toast(result.respbase.returndesc);
            } else if (result.respparam) {
              this.propertyInfo = result.respparam;
            }
          }
        });
      }
    },
    // 获取分页
    fetchRecomm() {
      const { start, count } = this.pagination;
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: start * 10,
          count,
          order: 'asc',
        },
        reqparam: {
          type: '5',
        },
      };
      this.postOrderInfoApi(data).then((res) => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam) {
            if (result.respparam.orders.length === 0) {
              this.isLoading = false;
              this.noMore = true;
            } else {
              this.orderList = this.orderList.concat(result.respparam.orders);
              this.isMoreLoading = false;
            }
          }
          console.log(this.orderList);
        }
      });
      this.noMore = false;
    },
    // 查看订单
    handleOrderDetails(item) {
      this.$router.push({
        name: 'order-details',
        query: {
          order_id: item.order_id,
        },
      });
    },
    // 提示帮助
    handleHelp() {
      const msg = '电费红包预计在您下单后60天内到账，您可以通过在相关平台进行确认收货来缩短到账时间';
      MessageBox({
        title: '温馨提示',
        message: `<div style='font-weight:400;color:#AFAFAF;font-size:0.37rem;line-height:0.53rem;'>
                      ${msg}
                    </div>`,
        showCancelButton: false,
        confirmButtonClass: 'msgBoxConfirmBtn',
        confirmButtonText: '知道了',
      });
    },
  },
};
</script>
<style>
.msgBoxConfirmBtn{
  color: #0C82F1;
  font-size:0.43rem;
  font-weight:400;
  line-height: .86rem;
  font-family:Source Han Sans CN;
}
</style>
<style lang="scss" scoped>
.rebates-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 10rem;
    height: 4.24rem;
    line-height: 1.173333rem;
    background: rgba(255, 255, 255, 1);
    .header-img {
      position: absolute;
      left: 0.4rem;
      top: 0.293333rem;
      width: 0.253333rem;
      height: 0.453333rem;
    }
  }
  .content {
    position: relative;
    margin: .4rem auto 0 auto;
    width: 9.2rem;
    height: 2.666667rem;
    background: url('../../assets/images/img-wrapper.png') no-repeat center;
    .content-tips {
      line-height: .8rem;
      font-size: .32rem;
      color: #ffffff;
    }
    .content-info {
      display: flex;
      align-items: center;
      height: 1.866667rem;
      justify-content: center;
      border-bottom: .013333rem solid #ffffff;
      .content-info-img {
        width: .986667rem;
        height: .746667rem;
      }
      .content-value {
        text-align: center;
        color: #ffffff;
        .content-value--cost {
          line-height: .6rem;
          font-size: .6rem;
        }
        @include m(cost) {
          font-size: .773333rem;
        }
        .content-value--label {
          margin-left: .133333rem;
          font-size: .32rem;
          line-height: .32rem;
        }
      }
    }
  }
  .list::-webkit-scrollbar {
    width: 0 !important;
    display: none !important;
  }
  .list {
    height: calc(100vh - 4.24rem);
    margin: 4.506667rem .4rem 0 .4rem;
    text-align: left;
    overflow-y: auto;
    @include e(title) {
      margin-bottom: .266667rem;
      color: #5C5C5C;
      font-size: .373333rem;
      overflow: hidden;
      @include m(time) {
        float: right;
        font-size: .32rem;
        img {
          width: .3rem;
          display: inline;
        }
      }
    }
    @include e(item) {
      display: flex;
      height: 2.133333rem;
      padding-right: .266667rem;
      border-radius: .213333rem;
      margin-bottom: .266667rem;
      background: #ffffff;
      align-items: center;
      img {
        border-radius: .213333rem;
        width: 2.133333rem;
        height: 2.133333rem;
      }
      @include m(arrow) {
        img {
          width: .186667rem;
          height: .333333rem;
        }
      }
      @include m(info) {
        flex: 1;
        padding-left: .24rem;
        overflow: hidden;
        @include modifier(title) {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          color: #5C5C5C;
          font-size: .32rem;
        }
        @include modifier(value) {
          color: #FC6D53;
          font-size: .32rem;
          margin-top: 0.42rem;
          span {
            font-size: .533333rem;
          }
        }
      }
    }
    .tips {
      line-height: 1.066667rem;
    }
  }
}
</style>
