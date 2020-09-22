import axios from 'axios';
import { Toast, Indicator } from 'mint-ui';
// 失败
const errorRresponse = () => {
  Indicator.close();
  Toast('网络不给力，请检查网络');
  // this.$router.push({
  //   name: 'server',
  // });
};
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {}; // 请求队列
  }

  /**
   * 对外暴露请求方法
   * @param {*Object} options 自定义配置项
   */
  request(options) {
    const instance = axios.create();
    const unionOptions = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, unionOptions.url);
    return instance(unionOptions);
  }

  // 默认设置
  getInsideConfig(headers) {
    const config = {
      baseURL: this.baseUrl,
      headers: Object.assign({
        'Content-Type': ' application/json; charset=UTF-8',
      }, headers || {}),
    };
    return config;
  }

  // 销毁队列
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide() // 关闭提示，样式随组件使用确定
    }
  }

  // 状态200+成功请求
  succssRresponse(data) {
    // 各种处理
    if (data.invalidToken) {
      this.destroy();
    }
  }

  // 统一拦截
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use((config) => {
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 全局提示，样式随组件使用确定
      }
      this.queue[url] = true;
      return config;
    }, error => Promise.reject(error));
    // 响应拦截
    instance.interceptors.response.use((res) => {
      const errorCode = [4002, 1001, 1002];
      if (errorCode.includes(res.data.rc)) {
        Indicator.close();
        Toast('网络错误，请联系管理员！ ');
        return false;
      }
      this.destroy(url);
      const { data, status } = res;
      this.succssRresponse(data);
      return { data, status };
    }, (error) => {
      errorRresponse();
      this.destroy(url);
      // 随具体后端业务封装错误处理
      return Promise.reject(error);
    });
  }
}
export default HttpRequest;
