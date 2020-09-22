import Vue from 'vue';
import Router from 'vue-router';
import RouterConfig from './modules'; // 引入业务逻辑模块;
import { setMetaTitle } from '@/libs/utils';
// import store from '@/store/';
// import hybird from '@/api/hybird';

Vue.use(Router);
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: RouterConfig,
});

// 路由拦截
// router.beforeEach((to, from, next) => {
//   const { userid } = store.state.app.reqbase;
//   // const isLogin = userid.length > 0;
//   // if (to.name === 'personal' && !isLogin) {
//   //   next({
//   //     name: 'login',
//   //   });
//   // } else {
//   //   next();
//   // }
// });

router.beforeEach((to, from, next) => {
  if (to.path) {
    // eslint-disable-next-line
    if (window._hmt) {
      // eslint-disable-next-line
      window._hmt.push(['_trackPageview', to.fullPath]);
    }
  }
  next();
});

router.afterEach((to) => {
  setMetaTitle(to, router.app);
  window.scrollTo(0, 0);
});

/**
 * 重写路由的push方法
 * 解决路由相同
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

export default router;
