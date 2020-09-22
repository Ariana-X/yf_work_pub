<template>
  <!-- 回顶部 -->
  <div class="content-back" @click="handleBackTop" v-if="isShow">
    <img alt="" src="../assets/images/img-back-top.png"/>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'back-top',
  components: {},
  data() {
    return {
      isShow: false,
      el: null,
      container: null,
    };
  },
  props: {
    target: [String],
  },
  methods: {
    init() {
      this.container = document;
      this.el = document.documentElement;
      if (this.target) {
        this.el = document.querySelector(this.target);
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`);
        }
        this.container = this.el;
      }
    },
    // 点击图片回到顶部方法，加计时器是为了过渡顺滑
    handleBackTop() {
      const that = this;
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.scrollTop / 5);
        this.container.scrollTop = that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      const { scrollTop } = this.container;
      this.scrollTop = scrollTop;
      if (this.scrollTop > 60) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
  },
  mounted() {
    this.init();
    this.container.addEventListener('scroll', this.scrollToTop);
  },
  destroyed() {
    this.container.removeEventListener('scroll', this.scrollToTop);
  },
};
</script>
<style lang="scss">
.content-back {
  position: fixed;
  bottom: .266667rem;
  right: .266667rem;
  img {
    width: 1.426667rem;
    height: 1.426667rem;
  }
}
</style>
