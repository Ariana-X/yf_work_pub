const loadView = view => () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);

export default [
  {
    path: '/',
    name: 'index',
    meta: {
      keepAlive: true,
      title: 'e值惠',
    },
    component: loadView('Home/index'),
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: 'e值惠',
    },
    component: loadView('Home/search'),
  },
  {
    path: '/hot',
    name: 'hot',
    meta: {
      title: '防疫专区',
    },
    component: loadView('Home/hot'),
  },
  {
    path: '/banner',
    name: 'banner',
    meta: {
      title: '分类',
    },
    component: loadView('Home/banner'),
  },
  {
    path: '/rules',
    name: 'rules',
    meta: {
      keepAlive: true,
      title: '送电费规则',
    },
    component: loadView('Home/rules'),
  },
  {
    path: '/common',
    name: 'common',
    meta: {
      title: '公用页面',
    },
    component: loadView('Home/common'),
  },
  {
    path: '/personal',
    name: 'personal',
    meta: {
      title: '我的',
    },
    component: loadView('Personal/index'),
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '我的订单',
    },
    component: loadView('Personal/order'),
  },
  {
    path: '/order-details',
    name: 'order-details',
    meta: {
      title: '查看订单',
    },
    component: loadView('Personal/order-details'),
  },
  {
    path: '/total-rebates',
    name: 'total-rebates',
    meta: {
      title: '累计已送电费',
    },
    component: loadView('Personal/total-rebates'),
  },
  {
    path: '/wait-rebates',
    name: 'wait-rebates',
    meta: {
      title: '待送电费',
    },
    component: loadView('Personal/wait-rebates'),
  },
  {
    path: '/rebates-details',
    name: 'rebates-details',
    meta: {
      title: '电费红包充值明细',
    },
    component: loadView('Personal/rebates-details'),
  },
  {
    path: '/good_collect',
    name: 'good_collect',
    meta: {
      title: '商品收藏夹',
    },
    component: loadView('Personal/good_collect'),
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     title: '送电费验证',
  //   },
  //   component: loadView('Login/index'),
  // },
  {
    path: '/server',
    name: 'server',
    meta: {
      title: '服务超时',
    },
    component: loadView('server'),
  },
];
