import config from '@/config/index';

const {
  title,
} = config;

export const calculationBytes = (value, length) => {
  /**
   * @description 计算字节数
   * @param {String} value
   */
  if (value.replace(/[^\x00-\xff]/g, 'xx').length >= length) {
    return true;
  }
  return false;
};

export const setMetaTitle = (routeItem) => {
  /**
   * @description 根据当前跳转的路由设置显示在浏览器标签的title
   * @param {Object} routeItem 路由对象
   */
  const pageTitle = routeItem.meta.title;
  window.document.title = !pageTitle ? title : pageTitle;
};

/**
 * 检查版本号
 */
export const compareVersion = (currentVersion, targetVersion) => {
  if (currentVersion === undefined || currentVersion === '') {
    return false;
  }
  //  计算版本号大小,转化大小
  function toNum(value) {
    const a = value.toString();
    const c = a.split('.');
    const numPlace = ['', '0', '00', '000', '0000'];
    const r = numPlace.reverse();
    for (let i = 0; i < c.length; i++) {
      const len = c[i].length;
      c[i] = r[len] + c[i];
    }
    const res = c.join('');
    return res;
  }
  const aa = toNum(currentVersion);
  const bb = toNum(targetVersion);
  if (aa >= bb) {
    return true;
  }
  return false;
};
// 获取订单地址
export const getOrderUrl = (orderId) => {
  const url = `https://wqs.jd.com/order/n_detail_v2.shtml?deal_id=${orderId}&isoldpin=0&sceneval=2`;
  return url;
};
