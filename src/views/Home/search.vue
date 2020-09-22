<template>
  <div class="search-wrapper">
  <collectPop ref="collect"></collectPop>
    <header class="header">
      <img alt=""
           src="../../assets/images/img-back.png"
           @click="handleGoHome" />
      <div class="header-input">
        <img alt=""
          src="../../assets/images/img-search-black.png" />
        <input ref="searchInput" v-model="searchValue"
        :placeholder="searchHot ? searchHot :'输入商品名或粘贴京东商品标题'"
          @keyup.13="handleSearch">
        <img v-if="searchValue"
          class="clear-btn" @click="handleClearSearch()"
          alt="" src="../../assets/images/img-x.png"/>
      </div>
      <span @click="handleSearch()">搜索</span>
    </header>
    <!-- 搜索页面 -->
    <div class="content-tabs" v-if="recommendList.length > 0">
      <div class="content-tabs__tab" :class="{active: currTab == tab.name}"
            v-for="(tab, tabIndex) in tabsList"
            @click="handleTabChange(tab)" :key="tabIndex">{{tab.name}}
            <img alt="" src="../../assets/images/img-sort.png"
            v-if="tab.icon && currTabVal!=='2' && currTabVal!=='3'"/>
            <img alt="" src="../../assets/images/img-sort-down.png"
            v-if="tab.icon && currTabVal==='2'"/>
            <img alt="" src="../../assets/images/img-sort-up.png"
            v-if="tab.icon && currTabVal==='3'"/>
      </div>
    </div>
    <!-- 搜索结果页面 -->
    <main class="content" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10">
      <div class="reco-list" v-if="recommendList.length > 0">
        <div class="reco-list__item"
              @click="handleWindow(item)"
              v-for="(item, index) in recommendList"
              :key="index">
          <img alt=""
               :src="item.image_url" />
          <div class="right">
            <div class="right-content">
              <span class="right-label" v-if="item.is_jd_sale">自营</span>
              {{item.sku_name}}
            </div>
            <!-- 有券样式 -->
            <div class="right-bottom-quan" v-if="item.coupons_price > 0">
              <div class="coupons-profit">
                <div class="coupons">领券减{{item.coupons_price}}元</div>
                <div class="profit">
                  <span class="profit-label">约送电费</span>
                  <span class="profit-value">￥{{item.commission}}</span>
                </div>
              </div>
              <div class="new-price-good-num">
              <div class="new-price">
                券后价￥
                <span>{{item.price_after_discount}}</span>
              </div>
              <span class="right-profit-sales">{{item.good_comment_num}}</span>
              </div>
              <div class="wl_price_func_button">
                <del>￥{{item.wl_price}}</del>
                 <div class="func_button" @click.stop  :class="{hide: !boolLogin}">
                   <img alt @click="collect(true,item)" v-if="item.bool_collect == false"
                    src="../../assets/images/common/collect.png" />
                   <img alt @click="collect(false,item)" v-if="item.bool_collect == true"
                    src="../../assets/images/common/collected.png" />
<!--                   <img alt src="../../assets/images/common/share.png"
                    @click="generatorShareImage(item)" /> -->
                 </div>
           </div>
          </div>
            <!-- 无券样式 -->
            <div class="right-bottom" v-if="item.coupons_price <= 0">
              <div class="price_good_num">
              <div class="right-cost">￥{{item.wl_price}}</div>
              <span class="right-profit-sales">{{item.good_comment_num}}</span>
              </div>
              <div class="right-profit">
                <!-- <img alt src="../../assets/images/img-profit.png" /> -->
                <!-- <span class="right-profit-value">约送电费￥{{item.commission}}</span> -->
                <div class="profit">
                  <span class="profit-label">约送电费</span>
                  <span class="profit-value">￥{{item.commission}}</span>
                </div>
               <div class="func_button" @click.stop  :class="{hide: !boolLogin}">
                 <img alt @click="collect(true,item)" v-if="item.bool_collect == false"
                  src="../../assets/images/common/collect.png" />
                 <img alt @click="collect(false,item)" v-if="item.bool_collect == true"
                  src="../../assets/images/common/collected.png" />
