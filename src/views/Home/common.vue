<template>
  <div class="rules-wrapper">
    <header class="header">
      <img alt=""
           src="../../assets/images/white-left.png"
           @click="handleGoHome" />
    </header>
    <main class="content">
      <img :src="imgUrl" alt="">
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl: '',
    };
  },
  methods: {
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
  },
  mounted() {
    this.imgUrl = this.$store.state.home.routerParams;
    console.log(this.imgUrl);
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
    background: transparent;
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
