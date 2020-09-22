import {
  postSendcode,
  postQryimgcode,
  postToken,
  postLoginout,
} from '@/api/index.js';

const uuid = require('uuid');
// 类型检测
// eslint-disable-next-line func-names
const checkClient = function () {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  let type = '';
  if (isAndroid) type = 'Android';
  if (isiOS) type = 'iOS';
  return !type ? 'windows' : type;
};

export default {
  state: {
    // 接口请求 请求基参数
    reqbase: {
      appid: 'G9TLQG8A',
      userid: '',
      uuid: '',
      protocolno: '2.0.1',
      token: '',
      osid: checkClient(),
      versionno: '',
      imei: '',
    },
    // 登录信息
    userInfo: null,
  },
  getters: {
  },
  mutations: {
    // 更新唯一标识
    setUuid(state) {
      state.reqbase.uuid = uuid();
    },
    // 类型检测
    set_osid(state) {
      state.reqbase.osid = checkClient();
    },
    set_userInfo(state, data) {
      state.userInfo = data;
    },
    set__loginInfo(state, { userid }) {
      // state.reqbase.token = token;
      state.reqbase.userid = userid;
    },
    // 退出账号
    loginOut(state) {
      // state.reqbase.token = '';
      state.reqbase.userid = '';
      state.userInfo = null;
    },
    // sdk版本号
    set__versionno(state, { versionno }) {
      state.reqbase.versionno = versionno;
    },
  },
  // 异步操作
  actions: {
    // 发送验证码
    postSendcodeApi(state, account) {
      return new Promise((resolve, reject) => {
        postSendcode(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取验证码
    postQryimgcodeApi(state, account) {
      return new Promise((resolve, reject) => {
        postQryimgcode(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 获取token
    postTokenApi(state, account) {
      return new Promise((resolve, reject) => {
        postToken(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 退出
    postLoginoutApi(state, account) {
      return new Promise((resolve, reject) => {
        postLoginout(account).then((res) => {
          const { data } = res;
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};
