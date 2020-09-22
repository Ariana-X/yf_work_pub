const files = require.context('.', true, /\.js$/);
function RoutersFunc() {
  /**
   * inject routers
   */
  let Routers = [];
  files.keys().forEach((key) => {
    if (key === './index.js') return;
    // 读取出文件中的default模块
    Routers = Routers.concat(files(key).default);
  });
  return Routers;
}
const configRouters = RoutersFunc();
// 抛出一个Vue-router期待的结构的数组
export default configRouters;
