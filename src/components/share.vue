<template>
  <div>
  <!-- 回顶部 -->
  <!-- //分享遮罩 -->
  <div class="center" ref="capture">
    <div class="header">
      <img src="../assets/images/share/head.png" alt="" />
      <span>
        用户【*海群】
        <br />
        邀请您参与购物送电费优惠活动
      </span>
    </div>
    <div class="content">
      <img src="../assets/images/share/logo.png" alt="" class="logo" />
      <div class="fl">
        <span>约送电费￥{{ good_info.commission }}</span>
      </div>
      <img crossorigin="anonymous" :src="good_info.image_url" alt="" class="sku_img" />
      <div class="price">￥{{ good_info.wl_price }}</div>
      <div class="price-desc">价格具有时效性</div>
      <div class="sku_desc">{{ good_info.sku_name }}</div>
      <div class="code"><vue-qr :text="urlData" class="qrcode"></vue-qr></div>
      <div class="gw_desc">保存图片到手机</div>
      <div class="gw_desc">使用网上国网App搜一搜购买</div>
    </div>
  </div>

  <div class="mask" v-show="bool_show">
    <img :src="hb_url" alt="" class="share_img" />
    <div class="bottom">
      <div class="share_type">
        <div class="item" @click="weixin()">
          <img src="../assets/images/share/weixin.png" alt="" />
          <span>微信</span>
        </div>
        <div class="item" @click="pengyouquan()">
          <img src="../assets/images/share/friend.png" alt="" />
          <span>朋友圈</span>
        </div>
        <div class="item" @click="shar_qq()">
          <img src="../assets/images/share/qq.png" alt="" />
          <span>QQ</span>
        </div>
        <div class="item" @click="shar_weibo()">
          <img src="../assets/images/share/weibo.png" alt="" />
          <span>微博</span>
        </div>
        <div class="item" @click="download()">
          <img src="../assets/images/share/download.png" alt="" />
          <span>保存图片</span>
        </div>
      </div>
      <div class="cancel" @click="cancel()">取消</div>
    </div>
  </div>
  </div>
