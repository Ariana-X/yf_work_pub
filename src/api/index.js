/* eslint-disable import/prefer-default-export */
import axios from '@/libs/api.request.js';
import request from './utils.js';

const uuid = require('uuid');

const SID = uuid();

// 获取验证码
export const postQryimgcode = ({ reqqrybase, reqparam, reqbase }) => axios.request({
  url: '/v1/vboxproduct/openauth/qryimgcode.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 发送验证码
export const postSendcode = ({ reqqrybase, reqparam, reqbase }) => axios.request({
  url: '/v1/vboxproduct/openauth/sendcode.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取token
export const postToken = ({ reqqrybase, reqparam, reqbase }) => axios.request({
  url: '/v1/vboxproduct/openauth/qrytokenbycode.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 首页获取列表
export const postHomeInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  // url: '/v1/vboxproduct/openauth/qryhomeinfo.do',
  url: '/v1/vboxproduct/openauth/homeinfo.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取资源配置信息
export const postConfigInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/configinfo.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取商品包下的商品
export const postGoods = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  // url: '/v1/vboxproduct/openauth/qrygoodsbypkg.do',
  url: '/v1/vboxproduct/openauth/qryskupackage.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 根据关键字搜索商品
export const postSearchGoods = ({ reqqrybase, reqparam, reqbase }) => axios.request({
  url: '/v1/vboxproduct/openauth/searchgoods.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取推广链接
export const postGoodsUrl = ({ reqqrybase, reqparam, reqbase }) => axios.request({
  url: '/v1/vboxproduct/openauth/convertskuurl.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取我的订单列表
export const postOrderInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/queryorders.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取订单详情
export const postOrderDetails = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/queryorderinfo.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取用户资产信息
export const postUserInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/qryuserassets.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取用户充值明细
export const postRechargeRecords = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/qryrechargerecord.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 退出账户
export const postLoginout = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/logout.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取签名
export const getUploadInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: 'v1/vboxproduct/openauth/genOssLicense.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 获取微信鉴权信息
export const getWxConfigInfo = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: 'v1/vboxproduct/openauth/genWxJsSdkConfig.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 添加收藏夹
export const addCollect = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/addCollect.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 已取消收藏
export const delCollect = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/delCollect.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});
// 收藏列表
export const listCollect = ({
  reqqrybase,
  reqparam,
  reqbase,
}) => axios.request({
  url: '/v1/vboxproduct/openauth/listCollect.do',
  method: 'post',
  data: {
    sid: SID,
    appid: request.appid,
    uid: reqbase.uuid,
    data: request.handleData({ reqqrybase, reqparam, reqbase }),
    nonce: request.handleDataNonce({ reqqrybase, reqparam, reqbase }),
  },
});

//
