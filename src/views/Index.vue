<template>
  <div class="mt-wrapper">
    <router-view />
    <mt-tabbar v-model="selectedTabbar">
      <template v-for="(item, index) in tabbarData">
        <mt-tab-item :id="item.router" :key="index">
          <img slot="icon" src="" alt="">
          {{item.label}}
        </mt-tab-item>
      </template>
    </mt-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'index',
  data() {
    return {
      tabbarData: [{
        label: '首页',
        router: 'home',
        icon: '',
      }, {
        label: '我的',
        router: 'personal',
        icon: '',
      }],
      selectedTabbar: '',
    };
  },
  components: {
  },
};
</script>
<style lang="scss">
.mt-wrapper {
  .mint-tabbar {
    .mint-tab-item.is-selected {
      background-color: initial;
    }
  }
}
</style>
