/* eslint no-underscore-dangle: 0 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';
import router from './router/index';
import store from './store';
import code from '@/libs/code.js';
import 'mint-ui/lib/style.css';

Vue.use(Mint);
Vue.use(VueClipboard);

Vue.prototype.$decrypt = code.decrypt;
Vue.prototype.boolLogin = false;
Vue.prototype.boolJsonVersion = false;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

// 复制到粘贴板
VueClipboard.config.autoSetContainer = true;

// eslint-disable-next-line
const _hmt = _hmt || [];
// eslint-disable-next-line
window._hmt = _hmt;
/* eslint wrap-iife: [2, "inside"] */
// eslint-disable-next-line
(function() {
  const hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?54ad04c8a4a34a13836cc476a3bb0ed1';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
})();
/**
 * 定义原生使用占位符的方法，格式化数据
 * @author sky
 * @date 2018-07-09
 * @returns {*}
 */
//
