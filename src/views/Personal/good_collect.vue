<template>
  <div class="search-wrapper">
    <header class="header">
      <img alt src="../../assets/images/img-back.png" @click="handleGoHome()" class />
      <span class="head">我的收藏</span>
      <span @click="manage()" class="right"
       v-if="good_list.length > 0">{{ bool_manage ? '完成' : '管理' }}</span>
    </header>
    <!-- 搜索结果页面 -->
    <main class="content" :class="{ padding: bool_manage }"
     v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div class="reco-list" v-if="good_list.length > 0 || invalid_sku_infos.length > 0">
        <div class="reco-border" v-for="(item, index) in good_list" :key="index">
          <img :key="index" src="../../assets/images/common/checked.png"
          alt="" class="check" v-if="bool_manage && item.checked == true"
           @click="choseOne(item, index)" />
          <img
            :key="index"
            src="../../assets/images/common/check.png"
            alt=""
            class="check"
            @click="choseOne(item, index)"
            v-if="bool_manage && (item.checked == false || item.checked == undefined)"
          />
          <div class="reco-border__item" :class="{ trx30px: bool_manage }"
              @click="handleWindow(item)">
            <!-- 有效商品 -->
            <template v-if="item.status === '1'">
              <img alt :src="item.image_url" />
              <div class="right">
                <div class="right-content">
                  <span class="right-label" v-if="item.is_jd_sale">自营</span>
                  {{ item.sku_name }}
                </div>
                <!-- 有券样式 -->
                <div class="right-bottom-quan" v-if="item.coupons_price > 0">
                  <div class="coupons-profit">
                    <div class="coupons">领券减{{ item.coupons_price }}元</div>
                    <div class="profit">
                      <span class="profit-label">约送电费</span>
                      <span class="profit-value">￥{{ item.commission }}</span>
                    </div>
                  </div>
                  <div class="new-price-good-num">
                    <div class="new-price">
                      券后价￥
                      <span>{{ item.price_after_discount }}</span>
                    </div>
                    <span class="right-profit-sales">{{ item.good_comment_num }}</span>
                  </div>
                  <div class="wl_price_func_button">
                    <del>￥{{ item.wl_price }}</del>
                    <div class="func_button" :class="{hide:bool_manage}"  @click.stop>
                      <img alt src="../../assets/images/common/del.png"
                      @click="!bool_manage&&addCarOrDel('0', item, index)" />
                      <!--<img alt  v-if="bool_new_sdk == true"
                      @click="!bool_manage&&addCarOrDel('2', item, index)"
                      src="../../assets/images/common/car.png" /> -->
                    </div>
                  </div>
                </div>
                <!-- 无券样式 -->
                <div class="right-bottom" v-if="item.coupons_price <= 0">
                  <div class="price_good_num">
                    <div class="right-cost">￥{{ item.wl_price }}</div>
                    <span class="right-profit-sales">{{ item.good_comment_num }}</span>
                  </div>
                  <div class="right-profit">
                    <!-- <img alt src="../../assets/images/img-profit.png" /> -->
                    <!-- <span class="right-profit-value">约送电费￥{{item.commission}}</span> -->
                    <div class="profit">
                      <span class="profit-label">约送电费</span>
                      <span class="profit-value">￥{{ item.commission }}</span>
                    </div>
                    <div class="func_button" :class="{hide: bool_manage}" @click.stop>
                      <img alt  src="../../assets/images/common/del.png"
                      @click="!bool_manage&&addCarOrDel('0', item, index)" />
                     <!-- <img alt @click="!bool_manage&&addCarOrDel('2', item, index)"
                       v-if="bool_new_sdk == true" src="../../assets/images/common/car.png" /> -->
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 无效商品 -->
            <template v-if="item.status === '0'">
              <div class="invalid_div">
                <img alt :src="item.image_url" class="invalid_good" />
                <img class="img_valid" src="../../assets/images/common/invalid.png" alt="" />
              </div>
              <div class="right">
                <div class="right-content">
                  <span class="right-label" v-if="item.is_jd_sale">自营</span>
                  {{ item.sku_name }}
                </div>
                <!-- 无券样式 -->
                <div class="good-invalid-bottom">
                  <div class="good-invalid">
                    <div class="profit"><span class="profit-label-invalid">已失效</span></div>
                    <div class="func_button" :class="{hide: bool_manage}"
                     @click.stop> <img alt src="../../assets/images/common/del.png"
                    @click="!bool_manage&&addCarOrDel('0', item, index)" /></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!--底部操作栏 -->
      <div class="footer" v-if="bool_manage">
        <div class="tool-left">
          <img src="../../assets/images/common/checked.png" alt=""
           class="check" v-if="check_all" @click="checkAll()" />
          <img src="../../assets/images/common/check.png" alt=""
           class="check" v-if="!check_all" @click="checkAll()" />
          <span class="margin20px">全选</span>
          <div class="center">
          <div class="center-top">合计:
          <span class="red margin20px">￥{{ total_price.toFixed(1) }}</span>
          </div>
          <div class="center-bottom">
          <span>约送电费:</span>
          <span class="red">￥{{ total_commission.toFixed(2).toString === '-0.00'
          ? '0.00' : total_commission.toFixed(2)}}</span>
          </div>
          </div>
        </div>
        <div class="tool-right">
          <img class="del margin20px" @click="batchDel('0')"
           src="../../assets/images/common/del.png" />
