<template>
  <div class="rules-wrapper">
    <header class="header">
      <img alt=""
           src="../../assets/images/white-left.png"
           @click="handleGoHome" />
      活动规则
    </header>
    <main class="content">
      <img src="../../assets/images/img/2.png" alt="">
      <img src="../../assets/images/img/1.png" alt="">
      <img src="../../assets/images/img/3.png" alt="">
      <img src="../../assets/images/img/4.png" alt="">
    </main>
  </div>
</template>
<script>
export default {
  methods: {
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
  },
};
</script>
<style lang="scss" scoped>
.rules-wrapper {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    z-index: 9999;
    position: absolute;
    left: 0;
    color: #fff;
    top: 0;
    width: 100vw;
    height: 1.173333rem;
    line-height: 1.173333rem;
    background: rgb(29,140,245);;
    img {
      position: absolute;
      left: .4rem;
      top: .293333rem;
      width: 0.253333rem;
      height: 0.453333rem;
    }
  }
}
 .content {
    // height: calc(100vh - 1.173333rem);
    overflow-x: hidden;
    position: relative;
    overflow-y: auto;
    // background: url(../../assets/images/rules.png);
    // background-size: 100% 100%;
    font-family: SourceHanSansSC-Regular;
 }
</style>
