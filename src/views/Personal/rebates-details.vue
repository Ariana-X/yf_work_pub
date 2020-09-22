<template>
  <div class="rebates-details-wrapper">
    <header class="header">
      <img alt src="../../assets/images/img-back.png" @click="handleGoHome" />
      电费红包充值明细
    </header>
    <main class="container">
      <!-- 时间选择 -->
      <div class="lable-container">
        <div class="lable-time">
          <span @click="handleDate">{{pickerDateStr}}</span>
          <img src="../../assets/images/arrow-down.png" />
        </div>
        <div class="lable-money">充值￥{{total_money}}</div>
      </div>
      <mt-datetime-picker v-model="pickerVisible" class="monthPicker" ref="monthPicker" type="date"
        :endDate="pickerEndDate" @confirm="handleConfirm" />
      <!-- 明细列表 -->
      <div class="lists-container" v-if="rebatesList.length > 0">
        <div class="cell" v-for="item in rebatesList" :key="item.order_id">
          <img v-if="item.type==1" src="../../assets/images/icon-shopping-money.png">
          <img v-if="item.type==2" src="../../assets/images/icon-share-money.png">
          <div class="cell-datetime">
            <p>{{item.type==1?"购物电费金":"分享电费金"}}</p>
            <p class="cell-datetime-label">{{item.order_time}}</p>
          </div>
          <div class="cell-money">
            <p>￥{{item.money?item.money.toFixed(2):0.00}}</p>
            <p class="cell-money-label">{{formatStatus(item.status)}}</p>
          </div>
        </div>
      </div>
      <!-- 无明细 -->
      <div class="nolist-container" v-if="rebatesList.length <= 0">
        <!-- 没有搜索的页面 -->
        <div class="container-tips">
          <img alt src="../../assets/images/img-no-order.png" />
          暂无充值信息
        </div>
      </div>
    </main>
  </div>
</template>

<script>
/* eslint-disable */
  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex";
  import {
    DatetimePicker,
  } from 'mint-ui';

  // @ is an alias to /src
  export default {
    name: 'rebates-details',
    components: {},
    computed: {
      ...mapState({
        reqbase: state => state.app.reqbase,
      })
    },
    data() {
      return {
        rebatesList: [],
        pickerEndDate: new Date(),
        pickerVisible: new Date(),
        pickerDateStr: '',
        date_param: '',
        total_money: 0.0
      };
    },
    methods: {
      ...mapActions([
        'postRechargeRecordsApi'
      ]),
      ...mapMutations([
        'set__loginInfo'
      ]),
      handleGoHome() {
        this.$router.go(-1); // 返回上一层
      },
      handleDate() {
        this.$refs.monthPicker.open();
      },
      handleConfirm() {
        // 时间选择器确定按钮，并把时间转换成需要的时间格式
        var that = this;
        console.log(that.pickerVisible);
        that.formateDate(that.pickerVisible);
        that.fetchRechargeRecords();
      },
      formateDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        this.pickerDateStr = year + '年' + month + '月';
        month = month < 10 ? '0' + month : month;
        this.date_param = year + '-' + month;
      },
      formatStatus(status) {
        if (status == 1) {
          return '充值成功'
        } else if (status == 2) {
          return '充值中'
        } else {
          return '充值失败'
        }
      },
      fetchRechargeRecords() {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
            date: this.date_param
          },
        };
        console.log('【请求参数】', data);
        this.postRechargeRecordsApi(data).then((res) => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            console.log('【接口获取用户充值明细】', result);
            if (result.respbase && result.respbase.status === 'false') {
              this.$toast(result.respbase.returndesc);
            } else if (result.respparam) {
              this.total_money = result.respparam.recharge_records.total_money;
              this.rebatesList = result.respparam.recharge_records.recharge_record_detai;
            }
          }
        });
      },
    },
    mounted() {
      this.formateDate(new Date());
      this.fetchRechargeRecords();
    },
  };

</script>

<style lang="scss" scoped>
  .rebates-details-wrapper {
    height: 100vh;
    position: relative;

    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 1.173333rem;
      line-height: 1.173333rem;
      background: #fff;

      img {
        position: absolute;
        left: 0.4rem;
        top: 0.293333rem;
        width: 0.253333rem;
        height: 0.453333rem;
      }
    }

    .container {
      margin-top: 1.173333rem;
      height: calc(100vh - 1.173333rem);
      width: 100vw;

      /deep/ .mint-datetime-action {
        color: #0C82F1;
        font-size: 0.35rem;
      }

      /deep/ .picker-slot-center:nth-child(3) {
        display: none !important;
      }

      .lable-container {
        width: 100vw;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.32rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        background: #f7f8fb;

        .lable-time {
          width: 2.4rem;
          height: 0.53rem;
          line-height: 0.53rem;
          margin-top: 0.3rem;
          margin-left: 0.38rem;
          background: rgba(255, 255, 255, 1);
          border-radius: 0.3rem;
          float: left;

          img {
            width: 0.19rem;
            height: 0.11rem;
            display: inline-block;
            position: relative;
            top: -0.05rem;
            left: 0.04rem;
          }
        }

        .lable-money {
          margin-right: 0.38rem;
          float: right;
          color: #5c5c5c;
        }
      }

      .lists-container {
        .cell {
          width: 100%;
          height: 1.75rem;
          margin-top: 0.01rem;
          background: #fff;

          img {
            width: 0.8rem;
            float: left;
            position: relative;
            top: 0.48rem;
            left: 0.38rem;
          }

          .cell-datetime {
            text-align: left;
            position: relative;
            top: 0.26rem;
            left: 0.71rem;
            float: left;

            .cell-datetime-label {
              color: #999999;
            }
          }

          .cell-money {
            position: relative;
            right: 0.33rem;
            top: 0.38rem;
            float: right;
            .cell-money-label{
              color: #999999;
              font-size: 0.3rem;
            }
          }
        }

      }

      .nolist-container {
        display: flex;
        flex: 1;
        overflow: hidden;
        align-items: center;
        justify-content: center;

        .container-tips {
          position: fixed;
          font-size: 0.37rem;
          color: #333;
          top: 9.26rem;

          img {
            position: fixed;
            width: 2.33rem;
            height: 2rem;
            margin-bottom: 0.32rem;
            top: 7rem;
          }
        }
      }

    }
  }

</style>