<!--          <div class="one-key-car" v-if="bool_new_sdk == true"
           @click="batchAddCar('2')">一键加购({{ wait_car.length }})</div> -->
        </div>
      </div>
      <template v-if="good_list.length > 0">
        <p class="tips line-text" v-if="isLoading"><span>正在加载中...</span></p>
        <p class="tips line-text" v-if="noMore"></p>
      </template>
      <main class="container" v-if="good_list.length <= 0">
        <!-- 没有搜索的页面 -->
        <div class="container-noresult">
          <img src="../../assets/images/img-search-tips.png" />
          没找到收藏的商品，赶紧去收藏吧
        </div>
      </main>
    </main>
    <!-- <back-top target=".search-wrapper .content"></back-top> -->
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import { Indicator } from 'mint-ui';
// import { calculationBytes } from '@/libs/utils';
import hybird from '@/utils/hybird';
// @ is an alias to /src
export default {
  name: 'search',
  components: {},
  data() {
    return {
      // 选中的数组
      checked_list: [],
      // 无效商品选中 只能做删除
      invalid_checked_list: [],
      // 有效商品收藏列表
      good_list: [],
      // 无效商品收藏列表
      invalid_sku_infos: [],
      // 分页参数
      pagination: {
        start: 0,
        count: 10,
      },
      // 总价格
      total_price: 0,
      // 总数量
      total_num: 0,
      //  总返利
      total_commission: 0,
      // 选中所有
      check_all: false,
      // 待删除的商品数组
      wait_del: [],
      // 待加入购物车的商品数组
      wait_car: [],
      // 无限滚动
      busy: false,
      noMore: false,
      isLoading: false,
      // 是否进行管理
      bool_manage: false,
      // 是否新的SDK
      bool_new_sdk: window.isNewSDK,
    };
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase,
    }),
  },
  mounted() {},
  created() {
    this.$nextTick(() => {
      console.log('created');
    });
  },
  methods: {
    // 跳转外链
    handleWindow(item) {
      this.goodsId = item.sku_id;
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
            sku_ids: item.sku_id,
            type: '1',
          },
        };
        this.postGoodsUrlApi(data).then((res) => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            if (result.respbase && result.respbase.status === 'false') {
              this.$toast(result.respbase.returndesc);
            } else if (result.respparam) {
              let [url] = result.respparam.commission_urls;
              // 判断是否是新sdk
              if (window.isNewSDK) {
                // 判断是否有券
                if (item.coupons_price <= 0 && item.material_url) {
                  url = item.material_url;
                }
                hybird.bridge('openKplUrl', window.boolJsonVersion ? { kplUrl: url, userId: userid } : url, (respons) => {
                  console.log(respons);
                }, (error) => {
                  console.log(error);
                });
              } else {
                window.location.href = url;
              }
            }
          }
        });
      } else {
        this.isPop = true;
      }
    },

    // 选中所有
    checkAll() {
      // 初始为0
      this.wait_car = [];
      this.wait_del = [];
      this.total_commission = 0;
      this.total_price = 0;
      this.check_all = !this.check_all;
      // 全部选中
      if (this.check_all === true) {
        for (let i = 0; i < this.good_list.length; i++) {
          this.good_list[i].checked = this.check_all;
          // 状态有效则处理待删除和待添加购物车商品ID集合
          if (this.good_list[i].status === '1') {
            if (this.wait_car.indexOf(this.good_list[i].sku_id) === -1) {
              this.wait_car.push(this.good_list[i].sku_id);
              // 判断是否有券 大于0 为有券
              if (this.good_list[i].coupons_price > 0) {
                this.total_price += Number(this.good_list[i].price_after_discount);
              } else {
                this.total_price += Number(this.good_list[i].wl_price);
              }
              this.total_commission += Number(this.good_list[i].commission);
            }
          }
          if (this.wait_del.indexOf(this.good_list[i].sku_id) === -1) {
            this.wait_del.push(this.good_list[i].sku_id);
          }
        }
      } else {
        // 全部不选中
        for (let i = 0; i < this.good_list.length; i++) {
          this.good_list[i].checked = this.check_all;
        }
      }
      console.log(this.wait_del);
      console.log(this.wait_car);
    },
    // 选中单个
    choseOne(item, index) {
      item.checked = !item.checked;
      this.$set(this.good_list, index, item);
      console.log(item.checked);
      if (item.checked === true) {
        // 有效商品需要处理价格
        if (item.status === '1') {
          if (this.wait_car.indexOf(item.sku_id) === -1) {
            this.wait_car.push(item.sku_id);
            // 判断是否有券 大于0 为有券
            if (item.coupons_price > 0) {
              this.total_price += Number(item.price_after_discount);
            } else {
              this.total_price += Number(item.wl_price);
            }
            this.total_commission += Number(item.commission);
          }
        }
        // 只处理待删除的
        if (this.wait_del.indexOf(item.sku_id) === -1) {
          this.wait_del.push(item.sku_id);
        }
      } else {
        this.wait_del.splice(this.wait_del.indexOf(item.sku_id), 1);
        if (item.status === '1') {
          if (this.wait_car.indexOf(item.sku_id) !== -1) {
            // 判断是否有券 大于0 为有券
            if (item.coupons_price > 0) {
              this.total_price -= Number(item.price_after_discount);
            } else {
              this.total_price -= Number(item.wl_price);
            }

            this.total_commission -= Number(item.commission);
            this.total_commission = (this.total_commission.toFixed(2) + '') === '-0.00' ? 0 : this.total_commission;
            this.total_price = (this.total_price.toFixed(1) + '') === '-0.0' ? 0 : this.total_price;
            this.wait_car.splice(this.wait_car.indexOf(item.sku_id), 1);
          }
        }
      }

      console.log(this.wait_del);
      console.log(this.wait_car);
    },
    // 管理收藏夹
    manage() {
      this.total_commission = 0;
      this.total_num = 0;
      this.total_price = 0;
      this.checked_list = [];
      this.bool_manage = !this.bool_manage;
      this.wait_car = [];
      this.wait_del = [];
      this.check_all = false;
      for (let i = 0; i < this.good_list.length; i++) {
        this.good_list[i].checked = false;
      }
      for (let i = 0; i < this.invalid_sku_infos.length; i++) {
        this.invalid_sku_infos[i].checked = false;
      }
    },
    // 移除收藏夹和添加到购物车
    addCarOrDel(status, item, index) {
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc',
        },
        reqparam: {
          sku_ids: [item.sku_id],
          status,
        },
      };
      this.delCollectApi(data).then((res) => {
        const result = JSON.parse(this.$decrypt(res.data));
        if (result.respbase && result.respbase.status === 'false') {
          this.$toast(result.respbase.returndesc);
        } else if (status === '0') {
          this.$toast('商品已取消收藏');
          this.good_list.splice(index, 1);
        } else {
          // 调用sdk，加入购物车
          this.handleCar(item);
        }
      });
    },
    // 批量删除
    batchDel(status) {
      if (this.wait_del.length === 0) {
        this.$toast('请勾选需要移除收藏的商品');
        return;
      }
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc',
        },
        reqparam: {
          sku_ids: this.wait_del,
          status,
        },
      };
      this.delCollectApi(data).then((res) => {
        const result = JSON.parse(this.$decrypt(res.data));
        if (result.respbase && result.respbase.status === 'false') {
          this.$toast(result.respbase.returndesc);
        } else {
          this.$toast('商品已取消收藏');
          this.good_list = [];
          this.loadMore();
        }
        this.manage();
      });
    },
    // 批量加入购物车
    batchAddCar(status) {
      if (this.wait_car.length === 0) {
        this.$toast('请勾选需要加入购物车的商品');
        return;
      }
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc',
        },
        reqparam: {
          sku_ids: this.wait_car,
          status,
        },
      };
      this.delCollectApi(data).then((res) => {
        const result = JSON.parse(this.$decrypt(res.data));
        if (result.respbase && result.respbase.status === 'false') {
          this.$toast(result.respbase.returndesc);
        } else if (status === '0') {
          this.$toast('商品已成功删除');
        } else {
          // 调用sdk，加入购物车
          this.keplerBatchPurchase();
        }
        this.manage();
        this.fetchGoods();
      });
    },
    // 批量加购
    keplerBatchPurchase() {
      const { userid } = this.reqbase;
      const skuCounts = [];
      for (let i = 0; i < this.wait_car.length; i++) {
        skuCounts.push(1);
      }
      const params = {
        unionID: '1002085632',
        appID: '1954148212',
        skuIDs: this.wait_car.join(','),
        skuCounts: skuCounts.join(','),
        refer: window.location.href,
        userId: userid,
      };
      hybird.bridge(
        'keplerBatchPurchase',
        params,
        (keplerBatchPurchaseResult) => {
          console.log(keplerBatchPurchaseResult);
          if (keplerBatchPurchaseResult === '0') {
            this.$toast('商品已添加到京东商城购物车');
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },
    // 单个加购
    handleCar(item) {
      const { userid } = this.reqbase;
      const fastPurchaseParams = {
        unionID: '1002085632',
        appID: '1954148212',
        skuID: item.sku_id,
        refer: item.material_url,
        userId: userid,
      };
      hybird.bridge(
        'keplerFastPurchase',
        fastPurchaseParams,
        (respons) => {
          if (respons === '0') {
            this.$toast('商品已添加到京东商城购物车');
          }
        },
        (error) => {
          this.$toast(error);
          console.log(error);
        },
      );
    },
    ...mapMutations(['set_searchValue', 'set_currTabVal', 'set_currTab']),
    ...mapActions(['postSearchGoodsApi', 'postGoodsUrlApi', 'delCollectApi', 'addCollectApi', 'listCollectApi']),
    // 搜索商品
    fetchGoods() {
      const { start, count } = this.pagination;
      console.log(start);
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start,
          count,
          order: 'asc',
        },
        reqparam: {},
      };
      this.listCollectApi(data).then((res) => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          console.log(result);
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam && result.respparam.goods_infos) {
            const goodsInfos = result.respparam.goods_infos;
            if (goodsInfos.length === 0) {
              this.isLoading = false;
              this.noMore = true;
            } else {
              this.good_list = this.good_list.concat(goodsInfos);
              this.busy = false;
            }
          }
          console.log(result.respqrybase);
        }
      });
    },
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
    // 无限滚动
    loadMore() {
      this.busy = true;
      this.isLoading = true;
      this.noMore = false;
      console.log(this.good_list.length);
      this.pagination.start = this.good_list.length;
      this.fetchGoods();
    },
  },
  watch: {
    isSearched() {},
    // 销毁前执行
    beforeDestroy() {
      Indicator.close();
    },
  },
};
</script>
<style scoped>
.trx30px {
  transform: translateX(0.4rem);
}
.margin20px {
  margin-right: 0.285714rem;
}
.red {
  color: red;
}
.padding {
  padding-bottom: 1.428571rem;
}
.transaprent{
  opacity: 0;
}
</style>
<style lang="scss" scoped>
.search-wrapper {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 1.173333rem;
    line-height: 1.173333rem;
    background: rgba(255, 255, 255, 1);
    z-index: 100;
    img {
      margin-left: 0.4rem;
      width: 0.253333rem;
      height: 0.453333rem;
      z-index: 2;
    }
    .head {
      display: inline-block;
      width: 100%;
      position: absolute;
      z-index: 0;
    }
    .right {
      position: absolute;
      right: 0.39rem;
      width: 1rem;
      z-index: 12;
    }
  }
  .container {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    .container-noresult {
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
  .content::-webkit-scrollbar {
    display: none;
  }
  .content {
    height: calc(100vh - 1.173333rem);
    overflow-y: auto;
    margin-top: 1.457142rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
    .content-tabs {
      position: fixed;
      top: 1.173333rem;
      left: 0;
      width: 100vw;
      background: #ffffff;
      height: 0.8rem;
      display: flex;
      z-index: 100;
      .content-tabs__tab {
        line-height: 0.8rem;
        width: 33.33333vw;
        font-size: 0.373333rem;
        color: #333;
        &.active {
          color: #fc6d53;
        }
        img {
          margin-left: 0.133333rem;
          display: inline-block;
          width: 0.16rem;
          height: 0.213333rem;
        }
      }
    }
    .reco-list {
      width: 94vw;
      margin: 0 auto;
      .reco-border {
        display: flex;
        align-content: center;
        align-items: center;
        .check {
          position: relative;
          width: 0.571428rem;
          height: 0.571428rem;
        }
        .invalid_div {
          position: relative;
          .invalid_good {
            opacity: 0.6;
          }
          .img_valid {
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            opacity: 1;
            position: absolute;
            width: 1.371428rem;
            height: 1.371428rem;
          }
        }

        @include e(item) {
          width: 100%;
          display: flex;
          margin-bottom: 0.266667rem;
          height: 3.466667rem;
          background: rgba(255, 255, 255, 1);
          border-radius: 0.213333rem;
          text-align: left;
          img {
            width: 3.066667rem;
            height: 3.066667rem;
            border-radius: 0.213333rem;
            margin: 0.2rem;
          }
          .right {
            position: relative;
            padding: 0.266667rem 0.266667rem 0 0.213333rem;
            flex: 1;
            overflow: hidden;
            .right-content {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              font-size: 0.373333rem;
              color: #333;
              .right-label {
                padding: 0.026667rem 0.08rem;
                font-size: 0.266667rem;
                color: #fc6d53;
                border: 1px solid rgba(252, 109, 83, 1);
                border-radius: 0.106667rem;
                &:not(:first-child) {
                  margin-left: 0.133333rem;
                }
              }
            }
            .right-bottom-quan {
              margin-top: 0.16rem;
              font-size: 0.32rem;
              .new-price-good-num {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
              .wl_price_func_button {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                .func_button {
                  display: flex;
                  align-items: baseline;
                  img {
                    width: 0.428571rem;
                    height: 0.428571rem;
                    margin: 0 0 0 0.3rem;
                  }
                }
              }
              .coupons-profit {
                display: flex;
                align-items: center;
                .coupons {
                  font-size: 0.28rem;
                  white-space: nowrap;
                  display: flex;
                  align-items: center;
                  color: #fc536f;
                  font-weight: 500;
                  padding: 0.05rem 0.12rem 0;
                  background: url('../../assets/images/bg-big-quan.png') no-repeat;
                  background-size: 100% 100%;
                }
                .profit {
                  white-space: nowrap;
                  color: #fff;
                  margin-left: 0.4rem;
                  font-size: 0.28rem;
                  height: .44rem;
                  line-height: .44rem;
                  display: inline-flex;
                  .profit-label {
                    padding: 0 0.12rem;
                    text-align: center;
                    color: #fff;
                    background-color: #fc536f;
                    border: 1px solid #fc536f;
                    border-radius: 0.06rem 0 0 0.06rem;
                  }
                  .profit-value {
                    padding: 0 0.12rem;
                    text-align: center;
                    color: #fc536f;
                    border: 1px solid #fc536f;
                    border-radius: 0 0.06rem 0.06rem 0;
                  }
                }
              }
              .new-price {
                // font-size:0.032rem;
                color: #fc6d53;
                clear: left;
                span {
                  font-size: 0.58rem;
                }
              }
              del {
                color: #5c5c5c;
              }
              .right-profit-sales {
                float: right;
                color: #5c5c5c;
                // margin-right: 0.06667rem;
              }
            }
            .good-invalid-bottom {
              position: absolute;
              bottom: 0;
              width: 100%;
              .good-invalid {
                font-size: 0.368571rem;
                align-items: center;
                color: #5c5c5c;
                // font-weight: bold;
                display: flex;
                width: 100%;
                justify-content: space-between;
                img {
                  height: 0.44rem;
                  width: 2.826667rem;
                  border-radius: 0;
                }
                .func_button {
                  display: flex;
                  align-items: baseline;
                  margin-right: 0.5rem;
                  img {
                    width: 0.428571rem;
                    height: 0.428571rem;
                    margin-left: 0.3rem;
                    margin-right: 0;
                  }
                }
              }
            }
            .right-bottom {
              bottom: 0.142857rem;
              /* width: 100%; */
              position: absolute;
              left: 0.213333rem;
              right: 0.3rem;
              justify-content: space-between;
              box-sizing: border-box;
              .price_good_num {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                .right-profit-sales {
                  font-size: 0.32rem;
                }
              }
            }
            .right-cost {
              color: #fc6d53;
              font-size: 0.613333rem;
              margin-top: 0.3rem;
            }
            .right-profit {
              // position: relative;
              display: flex;
              align-items: baseline;
              justify-content: space-between;
              img {
                height: 0.44rem;
                width: 2.826667rem;
                border-radius: 0;
              }
              .func_button {
                display: flex;
                align-items: baseline;
                img {
                  width: 0.428571rem;
                  height: 0.428571rem;
                  margin-left: 0.3rem;
                  margin-right: 0;
                }
              }
              .profit {
                color: #fff;
                font-size: 0.28rem;
                float: left;
                .profit-label {
                  float: left;
                  display: inline-block;
                  width: 1.4rem;
                  height: 0.4rem;
                  line-height: 0.44rem;
                  text-align: center;
                  color: #fff;
                  background-color: #fc536f;
                  border: 1px solid #fc536f;
                  border-radius: 0.06rem 0 0 0.06rem;
                }
                .profit-value {
                  float: left;
                  display: inline-block;
                  width: 1.4rem;
                  height: 0.4rem;
                  line-height: 0.46rem;
                  text-align: center;
                  color: #fc536f;
                  border: 1px solid #fc536f;
                  border-radius: 0 0.06rem 0.06rem 0;
                }
              }
              // .right-profit-value {
              //   position: absolute;
              //   top: 0.016667rem;
              //   left: 0.36rem;
              //   color: #fff;
              //   font-size: 0.32rem;
              // }
              .right-profit-sales {
                // position: absolute;
                // top: 0.026667rem;
                // right: -2.666667rem;
                color: #5c5c5c;
                font-size: 0.32rem;
                float: right;
                margin-right: 0.466667rem;
              }
            }
          }
        }
      }
    }
    .footer {
      position: fixed;
      z-index: 999;
      width: 100%;
      bottom: 0;
      display: flex;
      white-space: nowrap;
      justify-content: space-between;
      padding: 0 0.285714rem;
      box-sizing: border-box;
      font-size: 0.342857rem;
      align-items: center;
      background-color: #fff;
      border-top: 0.01rem solid #d9d9d9;
      .tool-left {
        display: flex;
        align-items: center;
        .check {
          width: 0.571428rem;
          height: 0.571428rem;
          margin-right: 0.142857rem;
        }
        .center {
          display: flex;
          flex-direction: column;
          text-align: left;
          .center-top {
            font-size: 0.4rem;
          }
        }
      }
      .tool-right {
        display: flex;
        align-items: center;
        .del {
          width: 0.428571rem;
          height: 0.428571rem;
        }
        .one-key-car {
          width: 2.285714rem;
          height: 0.714285rem;
          background-image: url(../../assets/images/common/btn-red.png);
          background-size: 100% 100%;
          text-align: center;
          display: flex;
          vertical-align: middle;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
      }
    }
    .tips {
      line-height: 1.066667rem;
    }
  }
  .pop-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.3);
    .red-bag {
      width: 6.13rem;
      height: 9.09rem;
      margin: 34vw auto 0 auto;
      background: url('../../assets/images/red-bag.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      .titl-text {
        padding-top: 3.7rem;
        font-size: 0.37rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 0.53rem;
      }
      .QRcode-box {
        // padding-top: .72rem;
        width: 2.94rem !important;
        height: 2.94rem !important;
        margin: auto;
        .qrcode {
          width: 2.92rem !important;
          height: 2.92rem !important;
        }
      }
    }
    img {
      border: none;
      width: 0.8rem;
      height: 0.8rem;
      margin: 0.53rem auto;
    }
  }
}
</style>
