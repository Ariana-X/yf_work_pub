<template>
  <div class="mask" v-show="bool_show"><div class="center">
  <img src="../assets/images/common/collect_success.png" alt="" v-if="collect_result">
  <img src="../assets/images/common/collect_faild.png" alt="" v-if="!collect_result">
  <div class="success" v-if="collect_result">收藏成功</div>
  <div class="success" v-if="!collect_result">收藏提示</div>
  <div class="desc" v-if="collect_result">您可以在e值惠活动中【我的】-【商品收藏夹】查看已收藏的商品。</div>
  <div class="desc" v-if="!collect_result">  您已经收藏100个商品了，请在收藏夹里 酌情删减后再来收藏吧。</div>
  <div class="confirmBtn" @click="close()">我知道啦</div>

  </div></div>
</template>
<script>
export default {
  name: 'collect_pop',
  data() {
    return {
      bool_show: false,
      collect_result: true,
    };
  },
  methods: {
    close() {
      this.bool_show = false;
    },
    open(collectResult) {
      this.bool_show = true;
      this.collect_result = collectResult;
    },
  },
};
</script>
<style lang="scss" scoped>
.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  .center {
    width: 8.171428rem;
    height: 7.642857rem;
    background-color: #fff;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0.285714rem;
    padding: 0.571428rem 0.671428rem 0.914285rem 0.671428rem;
    box-sizing: border-box;
    img{
      width: 1.685714rem;
      height: 1.6rem;
      margin-top: 0.571428rem;
      margin: 0 auto;

    }
    .confirmBtn{
      width: 5.714285rem;
      height: 1.142857rem;
      line-height: 1.142857rem;
      background-image: url(../assets/images/common/btn-bg.png);
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.914285rem;
      text-align: center;
      color: #fff;
       margin: auto;
      font-size: 0.457142rem;
    }
    .desc{
      // margin-bottom: 0.857142rem;
    }
    .success{
      margin-top: 0.357142rem;
      margin-bottom: 0.471428rem;
      color: #333;
      font-size: 0.4rem;
    }
  }
}
</style>
