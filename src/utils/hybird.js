/* eslint-disable */
import util from '@/api/utils';

function ios(funName, params, successCallback, errorCallback) {
  const callbackName = util.getRandom();
  window.iosSuccessCallbacks[callbackName] = successCallback;
  if (!window.webkit.messageHandlers[funName]) {
    errorCallback();
  } else {
    if (typeof(params) === 'string') {
      window.webkit.messageHandlers[funName].postMessage(params);
    } else {
      params.callback = callbackName;
      window.webkit.messageHandlers[funName].postMessage(JSON.stringify(params));
    }
    // if(funName === 'onEvent' || funName === 'removeH5ExtraParam' || funName === 'openKplUrl' || funName === 'openKeplerItemDetail'){
    //   window.webkit.messageHandlers[funName].postMessage(params);
    // } else {
    //   params.callback = callbackName;
    //   window.webkit.messageHandlers[funName].postMessage(JSON.stringify(params));
    // }
  }
}

function android(funName, params, successCallback, errorCallback) {
  const fun = window.android[funName];
  if (!fun) {
    errorCallback();
  } else {
    if (typeof(params) !== 'string') {
      params = JSON.stringify(params);
    }
    const result = window.android[funName](params);
    successCallback(result);
  }
}

function bridge(funName, params, successCallback, errorCallback) {
  console.log(`[调用sdk参数打印]:${funName}`, params)
  if (window.android) {
    android(funName, params, successCallback, errorCallback);
  } else if (window.webkit) {
    ios(funName, params, successCallback, errorCallback);
  } else {
    errorCallback();
  }
  // 单个加入购物车成功回调
  if (funName === 'keplerFastPurchase') {
    window.keplerFastPurchaseResult = function(result) {
      successCallback(result);
    }
  } else if (funName === 'keplerBatchPurchase') {
    // 批量加入购物车回调
    window.keplerBatchPurchaseResult = function(result) {
      successCallback(result);
    };
  }
}

window.iosSuccessCallbacks = {};
window.returnSDKInfo2JS = function(result) {
  const response = JSON.parse(result);
  if (window.iosSuccessCallbacks[response.callback]) {
    window.iosSuccessCallbacks[response.callback](result);
  }
};

window.returnH5Params2JS = function(result) {
  const response = JSON.parse(result);
  if (window.iosSuccessCallbacks[response.callback]) {
    window.iosSuccessCallbacks[response.callback](result);
  }
};


export default {
  bridge,
};
