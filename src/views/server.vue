<template>
  <div class="server-wrapper">
    <header class="header">
      <img alt=""
           src="../assets/images/img-back.png"
           @click="handleGoHome" />
      服务超时
    </header>
    <main class="container">
      <!-- 没有搜索的页面 -->
      <div class="container-tips">
        <img alt=""
             src="../assets/images/img-server.png" />
        服务器开小差了
      </div>
    </main>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'server',
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
  },
  created() {
    this.$nextTick(() => {
    });
  },
  methods: {
    handleGoHome() {
      this.$router.go(-1); // 返回上一层
    },
  },
};
</script>
<style lang="scss" scoped>
.server-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  .header {
    position: relative;
    width: 10rem;
    height: 1.173333rem;
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
  .container {
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