</template>
<script src="http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js" charset="utf-8"></script>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import vueQr from 'vue-qr';
import BackTop from '@/components/back-to-top.vue';
import html2canvas from 'html2canvas';
import axios from '@/libs/api.request.js';
import $ from 'jquery';
export default {
  name: 'share',
  components: {
    vueQr
  },
  data() {
    return {
      // 分享使用
      bool_gen: false,
      hb_url: '',
      hb_url_base64: '',
      dataurl: '',
      aliyunOssToken: {},
      bool_show: false,
      good_info: {},
    };
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase
    }),
    // url分享地址
    urlData() {
      const { userid } = this.reqbase;
      return `https://osg-static.sgcc.com.cn/activity/ChannelQrCode/index.html#${this.good_info.sku_id}_${userid}#A10078600#wsgwfer`;
    },
  },
  props: {
    target: [String]
  },
  methods: {
    ...mapActions(['getOssInfo']),
    //分享
    shar_qq() {
      var ftit = '飞尔智能'; // 分享出去得文章得标题
      var flink = this.hb_url;
      window.open(
        'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?sharesource=qzone&title=' +
          ftit +
          '&pics=' +
          flink +
          '&summary=' +
          ''
      );
    },
    shar_weibo() {
      var ftit = encodeURIComponent('飞尔智能'); // 分享出去得文章得标题
      // var flink = "http://www.feiersmart.com/openweb/static/images/jqryxdd.png;jsessionid=F682EB99802F922AB621CE6AACD91D5E";
      var flink = this.hb_url;
      // var flink = "https://zdmall-images-source.feiersmart.com/test/yangle/62049599652/62049599652.png";
      var url =
        'http://service.weibo.com/share/share.php?pic=' +
        flink +
        '&sharesource=weibo&title=' +
        ftit +
        '&pic=' +
        flink +
        '&appkey=3779881611';
      window.open(url);
    },
    //关闭弹窗
    cancel() {
      this.bool_show = false;
    },
    //点击生成图片
    generatorShareImage(item) {
      this.good_info = item;
      this.getUploadInfo();
    },
    upload() {
      var _self = this;
      var fil = this.base642blob(this.dataurl);
      // var filename = new Date().getTime() + getSuffix(file);
      var filename = `${this.good_info.sku_id}.png`;
      var formData = new FormData();
      // _self.aliyunOssToken.dir.substr(1)
      //注意formData里append添加的键的大小写
      const { userid } = this.reqbase;
      formData.append('key', _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append('OSSAccessKeyId', _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append('policy', _self.aliyunOssToken.policy); //policy
      formData.append('Signature', _self.aliyunOssToken.signature); //签名
      formData.append('callback', _self.aliyunOssToken.callback); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      // formData.append("file", $("#file")[0].files[0]);
      formData.append('file', fil, filename);
      formData.append('success_action_status', 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.host;
      var fileUrl = _self.aliyunOssToken.host + '/' + _self.aliyunOssToken.dir +  filename;
      this.uploadPic(formData).then(res => {
        // _self.hb_url = fileUrl;
        // console.log('图片url:', fileUrl);
      });
    },
    // 获取阿里鉴权信息
    getUploadInfo() {
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc'
        },
        reqparam: {
          sku_id: this.good_info.sku_id,
          type: '1'
        }
      };
      this.getOssInfo(data).then(respons => {
        if (respons) {
          const result = JSON.parse(this.$decrypt(respons.data));
          this.aliyunOssToken = result.respparam;
          console.log('【oss校验信息】', result);
          this.execute();
        }
      });
    },
    //生成分享图片
    execute() {
      //如果图片已经生成过，则不再生成
      if (this.aliyunOssToken != undefined && this.aliyunOssToken != ''
       && this.aliyunOssToken.share_url != undefined && this.aliyunOssToken.share_url != '') {
        this.hb_url = this.aliyunOssToken.share_url;
        this.bool_show = true;
        return;
      }
      console.log(this.good_info);
      let that = this;
      // 是否支持download属性
      const opts = {
        useCORS: true
      };
      setTimeout(() => {
        //图片转换
        html2canvas(this.$refs.capture, opts).then(canvas => {
          this.dataurl = canvas.toDataURL('image/jpeg',1);
          console.log(this.dataurl);
          //组装上传信息
          that.upload();
        });
      }, 100);
    },
    // 上传图片
    uploadPic(params) {
      //调用系定义头的reuqest
      return new Promise((resolve, reject) => {
        axios
          .request({
            url: this.aliyunOssToken.host,
            method: 'post',
            data: params
          })
          .then(res => {
            console.log(res);
            if(res.data.respbase.status=='true'){
             this.hb_url = res.data.respparam.share_url;
             this.bool_show = true;
             console.log("图片：",this.hb_url);
            }
            const { data } = res;
            resolve(data);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    base642blob(dataurl) {
      if (dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      } else {
        console.log('没有图片url!');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .center{
    width: 5.357142rem;
    // height: 11.271428rem;
    background:rgba(228,228,228,1);
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: -100.171428rem;
    z-index: 99999;
    .header{
      width: 100%;
      display: flex;
      box-sizing: border-box;
      background:rgba(247,248,250,1);
      padding: 0.185714rem 0.214285rem;
      img{
        width: 0.342857rem;
        height: 0.342857rem;
        display: inline-block;
        margin-right: 0.285714rem;
      }
      span{
        color: #5C5C5C;
        font-size:0.171428rem;
        text-align: left;
      }
    }
    .content{
      width: 4.785714rem;
      // height: 9.685714rem;
      background:rgba(255,255,255,1);
      border-radius:0.142857rem;
      margin:0.285714rem;
      padding: 0.114285rem;
      box-sizing: border-box;
      .logo{
        width: 2.9rem;
        height: 0.528571rem;
        margin: auto;
      }
      .fl{
        background-image: url(../assets/images/share/fl-bg.png);
        width: 3.028571rem;
        background-size: 100% 100%;
        margin: auto;
        height: 0.585714rem;
        font-size: 0.171428rem;
        span{
        color: #FFF9CD;
        height: 0.585714rem;
        line-height: 0.585714rem;
        text-align: right;
        margin-right: 0.1rem;
        }
      }
      .sku_img{
        width: 2.76rem;
        // height: 3.758571rem;
        margin: auto;
        margin-top: 0.328571rem;
        margin-bottom: 0.2rem;
      }
      .price{
        font-size: 0.342857rem;
        color: #E4393C;
        text-align: left;

      }
      .price-desc{
        font-size: 0.171428rem;
        color: #929292;
        text-align: left;
        margin-top: 0.085714rem;
        margin-bottom: 0.1rem;
      }
      .sku_desc{
        font-size: 0.2rem;
        color: #333;
        text-align: left;
      }
      .code{
        width: 1.571428rem;
        height: 1.571428rem;
        margin: auto;
      }
      .gw_desc{
        font-size: 0.185714rem;
        color: #5C5C5C;
        text-align: center;
      }
    }
  }
.mask{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0,0,0,0.5);
  .share_img{
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 5.171428rem;
    width: 5.357142rem;
  }
  .bottom{
    position: fixed;
    padding: 0.285714rem;
    padding-bottom: 0;
    box-sizing: border-box;
    display: flex;
        flex-direction: column;
        justify-content: space-between;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4.285714rem;
    background:rgba(255,255,255,1);
    border-radius:0.228571rem 0.228571rem 0 0;
    .share_type{
      display: flex;
      justify-content: space-between;
      .item{
        text-align: center;
        font-size: 0.457142rem;
        img{
          margin: auto;
          width: 1.428571rem;
          height: 1.428571rem;
          margin-bottom: 0.2rem;
        }
      }
    }
    .cancel{
      height: 1.1rem;
      line-height: 1.1rem;
      font-size: 0.457142rem;
      border-top: 0.014285rem solid rgba(239,240,240,1);
      ;
    }
  }
}
</style>
