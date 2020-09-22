<template>
  <div class="order-wrapper">
    <header class="header">
      <img alt src="../../assets/images/img-back.png" @click="handleGoHome" />
      我的订单
      <div class="tabs">
        <div
          v-for="(item, index) in tabsList"
          @click="handleTabs(item.index)"
          :class="{active: currTabs == item.index}"
          :key="index"
          class="tabs__item"
        >
          <span class="tabs__item--label">{{item.name}}</span>
        </div>
      </div>
    </header>
    <!-- 订单列表 -->
    <div class="list" :class="{scroll: isScroll}"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="isMoreLoading"
          ref="container"
          infinite-scroll-distance="20">
      <template v-if="ordersList.length > 0">
        <div :key="index" v-for="(item, index) in ordersList">
          <div class="list__title">
            {{item.mall_name}}
            <span class="list__title--time">{{item.order_time}}</span>
          </div>
          <div
            class="list__item"
            v-for="(child, childIndex) in item.good_infos"
            @click="handleOrderDetails(item)"
            :key="childIndex"
          >
            <img alt :src="child.image_url" />
            <div class="list__item--info">
              <p class="list__item--info--value" v-if="item.commission_status == 0">
                已送
                <span>￥{{child.commission}}</span>
              </p>
              <p class="list__item--info--value" v-if="item.commission_status == 1">
                待送
                <span>￥{{child.commission}}</span>
              </p>
              <p class="list__item--info--memo">{{item.commission_desc}}</p>
            </div>
            <div class="list__item--arrow">
              <img alt src="../../assets/images/arrow-right.png" />
            </div>
          </div>
        </div>
      </template>
      <!-- 无订单时 -->
      <main class="container" v-if="ordersList.length <= 0">
        <!-- 没有搜索的页面 -->
        <div class="container-tips" v-if="currTabs !== '2'">
          <img alt src="../../assets/images/img-no-order.png" />
          您还没有订单，快去下单吧
        </div>
        <div class="container-tips" v-if="currTabs === '2'">
          <img alt src="../../assets/images/img-no-order.png" />
          您最近没有到账的订单哦，还请耐心等待
        </div>
      </main>
    </div>
    <back-top target=".order-wrapper .list"></back-top>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapMutations, mapState, mapActions } from 'vuex';
import BackTop from '@/components/back-to-top.vue';

export default {
  name: 'order',
  components: {
    BackTop,
  },
  data() {
    return {
      currTabs: null,
      tabsList: [
        {
          name: '全部',
          index: '0',
        },
        {
          name: '最近下单',
          index: '1',
        },
        {
          name: '最近到账',
          index: '2',
        },
        {
          name: '无送电费',
          index: '3',
        },
      ],
      ordersList: [],
      isScroll: false,
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
      orderType: state => state.personal.orderType,
    }),
  },
  created() {
    this.$nextTick(() => {
      console.log(this.orderType);
      this.currTabs = this.orderType;
    });
  },
  methods: {
    ...mapActions(['postOrderInfoApi']),
    ...mapMutations([
      'set_orderType',
    ]),
    handleGoHome() {
      this.set_orderType('0');
      this.$router.go(-1); // 返回上一层
    },
    // 切换tabs
    handleTabs(index) {
      this.currTabs = index;
      console.log(this.currTabs);
      this.set_orderType(index);
      this.fetchRecomm('isFirst');
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
    // 日期转换
    dateToStr(datetime) {
      const dateTime = new Date(datetime);
      const year = dateTime.getFullYear();
      let month = dateTime.getMonth() + 1;
      let date = dateTime.getDate();
      month = month < 10 ? `'0'${month}` : `${month}`;
      if (date < 10) {
        date = `'0'${date}`;
      }
      return `${year}-${month}-${date}`;
    },
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
    // 获取分页
    fetchRecomm(type) {
      if (type === 'isFirst') {
        this.$set(this.pagination, 'start', 0);
        this.ordersList.length = 0;
      }
      const { start, count } = this.pagination;
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: start * 10,
          count,
          order: 'asc',
        },
        reqparam: {
          type: this.currTabs,
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
              this.ordersList = this.ordersList.concat(result.respparam.orders);
              this.isMoreLoading = false;
            }
          }
        }
      });
      this.noMore = false;
    },
  },
  beforeDestroy() {
    this.set_orderType('0');
  },
};
</script>
<style lang='scss' scoped>
.order-wrapper {
  position: relative;
  display: flex;
  height: 100vh;
  z-index: 9999;
  flex-direction: column;
  position: relative;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 1.973333rem;
    line-height: 1.173333rem;
    background: rgba(255, 255, 255, 1);
    img {
      position: absolute;
      left: 0.4rem;
      top: 0.293333rem;
      width: 0.253333rem;
      height: 0.453333rem;
    }
  }
  .tabs {
    display: flex;
    height: 0.8rem;
    background: #ffffff;
    align-items: center;
    @include e(item) {
      flex: 1;
      font-size: 0.373333rem;
      color: #333333;
      &.active {
        .tabs__item--label {
          padding-bottom: 0.133333rem;
          border-bottom: 0.08rem solid #fc6d53;
        }
      }
    }
  }
  .list::-webkit-scrollbar {
    display: none !important;
  }
  .list {
    height: calc(100vh - 2.24rem);
    margin: 2.24rem 0.4rem 0 0.4rem;
    text-align: left;
    overflow-y: auto;
    @include e(title) {
      margin: 0.266667rem 0;
      color: #5c5c5c;
      font-size: 0.373333rem;
      @include m(time) {
        float: right;
        font-size: 0.32rem;
      }
    }
    @include e(item) {
      display: flex;
      height: 2.133333rem;
      padding-right: 0.266667rem;
      border-radius: 0.213333rem;
      margin-bottom: 0.266667rem;
      background: #ffffff;
      align-items: center;
      img {
        border-radius: 0.213333rem;
        width: 2.133333rem;
        height: 2.133333rem;
      }
      @include m(arrow) {
        img {
          width: 0.186667rem;
          height: 0.333333rem;
        }
      }
      @include m(info) {
        flex: 1;
        padding-left: 0.24rem;
        overflow: hidden;
        @include modifier(memo) {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #5c5c5c;
          font-size: 0.32rem;
          overflow: hidden;
        }
        @include modifier(value) {
          color: #fc6d53;
          font-size: 0.32rem;
          span {
            font-size: 0.533333rem;
          }
        }
      }
    }
    .tips {
      line-height: 1.066667rem;
    }
  }
  .container {
    height: 100%;
    display: flex;
    width: 100%;
    flex: 1;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    .container-tips {
      height: 2.933333rem;
      font-size: 0.373333rem;
      color: #333;
      img {
        margin: 0 auto;
        width: 2.48rem;
        height: 2.133333rem;
        margin-bottom: 0.32rem;
      }
    }
  }
}
</style>
