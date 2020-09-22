<template>
  <div class="personal-wrapper">
    <header>
      <div class="header">
        <div class="header-title">
          <img alt=""
               src="../../assets/images/arrow-left.png"
               @click="handleGoHome" />
          <span>我的</span>
        </div>
        <!-- <div class="header-info">
         <img alt=""
               src="../../assets/images/img-user.png" />
          <span>{{userInfo.telno | formatTel}}</span>
          <span>{{userInfo.telno | formatTel}}</span>
          <div class="header-info-pay">
            <div class="header-info-pay-label">
              <img alt=""
                  src="../../assets/images/icon-pay.png" />
              待充值￥{{propertyInfo.balance ? propertyInfo.balance : '0'}}
            </div>
            <div class="header-info-pay-button" @click="payForElectricity">
              <img alt=""
                  src="../../assets/images/icon-pay-free.png" />
              一键缴电费
            </div>
          </div>
        </div> -->
      </div>
      <div class="payment">
        <div class="payment-info">
          <img src="../../assets/images/img-btn-help.png" class="help-btn"
           @click="handleHelp('1')"/>
          <div class="payment-info__value" @click="handleRouteProfit('total')">
            {{propertyInfo.total_assets ? propertyInfo.total_assets : '0.0'}}
          </div>
          <div class="payment-info__label" @click="handleRouteProfit('total')">
            <img src="../../assets/images/img-profit-all.png" class="left-icon"/>
            累积已送电费
          </div>
        </div>
        <div class="line"></div>
        <div class="payment-info">
          <img src="../../assets/images/img-btn-help.png" class="help-btn"
           @click="handleHelp('2')"/>
          <div class="payment-info__value" @click="handleRouteProfit('wait')">
            {{propertyInfo.wait_assets ? propertyInfo.wait_assets : '0.0'}}
          </div>
          <div class="payment-info__label" @click="handleRouteProfit('wait')">
            <img src="../../assets/images/img-profit-wait.png" class="left-icon"/>
            待送电费
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="menu" @click="handleRouteOrder('0')">
        我的订单
        <div class="menu-route">查看全部 <img alt=""
               src="../../assets/images/arrow-right.png" /></div>
      </div>
      <div class="tab">
        <div class="tab__item"
              v-for="(item, index) in tabsList" :key="index"  @click="handleRouteOrder(item.type)">
         <img v-if="index==2" class="help-btn help-btn2" @click.stop @click="handleHelp('3')"
           src="../../assets/images/img-btn-help.png">
          <img :src="item.img" :class="index==2?'tabitem3-img':'tabitem-img'"/>
          {{item.name}}
        </div>
      </div>
    <!--功能菜单-->
    <div class="func_menu">
      <div class="func_menu_item" v-for="item in func_menu" :key="item.name"
       @click="enterFunc(item.component)">
        <span>{{item.name}}</span>
        <img alt="" src="../../assets/images/arrow-right.png" />
      </div>
    </div>
      <div class="link" @click="handleRedbagDetails">
        电费红包充值明细
        <div class="link-route">
          <img alt=""
               src="../../assets/images/arrow-right.png" />
        </div>
      </div>
    </main>
    <!-- <div class="footer">
      <div class="footer-button" @click="loginOutAccount">退出账号</div>
    </div> -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { MessageBox } from 'mint-ui';

