import {
  postHomeInfo,
  postGoods,
  postSearchGoods,
  postGoodsUrl,
  getUploadInfo,
  getWxConfigInfo,
  addCollect,
  delCollect,
  listCollect,
  postConfigInfo,
} from '@/api/index.js';

export default {
  state: {
    // 搜索
    searchValue: '',
    currTabVal: '0',
    currTab: '综合',
    // banner页
    routerParams: {
      title: '',
      bgcolor: 'fff',
      img: '',
    },
    // 搜索页搜索热词
    searchhot: '',
  },
  getters: {
  },
  mutations: {
    set_searchValue(state, data) {
      state.searchValue = data;
    },
    set_searchHot(state, data) {
      state.searchHot = data;
    },
    set_currTabVal(state, data) {
      state.currTabVal = data;
    },
    set_currTab(state, data) {
      state.currTab = data;
    },
    set_routerParams(state, data) {
      state.routerParams = data;
    },
  },
  // 异步操作
  actions: {
    // 获取首页数据
    postHomeInfoApi(state, account) {
      return new Promise((resolve, reject) => {
        postHomeInfo(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取资源配置信息
    postConfigInfoApi(state, account) {
      return new Promise((resolve, reject) => {
        postConfigInfo(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取商品包下商品
    postGoodsApi(state, account) {
      return new Promise((resolve, reject) => {
        postGoods(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 根据关键字搜索商品
    postSearchGoodsApi(state, account) {
      return new Promise((resolve, reject) => {
        postSearchGoods(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取推广链接
    postGoodsUrlApi(state, account) {
      return new Promise((resolve, reject) => {
        postGoodsUrl(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取oss签名
    getOssInfo(state, account) {
      // console.log(JSON.stringify(account));
      return new Promise((resolve, reject) => {
        getUploadInfo(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取微信签名
    getWxConfigInfoApi(state, account) {
      console.log(JSON.stringify(account));
      return new Promise((resolve, reject) => {
        getWxConfigInfo(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 添加收藏夹
    addCollectApi(state, account) {
      return new Promise((resolve, reject) => {
        addCollect(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 取消收藏夹
    delCollectApi(state, account) {
      return new Promise((resolve, reject) => {
        delCollect(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 收藏夹列表
    listCollectApi(state, account) {
      return new Promise((resolve, reject) => {
        listCollect(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },


  },
};
