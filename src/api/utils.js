import md5 from 'md5';
import code from '@/libs/code.js';

// eslint-disable-next-line func-names
const getRandom = function (num) {
  const grandom = Math.floor(
    // eslint-disable-next-line no-restricted-properties
    (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1),
  );
  return grandom;
};


export default {
  appid: 'G9TLQG8A',
  handleData(data) {
    return code.encrypt(JSON.stringify(data));
  },
  handleDataNonce(data) {
    const datauser = code.encrypt(JSON.stringify(data));
    const ts = Date.parse(new Date()); // 当前时间戳
    const random = getRandom(2); // 调用随机数函数生成2位数的随机数
    const hashuser = `${md5(datauser)}|${ts}|${random}`; // 加密成md5
    const nonceuser = code.base64encode(hashuser);
    return nonceuser;
  },
  getRandom() {
    return getRandom(10);
  },
};