const SELECTIONS = [{
  name: '最近下单',
  img: require('../../assets/images/img-curr-menu.png'),
  type: '1',
}, {
  name: '最近到账',
  img: require('../../assets/images/img-curr-profit.png'),
  type: '2',
}, {
  name: '无送电费',
  img: require('../../assets/images/img-no-profit.png'),
  type: '3',
}];
// @ is an alias to /src
export default {
  name: 'personal',
  components: {
  },
  data() {
    return {
      // 资产信息
      propertyInfo: {
        friend_assets: 0,
        shop_assets: 0,
        total_assets: 0.0,
        wait_assets: 0.0,
      },
      tabsList: SELECTIONS,
      func_menu: [{
        name: '商品收藏夹',
        component: 'good_collect',
      },
      ],
    };
  },
  filters: {
    formatTel(value) {
      const reg = /^(\d{3})\d*(\d{4})$/;
      return value.replace(reg, '$1****$2');
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.app.userInfo,
      reqbase: state => state.app.reqbase,
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
      'postLoginoutApi',
    ]),
    ...mapMutations([
      'loginOut',
      'set_property',
      'set_orderType',
    ]),
    // 回到首页
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
    // 电费红包充值明细
    handleRedbagDetails() {
      this.$router.push({
        name: 'rebates-details',
      });
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
              // this.set_property(this.propertyInfo);
            }
          }
        });
      }
    },
    // 查看我的订单
    handleRouteOrder(tabType) {
      this.set_orderType(tabType);
      this.$router.push({
        name: 'order',
      });
    },
    // 待送电费 累计已送电费
    handleRouteProfit(type) {
      this.$router.push({
        name: `${type}-rebates`,
      });
    },

    // 进入功能菜单
    enterFunc(compnent) {
      this.$router.push({
        name: compnent,
      });
    },
    // loginOutAccount() {
    //   this.$messagebox.confirm('确定退出账号？', {
    //     title: '提示',
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   }).then((action) => {
    //     if (action === 'confirm') {
    //       // 确认的回调
    //       this.postLoginOutAsync();
    //     }
    //   }).catch((err) => {
    //     if (err === 'cancel') {
    //       // 取消的回调
    //       this.$toast('功能正在研发中，敬请期待');
    //     }
    //   });
    // },
    payForElectricity() {
      this.$toast('此功能暂未开放');
    },
    // 温馨提示
    handleHelp(val) {
      let msg = '';
      let flg = false;
      let confirmBtnText = '知道了';
      if (val === '1') {
        msg = '通过购物送电费活动已获得的电费红包总额';
      } else if (val === '2') {
        msg = '当前尚未到账的电费红包总额，您可以通过在相关平台进行确认收货来缩短到账时间';
      } else {
        msg = '赠品及发生退换货等特殊交易情况将无法获得电费红包，详情见活动规则';
        flg = true;
        confirmBtnText = '查看规则';
      }
      MessageBox.confirm('', {
        // eslint-disable-next-line
        title: '温馨提示',
        message: `<div style='font-weight:400;color:#AFAFAF;font-size:0.37rem;line-height:0.53rem;'>
                      ${msg}
                    </div>`,
        showCancelButton: flg,
        confirmButtonClass: 'msgBoxConfirmBtn',
        cancelButtonClass: 'msgBoxCancelBtn',
        confirmButtonText: confirmBtnText,
        cancelButtonText: '关闭',
      }).then((action) => {
        if (action === 'confirm') { // 确认的回调
          if (val === '3') {
            this.$router.push({
              name: 'rules',
            });
          }
        }
      });
    },
    postLoginOutAsync() {
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
      this.postLoginoutApi(data).then((res) => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else {
            this.$router.push({
              name: 'index',
            });
            this.loginOut();
          }
        }
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
.msgBoxCancelBtn{
  font-size:0.43rem;
  font-weight:400;
  line-height: .86rem;
  font-family:Source Han Sans CN;
}
</style>
<style lang="scss" scoped>
.personal-wrapper {
  // height: 100vh;
  position: relative;
  overflow: hidden;
  header {
    height: 5.2rem;
    .header {
      height: 3.8rem;
      background: linear-gradient(
        -90deg,
        rgba(75, 167, 252, 1),
        rgba(12, 130, 241, 1)
      );
      .header-title {
        position: relative;
        height: 1.173333rem;
        line-height: 1.173333rem;
        color: #ffffff;
        img {
          position: absolute;
          left: 0.3rem;
          top: 0.293333rem;
          width: 0.546667rem;
          height: 0.546667rem;
        }
      }
      .header-info {
        position: relative;
        margin: 0.266667rem 0.133333rem 0 0.4rem;
        font-size: 0.426667rem;
        color: #ffffff;
        text-align: left;
        img {
          display: inline-block;
          margin-right: 0.2rem;
          width: 0.373333rem;
          height: 0.426667rem;
        }
        .header-info-pay {
          position: absolute;
          top: 0;
          right: .4rem;
        }
        .header-info-pay-label {
          font-size: .32rem;
          margin-bottom: .266667rem;
          img {
            width: .826667rem;
            height: .533333rem;
            display: inline-block;
            vertical-align: middle;
            margin-right: 0;
          }
        }
        .header-info-pay-button {
          margin: 0 auto;
          width: 2.8rem;
          line-height: .666667rem;
          height: .666667rem;
          background: linear-gradient(0deg,rgba(255,102,34,1),rgba(242,183,43,1));
          box-shadow:0px 4px 10px 0px rgba(0, 0, 0, 0.2);
          border-radius: 0.333333rem;
          align-items: center;
          color: #ffffff;
          font-size: 0.373333rem;
          img {
            width: .466667rem;
            height: .426667rem;
            margin-left: 0.2rem;
            display: inline-block;
            vertical-align: middle;
            margin-right: 0;
          }
        }
      }
    }
    .payment {
      display: flex;
      width: 9.2rem;
      background: #ffffff;
      height: 2.666667rem;
      margin: -1.333333rem auto 0 auto;
      border-radius: 0.213333rem;
      align-items: center;
      position: relative;
      .line {
        width: 1px;
        height: 2rem;
        top: 0;
        left: 0;
        margin: auto;
        right: 0;
        z-index: 999999;
        bottom: 0;
        position: absolute;
        background:rgba(221,221,221,1);
      }
      .payment-info {
        flex: 1;
        overflow: hidden;
        .help-btn {
          width: .37rem;
          display: inline-block;
          position: relative;
          top: -0.05rem;
          right: -1.6rem;
        }
        @include e(value) {
          font-size: 0.773333rem;
          color: #fc6d53;
          margin-top: -.5rem;
        }
        @include e(label) {
          color: #5c5c5c;
          font-size: 0.373333rem;
          .left-icon {
            width: 0.533333rem;
            height: 0.4rem;
            display: inline-block;
          }
        }
      }
    }
  }
  main {
    margin-top: 0.266667rem;
    .menu {
      position: relative;
      padding: 0 0.4rem;
      line-height: 1.066667rem;
      height: 1.066667rem;
      background: rgba(255, 255, 255, 1);
      text-align: left;
      font-size: 0.426667rem;
      color: #333333;
      border-bottom: 1px solid #eff0f0;
      .menu-route {
        position: absolute;
        top: 0;
        right: 0.4rem;
            font-family: Source Han Sans CN;
            font-size: 0.32rem;
            color: rgba(204,204,204,1);
        img {
          display: inline-block;
          width: 0.173333rem;
          height: 0.306667rem;
        }
      }
    }
    .tab {
      display: flex;
      background: #ffffff;
      align-items: center;
      justify-content: center;
      @include e(item) {
        overflow: hidden;
        flex: 1;
        height: 1.866667rem;
        font-size: 0.3rem;
        color: #5c5c5c;
        .help-btn {
          width: .37rem;
          position: absolute;
          right: 0;
          margin: 0.1rem 0.3rem 0 0;
        }
        .tabitem-img {
          margin: 0.4rem auto 0.213333rem auto;
          width: 0.466667rem;
          height: 0.533333rem;
        }
        .tabitem3-img {
          margin: 0.4rem auto 0.213333rem auto;
          width: 0.466667rem;
          height: 0.533333rem;
        }
      }

    }
    .link {
      position: relative;
      padding: 0 0.4rem;
      margin-top: 0.266667rem;
      height: 1.066667rem;
      line-height: 1.066667rem;
      background: #ffffff;
      text-align: left;
      font-size: 0.426667rem;
      color: #333333;
      .link-route {
        position: absolute;
        top: 0.32rem;
        right: 0.4rem;
        img {
          width: 0.173333rem;
          height: 0.306667rem;
        }
      }
    }
	.func_menu{
    margin-top: 0.285714rem;
		.func_menu_item{
			width: 100%;
			height: 1.142857rem;
			background-color: #fff;
			display: flex;
			padding: 0 0.4rem;
			box-sizing: border-box;
			font-size: 0.457142rem;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      line-height: 1.142857rem;
      img{
        width: 0.185714rem;
        height: 0.328571rem;
      }
   }
   }
}
  // .footer {
  //   position: absolute;
  //   bottom: 0;
  //   width: 100%;
  //   .footer-button {
  //     width: 100%;
  //     height: 1.333333rem;
  //     line-height: 1.333333rem;
  //     color: #ffffff;
  //     font-size: .426667rem;
  //     background: linear-gradient(
  //       -90deg,
  //       rgba(75, 167, 252, 1),
  //       rgba(12, 130, 241, 1)
  //     );
  //   }
  // }
}
</style>
