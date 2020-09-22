<template>
  <div class="home-wrapper">
    <!-- 滚动 -->
    <Share ref="share"></Share>
    <collectPop ref="collect"></collectPop>
    <transition name="fade">
    <div class="bg_white" v-if="isScroll"></div>
    </transition>
    <header class="header">
      <div class="header__status" :class="{black: isScroll}">
        <img
          class="header__status--back"  v-if="isLogin&&!isScroll"
          src="../../assets/images/white-left.png"
          @click="backEvent"
        />
        <img
          class="header__status--back"  v-if="isLogin&&isScroll"
          src="../../assets/images/black-left.png"
          @click="backEvent"
        /> e值惠
        <span class="mine" @click="handleRoutePersonal" v-if="isLogin">我的</span>
        <!-- <button @click="handleCar()">加入购物车</button>
        <button @click="keplerBatchPurchase()">批量加入购物车</button>-->
      </div>

          <!-- <template> -->
          <div class="header__wrapper">
            <transition name="btn">
            <div  v-if="!isScroll" class="header__wrapper--rules" @click="handleRouteRules">
              <img src="../../assets/images/icon-rules.png" alt />规则
            </div>
            </transition>
          </div>
      <div class="container-position">
        <form @submit.prevent action="#">
          <div class="search">
            <img alt src="../../assets/images/img-search.png" />
            <input v-model="searchValue"
            :placeholder="homeHot ? homeHot :'输入商品名或粘贴京东商品标题'" @keyup.13="handleSearch" />
            <img
              v-if="searchValue"
              class="clear-btn"
              @click="handleClearSearch()"
              alt
              src="../../assets/images/img-x.png"
            />
           <div class="search__button"
             @click="handleSearch()">
             <span>搜索</span>
            </div>
          </div>
        </form>
      </div>
    </header>

    <main
      class="container" id="container"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isMoreLoading"
      ref="container"
      infinite-scroll-distance="20"
    >
      <!-- 顶部背景，放在内容区域一起滚动 -->
      <div class="container-top">
         <div class="top" :style="{backgroundColor: bgColor}"></div>
         <div class="bottom" :style="{backgroundColor: bgColor}"></div>
      </div>
      <!-- 顶部banner轮播图 -->
      <mt-swipe :auto="4000" @change="handleChange">
        <mt-swipe-item v-for="(item, index) in swiperBanner" :key="index" >
          <!-- 状态为3 跳转 -->
          <img :src="item.picture" alt=""
           @touchend="end(item)"  @touchmove="move()">
        </mt-swipe-item>
      </mt-swipe>
      <!-- 轮播图下面的标题 -->
      <div class="home-desc">

