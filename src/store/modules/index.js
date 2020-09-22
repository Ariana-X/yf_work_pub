const files = require.context('.', true, /\.js$/);

const configVuex = {};
/**
 * inject routers
 */
files.keys().forEach((key) => {
  if (key === './index.js') return;
  configVuex[key.replace(/\.\/([a-z]*)\.js/, '$1')] = files(key).default;// 读取出文件中的default模块
});
export default configVuex; // 抛出一个Vue-vuex期待的结构的数组