<!--                 <img alt src="../../assets/images/common/share.png"
                  @click="generatorShareImage(item)"/> -->
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="recommendList.length > 0">
        <p class="tips line-text" v-if="isLoading"><span>正在加载中...</span></p>
        <p class="tips line-text" v-if="noMore"><span>我是有底线的</span></p>
      </template>
      <main class="container" v-if="recommendList.length <= 0">
        <!-- 没有搜索的页面 -->
        <div class="container-noresult" v-if="isSearched">
          <img src="../../assets/images/img-search-tips.png" />
              没有找到搜索结果
        </div>
      </main>
    </main>
    <back-top target=".search-wrapper .content"></back-top>
    <!-- 二维码蒙层 -->
    <div v-if="isPop" class="pop-container">
      <div class="red-bag">
        <div class="titl-text">
          <p>请打开“网上国网”APP</p>
          <p>扫码购买商品，获取赠送电费</p>
        </div>
        <div class="QRcode-box">
          <vue-qr :text="urlData" class="qrcode"></vue-qr>
        </div>
      </div>
      <div @click="closePopContainer()">
        <img :src="require('../../assets/images/red-bag-close.png')">
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import vueQr from 'vue-qr';
import { Indicator } from 'mint-ui';
// import { calculationBytes } from '@/libs/utils';
import BackTop from '@/components/back-to-top.vue';
import hybird from '@/utils/hybird';
import collectPop from '@/components/collect_pop.vue';
// @ is an alias to /src
export default {
  name: 'search',
  components: {
    BackTop,
    vueQr,
    collectPop,
  },
  data() {
    return {
      tabsList: [{
        name: '综合',
        value: '0',
        icon: false,
      }, {
        name: '价格',
        value: '2',
        value2: '3',
        icon: true,
      }, {
        name: '销量',
        value: '1',
        icon: false,
      }],
      // 搜索结果
      recommendList: [],
      iscurrTabVal: true,
      isSearched: true,
      // 分页参数
      pagination: {
        start: 0,
        count: 10,
      },
      // 无限滚动
      busy: false,
      noMore: false,
      isLoading: false,
      // 二维码
      isPop: false,
      isLogin: true,
      goodsId: '',
      // 搜索热词
      searchHot: this.$store.state.home.searchHot,
    };
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase,
    }),
    searchValue: {
      get() {
        return this.$store.state.home.searchValue;
      },
      set(value) {
        this.set_searchValue(value);
      },
    },
    currTabVal: {
      get() {
        return this.$store.state.home.currTabVal;
      },
      set(value) {
        this.set_currTabVal(value);
      },
    },
    currTab: {
      get() {
        return this.$store.state.home.currTab;
      },
      set(value) {
        this.set_currTab(value);
      },
    },
    // 二维码url
    urlData() {
      return `https://osg-static.sgcc.com.cn/activity/ChannelQrCode/index.html#${this.goodsId}#A10078600#wsgwfer`;
    },
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      console.log('created');
    });
  },
  methods: {
    // 收藏夹
    collect(boolCollect, item) {
      const { userid } = this.reqbase;
      if (!userid) {
        // 用户未登录
        this.$toast('先请登录');
        return;
      }
      // 收藏
      if (boolCollect) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
            sku_id: item.sku_id,
          },
        };
        this.addCollectApi(data).then((res) => {
          const result = JSON.parse(this.$decrypt(res.data));
          console.log(result);
          if (result.respbase && result.respbase.status === 'false') {
            // 收藏达到上限
            if (result.respbase.returncode === '000169') {
              this.$refs.collect.open(false);
            } else {
              this.$toast(result.respbase.returndesc);
            }
          } else if (result.respbase && result.respbase.status === 'true') {
            if (result.respparam.first_time === 'true') {
              this.$refs.collect.open(true);
            } else {
              this.$toast('收藏成功');
            }
            item.bool_collect = true;
          }
        });
      } else {
        // 已已取消收藏
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
            sku_ids: [item.sku_id],
            status: '0',
          },
        };
        this.delCollectApi(data).then((res) => {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else {
            this.$toast('已取消收藏');
            item.bool_collect = false;
          }
        });
      }
    },
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
    // 一键加购
    handleCar(item) {
      const fastPurchaseParams = {
        unionID: '1002085632',
        appID: '1954148212',
        skuID: item.sku_id,
        refer: item.material_url,
      };
      hybird.bridge('keplerFastPurchase', fastPurchaseParams, (respons) => {
        const res = JSON.parse(respons);
        if (res.keplerFastPurchaseResult === 1) {
          console.log('添加成功');
        } else {
          console.log('加入购物车失败');
        }
      }, (error) => {
        console.log(error);
      });
    },
    // 字节截断
    // formatValue(value) {
    //   const flag = calculationBytes(value, 25);
    //   if (flag) {
    //     const res = value.substring(0, 25);
    //     return `${res}...`;
    //   }
    //   return value;
    // },
    ...mapMutations([
      'set_searchValue',
      'set_currTabVal',
      'set_currTab',
    ]),
    ...mapActions([
      'postSearchGoodsApi',
      'postGoodsUrlApi',
      'delCollectApi',
      'addCollectApi',
    ]),
    // 搜索商品
    fetchSearchGoods(type) {
      this.isSearched = false;
      if (type === 'isFirst') {
        this.$set(this.pagination, 'start', 0);
        this.recommendList.length = 0;
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
          key_words: this.searchValue,
          order_field: this.currTabVal,
        },
      };
      console.log(data.reqparam);
      console.log(data.reqqrybase);
      this.postSearchGoodsApi(data).then((res) => {
        this.isSearched = true;
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respqrybase.start) {
            this.$set(this.pagination, 'start', result.respqrybase.start / 10);
          } else {
            this.$set(this.pagination, 'start', 0);
          }
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam && result.respparam.good_infos) {
            if (result.respparam.good_infos.length === 0) {
              this.isLoading = false;
              this.noMore = true;
            } else {
              if (this.recommendList.toString() !== result.respparam.good_infos.toString()) {
                this.recommendList = this.recommendList.concat(result.respparam.good_infos);
              }
              this.busy = false;
            }
          }
          console.log(result.respqrybase);
        }
      });
      this.noMore = false;
    },
    handleTabChange(item) {
      this.searchValue = this.searchValue ? this.searchValue : this.searchHot;
      if (this.searchValue.length > 0) {
        this.isSearched = false;
        this.isLoading = false;
        if (item.icon && this.currTab === item.name && this.currTabVal === item.value) {
          this.set_currTabVal(item.value2);
        } else {
          this.set_currTabVal(item.value);
        }
        this.set_currTab(item.name);
        this.fetchSearchGoods('isFirst');
      } else {
        this.$toast('请输入搜索词');
      }
    },
    handleGoHome() {
      this.set_searchValue(''); // 清空搜索数据
      this.set_currTabVal('0'); // 恢复搜索tab默认值
      this.set_currTab('综合');
      this.$router.go(-1); // 返回上一层
    },
    // 无限滚动
    loadMore() {
      console.log(321212);
      this.busy = true;
      this.isLoading = true;
      this.noMore = false;
      if (this.pagination.start > 0) {
        this.fetchSearchGoods();
      } else {
        this.fetchSearchGoods('isFirst');
      }
      this.pagination.start++;
    },
    // 点击搜索
    handleSearch() {
      this.searchValue = this.searchValue ? this.searchValue : this.searchHot;
      if (this.searchValue.length > 0) {
        // eslint-disable-next-line
        window._hmt.push(['_trackEvent', 'search', 'click', this.searchValue]);
        this.fetchSearchGoods('isFirst');
      } else {
        this.$toast('请输入搜索词');
      }
      this.$refs.searchInput.blur();
    },
    // 清空搜索词
    handleClearSearch() {
      this.set_searchValue('');
    },
    // 关闭二维码弹框
    closePopContainer() {
      this.isPop = false;
    },
  },
  watch: {
    isSearched() {
      if (this.recommendList.length <= 0 && !this.isSearched) {
        Indicator.open({
          text: '正在加载',
        });
      } else {
        Indicator.close();
      }
    },
  },
  // 销毁前执行
  beforeDestroy() {
    this.set_searchValue(''); // 清空搜索数据
    this.set_currTabVal('0'); // 恢复搜索tab默认值
    this.set_currTab('综合');
    Indicator.close();
  },
};
</script>
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
    }
    .header-input {
      display: flex;
      position: absolute;
      left: 0.866rem;
      right: 1.67rem;
      height: 0.88rem;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(240, 240, 240, 1);
      opacity: 0.9;
      border-radius: 0.44rem;
      align-items: center;
      img {
        width: 0.426667rem;
        height: 0.426667rem;
      }
      input {
        flex: 1;
        height: 100%;
        margin-left: 0.266667rem;
        background: rgba(247, 247, 247, 1);
        border-top-right-radius: 0.44rem;
        border-bottom-right-radius: 0.44rem;
        font-size: 0.373333rem;
        color: #333;
        outline: none;
      }
      .clear-btn {
        margin-right: 0.32rem;
        width: 0.4rem;
        height: 0.4rem;
      }
    }
    span {
      position: absolute;
      right: .39rem;
      width: 1rem;
    }
  }
  .content-tabs {
    position: absolute;
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
        color: #FC6D53;
      }
      img {
        margin-left: 0.133333rem;
        display: inline-block;
        width: 0.16rem;
        height: 0.213333rem;
      }
    }
  }
  .container {
    display: flex;
    width: 100%;
    height: 100%;
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
  .content::-webkit-scrollbar{
    display: none;
  }
  .content {
    height: 100vh;
    overflow-y: auto;
    margin-top: 2.23333rem;
    .reco-list {
      width: 94vw;
      margin: 0 auto;
      @include e(item) {
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
            .new-price-good-num{
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }
            .wl_price_func_button{
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              .func_button{
                display: flex;
                align-items: baseline;
                img{
                  width: 0.428571rem;
                  height: 0.428571rem;
                  margin:0 0 0  0.3rem;
                  }
              }
            }
            .coupons-profit {
              display: flex;
              align-items: center;
              .coupons {
                font-size: 0.28rem;
                display: flex;
                align-items: center;
                color: #fc536f;
                font-weight: 500;
                padding: 0.05rem 0.12rem 0;
                background: url("../../assets/images/bg-big-quan.png") no-repeat;
                background-size: 100% 100%;
              }
              .profit {
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
          .right-bottom {
            bottom: 0.142857rem;
            /* width: 100%; */
            position: absolute;
            left: 0.213333rem;
            right: 0.3rem;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            .price_good_num{
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              .right-profit-sales{
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
            .func_button{
              display: flex;
              align-items: baseline;
              img{
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
    background: rgba(0,0,0,0.3);
    .red-bag{
      width: 6.13rem;
      height: 9.09rem;
      margin: 34vw auto 0 auto;
      background: url('../../assets/images/red-bag.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      .titl-text{
        padding-top: 3.7rem;
        font-size:0.37rem;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:0.53rem;
      }
      .QRcode-box{
        // padding-top: .72rem;
        width:2.94rem!important;
        height:2.94rem!important;
        margin: auto;
        .qrcode{
          width: 2.92rem!important;
          height: 2.92rem!important;
        }
      }
    }
    img{
      border: none;
      width: .8rem;
      height: .8rem;
      margin: .53rem auto;
    }
  }
}
</style>
