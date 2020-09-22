import {
  postOrderInfo,
  postUserInfo,
  postOrderDetails,
  postRechargeRecords,
} from '@/api/index.js';

export default {
  state: {
    propertyInfo: null,
    // 订单类型
    orderType: null,
  },
  getters: {},
  mutations: {
    set_property(state, data) {
      state.propertyInfo = data;
    },
    set_orderType(state, data) {
      state.orderType = data;
    },
  },
  // 异步操作
  actions: {
    // 获取我的列表数据
    postOrderInfoApi(state, account) {
      return new Promise((resolve, reject) => {
        postOrderInfo(account).then((res) => {
          const {
            data,
          } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取用户资产信息
    postUserInfoApi(state, account) {
      return new Promise((resolve, reject) => {
        postUserInfo(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取订单详情
    postOrderDetailsApi(state, account) {
      console.log(account);
      return new Promise((resolve, reject) => {
        postOrderDetails(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取用户充值明细
    postRechargeRecordsApi(state, account) {
      return new Promise((resolve, reject) => {
        postRechargeRecords(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};