<!--        <div class="item"><img src="../../assets/images/home/jd.png"
         alt=""><span>商品服务京东提供</span></div>
        <div class="item"><img src="../../assets/images/home/jg.png"
         alt=""><span>同享京东价格优惠</span></div>
        <div class="item"><img src="../../assets/images/home/hb.png"
         alt=""><span>购物赠送电费红包</span></div> -->
      </div>
      <!-- 防疫专区 -->
      <div class="container-hot">
        <div class="container-hot__header">
          <img alt :src="hotObject.picture" />
          <!-- <img alt src="../../assets/images/img-hot2.png" /> -->
          <span class="container-hot__header--label" @click="handleRouteHot">查看全部 ></span>
        </div>
        <div class="container-hot__list">
          <div
            class="container-hot__list--item"
            v-for="(item, index) in hotObject.good_infos"
            @click="handleWindow(item)"
            :key="index"
          >
            <img alt :src="item.image_url" />
            <div class="title">{{item.sku_name}}</div>
            <div class="price">
              <span>￥{{item.wl_price}}</span>
              <span v-if="item.coupons_price > 0" class="quan">券</span>
            </div>
            <div class="profit">
              <span class="profit-label">约送电费</span>
              <span class="profit-value">￥{{item.commission}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- banner -->
      <div class="container-banner">
        <img
          v-for="(item, index) in bannerList"
          :src="item.picture"
          class="container-banner__item"
          :key="index"
          @click="handleRouteBanner(item)"
        />
      </div>
      <!-- 为您推荐 -->
      <p class="container-reco">
        <!-- <img alt src="../../assets/images/img-reco3.png" /> -->
        <img alt :src="recommendObject.picture" />
      </p>
      <!-- 为您推荐列表 -->
      <div class="reco-list">
        <div
          class="reco-list__item"
          @click="handleWindow(item)"
          v-for="(item, index) in recommendObject.good_infos"
          :key="index"
        >
          <img alt :src="item.image_url" />
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
                 <div class="func_button" @click.stop :class="{hide: !isLogin}">
                   <img alt @click="collect(true,item)" v-if="item.bool_collect == false"
                    src="../../assets/images/common/collect.png" />
                   <img alt @click="collect(false,item)" v-if="item.bool_collect == true"
                    src="../../assets/images/common/collected.png" />
                  <img alt src="../../assets/images/common/share.png"
                    @click="generatorShareImage(item)" />
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
               <div class="func_button" @click.stop :class="{hide: !isLogin}">
                 <img alt @click="collect(true,item)" v-if="item.bool_collect == false"
                  src="../../assets/images/common/collect.png" />
                 <img alt @click="collect(false,item)" v-if="item.bool_collect == true"
                  src="../../assets/images/common/collected.png" />
                <img alt src="../../assets/images/common/share.png"
                  @click="generatorShareImage(item)"/>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="tips line-text" v-if="isLoading">
        <span>正在加载中...</span>
      </p>
      <p class="tips line-text" v-if="noMore">
        <span>我是有底线的</span>
      </p>
    </main>
    <back-top target=".home-wrapper .container"></back-top>
    <!-- 二维码蒙层 -->
    <div v-if="isPop" class="pop-container" :key="isPop">
      <div class="red-bag">
        <div class="titl-text">
          <p>请打开“掌上电力”APP</p>
          <p>扫码购买商品，获取赠送电费</p>
        </div>
        <div class="QRcode-box">
          <vue-qr :text="urlData" class="qrcode"></vue-qr>
        </div>
      </div>
      <div style="z-index: 9999;" @click="closePopContainer()">
        <img :src="require('../../assets/images/red-bag-close.png')" />
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
/* eslint-disable */
import { mapMutations, mapState, mapActions } from "vuex";
import Vue from 'vue';
import vueQr from "vue-qr";
import { MessageBox, Swipe, SwipeItem } from "mint-ui";
import { calculationBytes,compareVersion } from "@/libs/utils";
import BackTop from "@/components/back-to-top.vue";
import Share from "@/components/share.vue";
import collectPop from "@/components/collect_pop.vue";
import hybird from "@/utils/hybird";
import html2canvas from 'html2canvas';
import axios from '@/libs/api.request.js';
import $ from 'jquery';
export default {
  name: "home",
  components: {
    BackTop,
    vueQr,
    Share,
    collectPop
  },
  data() {
    return {
      // 防疫专区
      hotObject: {
        goodInfos: []
      },
      // banner
      bannerList: [
      ],
      // swipe-banner
      swiperBanner: [
      ],
      // 为您推荐
      recommendObject: [],
      isScroll: false,
      // 分页参数
      pagination: {
        start: 0,
        count: 10
      },
      // 无限滚动
      isMoreLoading: false,
      noMore: false,
      isLoading: false,
      offsetTop: 0,
      offsetHeight: 0,
      // 二维码
      isPop: false,
      isLogin: false,
      goodsId: "",
      // 背景颜色配置
      bgColor: "#F799BE",
      // 热词
      homeHot: '',
      // 搜索框颜色配置
      searchBtnColor: '#F799BE',
      startX: 0,
      startY: 0,
      boolMove: false,
    };
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase
    }),
    searchValue: {
      get() {
        return this.$store.state.home.searchValue;
      },
      set(value) {
        this.set_searchValue(value);
      }
    },
    routerParams: {
      get() {
        return this.$store.state.home.routerParams;
      },
      set(value) {
        this.set_routerParams(value);
      }
    },
    urlData() {
      return `https://osg-static.sgcc.com.cn/activity/ChannelQrCode/index.html#${this.goodsId}#A10078600#wsgwfer`;
    }
  },
  created() {
    this.$nextTick(() => {
      // 生成唯一uuid
      this.initUUid(this.reqbase.uuid);
      // 初始化系统配置信息
      // this.initSysConfigInfo();
      // 类型检测
      this.checkClient();
      this.handleBridge();
      const dom = this.$refs.container;
      this.offsetTop = dom.offsetTop;
      this.offsetHeight = dom.offsetHeight;
    });
  },
  mounted() {
    var that = this;
    const dom = this.$refs.container;
    dom.addEventListener("scroll", this.handleScroll);
    this.set_searchValue("");
    // this.banScroll();
  },
  methods: {
    ...mapMutations([
      "setUuid",
      "set_osid",
      "set_searchValue",
      "set_searchHot",
      "set_routerParams",
      "set__loginInfo",
      "set__versionno",
    ]),
    ...mapActions(["postHomeInfoApi", "postGoodsApi", "postGoodsUrlApi", 'delCollectApi', 'addCollectApi', 'postConfigInfoApi']),
    move() {
      this.boolMove = true;
      console.log("move");
    },
    end(item) {
      if(!this.boolMove) {
        this.handleRedirect(item);
      }
      this.boolMove = false;
    },
    // 链接跳转
    handleRedirect(item) {
      console.log(item.res);
      if(item.res) {
        // 跳转url
        if(item.res_type === 3) {
          if((item.res.indexOf(".png")>-1)||(item.res.indexOf(".jpg")>-1)){
            // 图片跳转
            this.set_routerParams(item.res);
            this.$router.push({
              name: "common"
            });
          }else {
            // html跳转
            window.location.href = item.res
          }
        } else if(item.res_type === 2) {
          // 商品包跳转
          this.$router.push({
            name: "banner",
            query: {
              id: item.res
            }
          });
          // 开普勒打开链接
        } else if(item.res_type === 4) {
          if(window.isNewSDK){
            const { userid } = this.reqbase;
            const url = item.res;
            hybird.bridge(
              "openKplUrl",
              window.boolJsonVersion?{kplUrl:url, userId:userid}:url,
              respons => {
                console.log(respons);
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      }
    },
    // 轮播图监控
    handleChange(index) {
      this.bgColor = this.swiperBanner[index].tone;
    },
    touchSatrtFunc(evt) {
        // try
        // {
        //     //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等

        //     var touch = evt.touches[0]; //获取第一个触点
        //     var x = Number(touch.pageX); //页面触点X坐标
        //     var y = Number(touch.pageY); //页面触点Y坐标
        //     //记录触点初始位置
        //     this.startX = x;
        //     this.startY = y;

        // } catch (e) {
        //     alert('touchSatrtFunc：' + e.message);
        // }
    },
    banScroll() {
      // var that = this;
      // document.body.ontouchmove = function (e) {
      //       e.preventDefault();
      // };
      // document.addEventListener('touchstart', this.touchSatrtFunc, false);
      //     var _ss = document.getElementById("container");
      //     _ss.ontouchmove = function (ev) {
      //         var _point = ev.touches[0],
      //                 _top = _ss.scrollTop;
      //         // 什么时候到底部
      //         var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight;
      //         // 到达顶端
      //         if (_top === 0) {
      //             // 阻止向下滑动
      //             if (_point.clientY > that.startY) {
      //                 ev.preventDefault();
      //             } else {
      //                 // 阻止冒泡
      //                 // 正常执行
      //                 ev.stopPropagation();
      //             }
      //         } else if (_top === _bottomFaVal) {
      //             // 到达底部
      //             // 阻止向上滑动
      //             if (_point.clientY < that.startY) {
      //                 ev.preventDefault();
      //             } else {
      //                 // 阻止冒泡
      //                 // 正常执行
      //                 ev.stopPropagation();
      //             }
      //         } else if (_top > 0 && _top < _bottomFaVal) {
      //             ev.stopPropagation();
      //         } else {
      //             ev.preventDefault();
      //         }
      //     };
    },
    generatorShareImage(item){
      this.$refs.share.generatorShareImage(item);
    },
    //收藏夹
    collect(bool_collect, item) {
      const { userid } = this.reqbase;
      if(!userid){
        //用户未登录
        this.$toast("先请登录")
        return;
      }
      //收藏
      if (bool_collect) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc'
          },
          reqparam: {
            sku_id: item.sku_id
          }
        };
        this.addCollectApi(data).then(res => {
          const result = JSON.parse(this.$decrypt(res.data));
          console.log(result)
          if (result.respbase && result.respbase.status === 'false') {
            // 收藏达到上限
            if (result.respbase.returncode === '000169') {
              this.$refs.collect.open(false);
            }else{
              this.$toast(result.respbase.returndesc);
            }
          } else if(result.respbase && result.respbase.status === 'true'){
            if(result.respparam.first_time=='true'){
               this.$refs.collect.open(true);
            }else{
               this.$toast('收藏成功');
            }
          item['bool_collect']=true;
          }
        });
      } else {
        //已已取消收藏
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc'
        },
        reqparam: {
          sku_ids: [item.sku_id],
          status:"0"
        }
      };
        this.delCollectApi(data).then(res => {
          const result = JSON.parse(this.$decrypt(res.data));
         if (result.respbase && result.respbase.status === 'false') {
           this.$toast(result.respbase.returndesc);
         } else{
         this.$toast('已取消收藏');
         item['bool_collect']=false;
         }
        });
      }
    },
    handleBridge() {
      hybird.bridge(
        "getSdkInfo",
        {},
        resp => {
          let sdkInfo = {};
          if (resp) {
            sdkInfo = JSON.parse(resp);
          }
          if (sdkInfo.version_no) {
            window.isNewSDK = true;
            this.set__versionno({ versionno: sdkInfo.version_no });
            //添加json版本判断 1.1.2.2 修改与sdk交互 全部传递json格式数据
            window.boolJsonVersion = compareVersion(sdkInfo.version_no,"1.1.2.2");
          } else {
            window.isNewSDK = false;
            window.boolJsonVersion = false;
          }
        },
        error => {
          console.log(error);
        }
      );
      hybird.bridge(
        "getH5ExtraParams",
        {},
        response => {
          let userInfo = {};
          if (response) {
            userInfo = JSON.parse(response);
          }
          if (userInfo.skuId !== undefined && userInfo.skuId !== "") {
            this.isPop = false;
            this.skuId = userInfo.skuId;
            hybird.bridge(
              "removeH5ExtraParam",
              "skuId",
              respons => {
                console.log(respons);
              },
              error => {
                console.log(error);
              }
            );
          }
          this.set__loginInfo({ userid: userInfo.openId });
          this.isLogin = userInfo.openId.length > 0;
          Vue.prototype.boolLogin = this.isLogin;
          this.fetchHomeInfo();
          if (
            this.isLogin &&
            userInfo.skuId !== undefined &&
            userInfo.skuId !== ""
          ) {
            const data = {
              reqbase: this.reqbase,
              reqqrybase: {
                start: 0,
                count: 10,
                order: "asc"
              },
              reqparam: {
                sku_ids: userInfo.skuId,
                type: "1"
              }
            };

            this.postGoodsUrlApi(data).then(res => {
              if (res) {
                const result = JSON.parse(this.$decrypt(res.data));
                if (result.respbase && result.respbase.status === "false") {
                  this.$toast(result.respbase.returndesc);
                } else if (result.respparam) {
                  const [url] = result.respparam.commission_urls;
                  // 判断是否是新sdk
                  console.log(window.isNewSDK);
                  if (window.boolJsonVersion) {
                    const userIds = userInfo.skuId.split(":");
                    hybird.bridge(
                      "openKplUrl",
                      window.boolJsonVersion?{kplUrl:url, userId:userInfo.openId+","+userIds[1]}:url,
                      respons => {
                        console.log(respons);
                      },
                      error => {
                        console.log(error);
                      }
                    );
                  } else {
                    window.location.href = url;
                  }
                }
              }
            });
          } else if (
            this.isLogin === false &&
            userInfo.skuId !== undefined &&
            userInfo.skuId !== ""
          ) {
            this.isPop = true;
          }
        },
        error => {
          //测试使用
          this.set__loginInfo({ userid: '' });
          this.isLogin = false;
          // 设置全局是否登录参数
          Vue.prototype.boolLogin = false;
          // window.isNewSDK = true;
          // window.boolJsonVersion=true;
          this.fetchHomeInfo();
          console.log(error);
        }
      );
    },
    backEvent() {
      hybird.bridge(
        "onEvent",
        "backEvent",
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    },
    // 字节截断
    formatValue(value) {
      const flag = calculationBytes(value, 25);
      if (flag) {
        const res = value.substring(0, 25);
        return `${res}...`;
      }
      return value;
    },
    // 跳转外链
    handleWindow(item) {
      console.log(window.boolJsonVersion)
      // const isLogin = true;
      this.goodsId = item.sku_id;
      const { userid } = this.reqbase;
      const isLogin = userid && userid.length > 0;
      if (isLogin) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: "asc"
          },
          reqparam: {
            sku_ids: item.sku_id,
            type: "1"
          }
        };
        this.postGoodsUrlApi(data).then(res => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            if (result.respbase && result.respbase.status === "false") {
              this.$toast(result.respbase.returndesc);
            } else if (result.respparam) {
              let [url] = result.respparam.commission_urls;
              // 判断是否是新sdk
              console.log(window.isNewSDK)
              if (window.isNewSDK) {
                // 判断是否有券
                if (item.coupons_price <= 0 && item.material_url) {
                  url = item.material_url;
                }
                hybird.bridge(
                  "openKplUrl",
                  window.boolJsonVersion?{kplUrl:url, userId:userid}:url,
                  respons => {
                    console.log(respons);
                  },
                  error => {
                    console.log(error);
                    this.$toast("sdk打开失败");
                  }
                );
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
    handleCar() {
      const fastPurchaseParams = {
        unionID: "1002085632",
        appID: "1954148212",
        skuID: "8338965",
        refer: window.location.href
      };
      hybird.bridge(
        "keplerFastPurchase",
        fastPurchaseParams,
        keplerFastPurchaseResult => {
          console.log(keplerFastPurchaseResult);
          if (keplerFastPurchaseResult === "1") {
            this.$toast("添加成功");
          } else {
            this.$toast("加入购物车失败");
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    // 批量加购
    keplerBatchPurchase() {
      const params = {
        unionID: "1002085632",
        appID: "1954148212",
        skuIDs: "100007926992," + "8535092," + "8708952",
        skuCounts: "1," + "2," + "3",
        refer: window.location.href,
        userId:jgfhjgf+kljlkj
      };
      hybird.bridge(
        "keplerBatchPurchase",
        params,
        keplerBatchPurchaseResult => {
          console.log(keplerBatchPurchaseResult);
          if (keplerBatchPurchaseResult === "1") {
            this.$toast("添加成功");
          } else {
            this.$toast("加入购物车失败");
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    openActivity() {
      const { userid } = this.reqbase;
      alert(window.boolJsonVersion);
      const url = "https://kshop.jd.com/home/a37194b2fed84ac59f10a62e88b58189/index.html";
      hybird.bridge(
        "openKplUrl",
        window.boolJsonVersion?{kplUrl:url, userId:userid}:url,
        respons => {
          console.log(respons);
        },
        error => {
          console.log(error);
          this.$toast("sdk打开失败");
        }
      );
    },
    // 跳转送电费规则
    handleRouteRules() {
      this.$router.push({
        name: "rules"
      });
    },
    // 浏览器唯一标识
    initUUid() {
      if (!this.reqbase.uuid) {
        this.setUuid();
        MessageBox.confirm("", {
          // eslint-disable-next-line
          title: "免责声明",
          message: `<div style='font-weight:400;color:#AFAFAF;font-size:0.37rem;line-height:0.53rem;'>
                        本功能内发生购物相关服务，将由第三方（京东）提供，如有问题请咨询该公司客服
                    </div>`,
          showCancelButton: false,
          confirmButtonClass: "msgBoxConfirmBtn",
          confirmButtonText: "我知道了"
        });
      }
    },
    // 类型检测
    checkClient() {
      this.set_osid();
    },
    // 无限滚动
    loadMore() {
      this.isMoreLoading = true;
      this.isLoading = true;
      this.noMore = false;
      // 获取首页数据

      if (this.pagination.start === 0) {
        console.log("执行");
      } else {
        this.fetchRecomm();
      }
      this.pagination.start++;

    },
    // 获取首页数据
    fetchHomeInfo() {
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: "asc"
        },
        reqparam: {}
      };
      this.postHomeInfoApi(data).then(res => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === "false") {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam) {
            console.log(result.respparam);
            const banners = result.respparam.show_item_package;
            const searchConfig = result.respparam.search_configs;
            // 设置配置banner
            if (banners) {
              if (banners.advertising) {
                this.bannerList = banners.advertising
              }
              if (banners.banner) {
                this.swiperBanner = banners.banner
                if(this.swiperBanner.length > 0) {
                  this.bgColor = this.swiperBanner[0].tone;
                }
              }
              if (banners.goods) {
                const [
                  hotObject,
                  recommendObject
                ] = banners.goods;
                this.hotObject = hotObject;
                this.recommendObject = recommendObject;
              }
            }
            // 设置热词
            if (searchConfig) {
              for (let i = 0; i<searchConfig.length; i++) {
                if(searchConfig[i].location === 1) {
                  this.homeHot = searchConfig[i].search_content;
                }
                if(searchConfig[i].location === 2) {
                  this.set_searchHot(searchConfig[i].search_content);
                  console.log("存储的热词：",this.$store.state.home.searchHot);
                }
              }
            }
            this.isMoreLoading = false;
          }
        }
      });
    },
    // 获取分页
    fetchRecomm() {
      console.log(this.recommendObject.good_infos.length);
      const { start, count } = this.pagination;
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: start * 10,
          count,
          order: "asc"
        },
        reqparam: {
          sku_pkg_id: this.recommendObject.res+"",
        }
      };
      console.log(data);
      this.postGoodsApi(data).then(res => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          console.log(result);
          if (result.respbase && result.respbase.status === "false") {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam && result.respparam.sku_package
           && result.respparam.sku_package.good_infos) {
            if (result.respparam.sku_package.good_infos.length === 0) {
              this.isLoading = false;
              this.noMore = true;
            } else {
              const value = result.respparam.sku_package.good_infos;
              this.$set(
                this.recommendObject,
                "good_infos",
                this.recommendObject.good_infos.concat(value)
              );
              this.isMoreLoading = false;
            }
          }
        }
      });
      this.noMore = false;
    },
    // 页面发生滚动
    handleScroll() {
      const dom = this.$refs.container;
      if (dom.scrollTop > 60) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
      // const scrollTop = window.pageYOffset
      // || document.documentElement.scrollTop || document.body.scrollTop;
      // if (scrollTop > this.offsetTop) {
      //   this.isScroll = true;
      // } else {
      //   this.isScroll = false;
      // }
    },
    // 点击搜索
    handleSearch() {
      this.searchValue = this.searchValue ? this.searchValue : this.homeHot;
      if (this.searchValue) {
        // eslint-disable-next-line
        window._hmt.push(["_trackEvent", "search", "click", this.searchValue]);
        this.$router.push({
          name: "search"
        });
      } else {

        this.$toast("请输入搜索词");
      }
    },
    handleClearSearch() {
      this.set_searchValue("");
    },
    // 我的
    handleRoutePersonal() {
      const { userid } = this.reqbase;
      const isLogin = userid && userid.length > 0;
      // const isLogin = true;
      if (isLogin) {
        this.$router.push({
          name: "personal"
        });
      }
    },
    // 防疫专区
    handleRouteHot() {
      if (this.hotObject.res) {
        // eslint-disable-next-line
        window._hmt.push(["_trackEvent", "防疫专区", "click", "hot"]);
        this.$router.push({
          name: "hot",
          query: {
            id: this.hotObject.res
          }
        });
      } else {
        this.$toast("网络不给力，请检查网络");
      }
    },
    // 跳转banner
    handleRouteBanner(item) {
      // let params = {
      // };
      // if (item.resConfig) {
      //   params = JSON.parse(item.resConfig);
      // }
      // console.log(item);
      // params.title = item.name;
      // console.log(params);
      // this.set_routerParams(params);
      this.$router.push({
        name: "banner",
        query: {
          id: item.res
        }
      });
    },
    closePopContainer() {
      this.isPop = false;
    }
  },
  beforeDestroy() {
    const dom = this.$refs.container;
    dom.removeEventListener("scroll", this.handleScroll);
    hybird.bridge(
      "removeH5ExtraParam",
      "sku_id",
      response => {
        const userInfo = JSON.parse(response);
        this.set__loginInfo({ sku_id: "" });
        console.log(userInfo);
      },
      error => {
        console.log(error);
      }
    );
  }
};
</script>
<style lang="scss" scoped>
.search_border {
  border: 0.042857rem solid #F799BE;
}
.black {
  color: black!important;
}
.bg_white {
  background-color: #fff!important;
  height: 2.5rem;
  width: 100%;
  position: absolute;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
.btn-enter-active, .btn-leave-active {
  transition: all 0.8s ease;
}
.btn-enter, .btn-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.msgBoxConfirmBtn {
  color: #0c82f1;
  font-size: 0.43rem;
  font-weight: 400;
  line-height: 0.86rem;
  font-family: Source Han Sans CN;
}
  .center{
    width: 5.357142rem;
    // height: 11.271428rem;
    background:rgba(228,228,228,1);
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: -100.171428rem;
    z-index: 99999;
    .header{
      width: 100%;
      display: flex;
      box-sizing: border-box;
      background:rgba(247,248,250,1);
      padding: 0.185714rem 0.214285rem;
      img{
        width: 0.342857rem;
        height: 0.342857rem;
        display: inline-block;
        margin-right: 0.285714rem;
      }
    }
    .content{
      width: 4.785714rem;
      // height: 9.685714rem;
      background:rgba(255,255,255,1);
      border-radius:0.142857rem;
      margin:0.285714rem;
      padding: 0.114285rem;
      box-sizing: border-box;
      .logo{
        width: 2.9rem;
        height: 0.528571rem;
        margin: auto;
      }
      .fl{
        background-image: url(../../assets/images/share/fl-bg.png);
        width: 2.028571rem;
        background-size: 100% 100%;
        margin: auto;
        height: 0.585714rem;
        font-size: 0.171428rem;
        span{
        color: #FFF9CD;
        height: 0.585714rem;
        line-height: 0.585714rem;
        text-align: right;
        margin-right: 0.1rem;
        }
      }
      .sku_img{
        width: 2.76rem;
        // height: 3.758571rem;
        margin: auto;
        margin-top: 0.328571rem;
        margin-bottom: 0.2rem;
      }
      .price{
        font-size: 0.342857rem;
        color: #E4393C;
        text-align: left;

      }
      .price-desc{
        font-size: 0.171428rem;
        color: #929292;
        text-align: left;
        margin-top: 0.085714rem;
        margin-bottom: 0.1rem;
      }
      .sku_desc{
        font-size: 0.2rem;
        color: #333;
        text-align: left;
      }
      .code{
        width: 1.571428rem;
        height: 1.571428rem;
        margin: auto;
      }
      .gw_desc{
        font-size: 0.185714rem;
        color: #5C5C5C;
        text-align: center;
      }
    }
  }
.mask{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0,0,0,0.5);
  .share_img{
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 5.171428rem;
    width: 5.357142rem;
  }
  .bottom{
    position: fixed;
    padding: 0.285714rem;
    padding-bottom: 0;
    box-sizing: border-box;
    display: flex;
        flex-direction: column;
        justify-content: space-between;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4.285714rem;
    background:rgba(255,255,255,1);
    border-radius:0.228571rem 0.228571rem 0 0;
    .share_type{
      display: flex;
      justify-content: space-between;
      .item{
        text-align: center;
        font-size: 0.457142rem;
        img{
          margin: auto;
          width: 1.428571rem;
          height: 1.428571rem;
          margin-bottom: 0.2rem;
        }
      }
    }
    .cancel{
      height: 1.1rem;
      line-height: 1.1rem;
      font-size: 0.457142rem;
      border-top: 0.014285rem solid rgba(239,240,240,1);
      ;
    }
  }
}
</style>
<style lang="scss" scoped>
// #app::-webkit-scrollbar {
//   display: none;
// }
// .home-wrapper::-webkit-scrollbar{
//   display: none;
// }
.home-wrapper {
  position: relative;
  // background: #395cc0;
  // overflow: scroll;
  .top-container {
    width: 100vw;
    height: 0.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background: -webkit-gradient(
      linear,
      right top,
      left top,
      from(#ff9659),
      to(#fc6d53)
    );
    background: linear-gradient(-90deg, #ff9659, #fc6d53);
  }
  header {
    position: absolute;
    z-index: 99999;

    .header {
      display: flex;
      flex-direction: column;
      background-image: url("../../assets/images/img-bg2.jpg");
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      transition: height 0.5s ease-in-out 0s;
      // 手机端
      @media screen and(max-width: 767px) {
        height: 10.35rem;
      }
      // 屏幕在768px到1023之间
      @media screen and(min-width: 768px) and (max-width: 1023px) {
        height: 12.35rem;
      }
      // 屏幕在1024px到1199之间
      @media screen and(min-width: 1024px) and (max-width: 1199px) {
        height: 18.35rem;
      }
      // 大屏幕
      @media screen and(min-width: 1200px) {
        height: 18.35rem;
      }
      @include e(status) {
        position: relative;
        width: 100vw;
        height: 1.066667rem;
        line-height: 1.066667rem;
        text-align: center;
        font-size: 0.426667rem;
        color: #fff;
        img {
          position: absolute;
          left: 0.3rem;
          top: 0.293333rem;
          width: 0.271428rem;
          height: 0.485714rem;
        }
        .mine {
          position: absolute;
          right: 0.3rem;
        }
      }
      @include e(wrapper) {
        position: relative;
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        color: #ab0008;
        font-family: Source Han Sans CN;
        & > div {
          display: inline-block;
          position: fixed;
          right: 0rem;
          padding-left: 0.1rem;
          background: radial-gradient(#ffe469, #ffe168, #fd9759);
          border-radius: 0.15rem 0rem 0rem 0.4rem;
          text-shadow: 0rem 0rem 0rem rgba(0, 0, 0, 0.7);
          padding: 0.08rem 0.18rem 0.08rem 0.7rem;
          // 手机端
          // @media screen and(max-width: 767px){
          //   // width: 1.1rem;
          //   // height: 0.76rem;
          //   // line-height: 0.74rem;
          //   // padding: 0.03rem 0.15rem;
          //   padding: 0.08rem 0.18rem 0.13rem 0.7rem;
          //   // font-size: 0.37rem;
          // }
          // // 屏幕在768px到1023之间
          // @media screen and(min-width: 768px) and (max-width:1023px){
          //   width: 1.53rem;
          //   height: .77rem;
          //   line-height: 0.77rem;
          //   font-size: 0.43333rem;
          // }
          // // 屏幕在1024px到1199之间
          // @media screen and(min-width: 1024px){
          //   width: 1.8rem;
          //   height: .87rem;
          //   line-height: 0.87rem;
          //   font-size: 0.473333rem;
          // }
        }
        @include m(rules) {
          z-index: 99;
          top: 3.22rem;
          @media screen and(min-width: 1024px) {
            top: 6.3rem;
          }
          img {
            width: 0.45rem;
            height: 0.4rem;
            position: absolute;
            top: 0.16rem;
            left: 0.2rem;
          }
        }
        @include m(personal) {
          z-index: 99;
          top: 2rem;
          @media screen and(min-width: 1024px) {
            top: 4.9rem;
          }
          img {
            width: 0.45rem;
            height: 0.4rem;
            position: absolute;
            top: 0.16rem;
            left: 0.2rem;
          }
        }
      }
      @include e(label) {
        height: 1.8rem;
        color: #fff;
        font-size: 0.533333rem;
      }
    }
    .container-position {
      margin-top: 0.142857rem;
      width: 100vw;
      position: relative;
      left: 0;
      z-index: 50;
      padding-bottom: 0.142857rem;
      // // 手机端
      // @media screen and(max-width: 767px) {
      //   top: 10.8rem;
      // }
      // // 屏幕在768px到1023之间
      // @media screen and(min-width: 768px) and (max-width: 1023px) {
      //   top: 12.8rem;
      // }
      // // 屏幕在1024px到1199之间
      // @media screen and(min-width: 1024px) and (max-width: 1199px) {
      //   top: 18.8rem;
      // }
      // // 大屏幕
      // @media screen and(min-width: 1200px) {
      //   top: 18.8rem;
      // }
      .search {
        // transition: height 0.5s ease-in-out 0s;
        margin: 0 auto;
        width: 94vw;
        display: flex;
        align-items: center;
        top: 4.266667rem;
        left: 0.4rem;
        height: 0.971428rem;
        line-height: 0.666667rem;
        border: 0.0386rem solid #fc6d53;
        border-radius: 1rem;
        background: #fff;
        img {
          margin-left: 0.32rem;
          width: 0.53rem;
          height: 0.45rem;
        }
        input {
          padding: 0 0.133333rem;
          flex: 1;
          overflow: hidden;
          outline: none;
          font-size: 0.426667rem;
        }
        input::-webkit-input-placeholder {
          color: #cccccc;
        }
        .clear-btn {
          margin-right: 0.32rem;
          width: 0.4rem;
          height: 0.4rem;
        }
        @include e(button) {
          line-height: 0.971428rem;
          height: 0.971428rem;
          padding: 0rem 0.4rem;
          position: relative;
          right: -0.014285rem;
          color: #fff;
          // border-radius: 1rem;
          border-radius: 0 1rem 1rem 0;
          background: rgb(252, 109, 83);
          font-size: 0.426667rem;
        }
      }
    }
  }
  .container::-webkit-scrollbar {
    display: none;
  }
  .container {
    position: relative;
    height: 100vh;
    overflow-y: auto;
    &.scroll {
      height: calc(100vh - 2.666667rem);
    }
    .container-reco {
      width: 100vw;
      img {
        margin: 0.103333rem auto 0.106667rem auto;
        width: 4.3rem;
        height: 1.4rem;
      }
    }
    .container-banner {
      width: 94%;
      margin: 0.2rem auto 0;
      display: flex;
      flex-wrap: wrap;

      justify-content: space-between;
      @include e(item) {
        height: 100%;
        width: 48%;
        // 手机端
        // @media screen and(max-width: 767px){
        //  width: 340px;
        //  height: ;
        // }
        // // 屏幕在768px到1023之间
        // @media screen and(min-width: 768px) and (max-width:1023px){
        //  width: 48%;
        // }
        // // 屏幕在1024px到1199之间
        // @media screen and(min-width: 1024px){
        //  width: 24%;
        // }
        // width: 4.6rem;
        // height: 2.4rem;
        margin-top: 0.2rem;
        border-radius: 0.228571rem;
      }
    }
    .container-top {
      width: 100%;
      height: 6.428571rem;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
      .top {
        width: 100%;
        height: 2.314285rem;
        /* top: 450px; */
        background-color: #F799BE;
        border-radius: 100%;
        margin: 0 auto;
        position: absolute;
        bottom: 0px;
      }
      .bottom {
        width: 100%;
        height: 5.357142rem;
        background-color:  #F799BE;
        position: absolute;
        top: 0px;
      }
    }
    .mint-swipe {
      position: absolute;
      width: 94vw;
      margin: auto;
      left: 0;
      right: 0;
      height: 5.142857rem;
      top: 2.5rem;
      z-index: 99;
      img {
        height: 5.142857rem;
        width: 100%;
        border-radius: 0.228571rem;
      }
    }
    .home-desc {
      color:rgba(252,33,33,1);
      background-image: url(../../assets/images/title2.png);
      background-size: 100% 100%;
      font-size: 0.3rem;
      display: flex;
      height: 0.342857rem;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      width: 94vw;
      margin: 1.515714rem auto 0.285714rem;
      box-sizing: border-box;
      .item {
        display: flex;
        align-items: center;
        align-content: center;
        padding: 0.1rem 0;
        img {
          width: 0.3rem;
          height: 0.3rem;
          margin-right: 0.085714rem;
        }
        span {
          height: 0.3rem;
          line-height: 0.3rem;
          display: inline-block;
        }
      }

    }
    .container-hot::-webkit-scrollbar {
      display: none;
    }
    .container-hot {
      width: 94vw;
      height: 5.2rem;
      background: #fff;
      overflow: hidden;
      border-radius: 0.213333rem;
      margin: 0 auto;
      // // 手机端
      // @media screen and(max-width: 767px) {
      //   margin: 2.066667rem auto 0 auto;
      // }
      // // 屏幕在768px到1023之间
      // @media screen and(min-width: 768px) and (max-width: 1023px) {
      //   margin: 4.066667rem auto 0 auto;
      // }
      // // 屏幕在1024px到1199之间
      // @media screen and(min-width: 1024px) and (max-width: 1199px) {
      //   margin: 10.066667rem auto 0 auto;
      // }
      // // 大屏幕
      // @media screen and(min-width: 1200px) {
      //   margin: 10.066667rem auto 0 auto;
      // }
      @include e(header) {
        position: relative;
        padding: 0.266667rem;
        img {
          width: 1.826667rem;
          height: 0.36rem;
        }
        @include m(label) {
          position: absolute;
          top: 0.266667rem;
          right: 0.266667rem;
          color: #cccccc;
          font-size: 0.32rem;
        }
      }
      @include e(list) {
        display: flex;
        overflow-x: scroll;
        height: 5rem;
        @include m(item) {
          flex: 1;
          overflow: hidden;
          min-width: 2.4rem;
          padding-left: 0.266667rem;
          text-align: left;
          img {
            width: 2.39rem;
            height: 2.39rem;
            background: rgba(255, 255, 255, 1);
            border-radius: 0.213333rem;
          }
          .title {
            margin: 0.16667rem 0 0.066667rem 0;
            // margin: 0.16667rem 0 0 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.32rem;
            color: #333;
          }
          .price {
            // margin-bottom: 0.066667rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.32rem;
            color: #5c5c5c;
            justify-content: space-between;
            align-items: center;
            display: flex;
          }
          .quan {
            width: 0.5rem;
            height: 0.4rem;
            text-align: center;
            line-height: 0.44rem;
            font-size: 0.26rem;
            font-weight: 500;
            color: #fc536f;
            background: url("../../assets/images/bg-litl-quan.png") no-repeat;
            background-size: 100% 100%;
          }
          .profit {
            height: 0.4rem;
            font-size: 0.266667rem;
            color: #fff;
            overflow: hidden;
            background: url("../../assets/images/img-cost.png") no-repeat;
            background-size: 100% 100%;
            justify-content: space-between;
            align-items: center;
            display: flex;
            .profit-label {
              // position: absolute;
              // left: 0.08667rem;
              margin-top: 0.026667rem;
              width: 55%;
              text-align: center;
              color: #fff;
            }
            .profit-value {
              margin-top: 0.026667rem;
              width: 50%;
              text-align: center;
              color: #fc536f;
            }
          }
        }
      }
    }
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
                font-size: 0.26rem;
                display: flex;
                align-items: center;
                color: #fc536f;
                font-weight: 500;
                padding:0rem 0.16rem;
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
            position: absolute;
            left: 0.213333rem;
            right: 0.3rem;
            justify-content: space-between;
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
    background: rgba(0, 0, 0, 0.3);
    .red-bag {
      width: 6.13rem;
      height: 9.09rem;
      margin: 34vw auto 0 auto;
      background: url("../../assets/images/red-bag.png") no-repeat;
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
