<template>
  <div class="login-wrapper">
    <header class="header">
      <img alt=""
           src="../../assets/images/img-close.png"
           @click="handleGoHome" />
      送电费验证
    </header>
    <main>
      <div class="input">
        <input v-model="phoneValue" type="text" maxlength="11"
                placeholder="请填写手机号"
                pattern="[0-9]*"
                @blur="handleBlurPhone"/>
      </div>
      <div class="number">
        <div class="number-input">
          <input v-model="codeValue"
                pattern="[0-9]*"
                placeholder="请输入验证码" />
        </div>
        <span v-if="isCompleteCode" class="number-value">{{timeValue}}s</span>
        <span class="number-button" @click="sendCode" v-if="!isCompleteCode">发送验证码</span>
      </div>
      <div class="code">
        <span>图片验证</span>
        <div class="code-block">
          <img alt="" :src="codePatn" />
        </div>
        <span class="code-button" @click="refreshCodePatn">刷新</span>
      </div>
      <div class="input">
        <input v-model="picValue"
                placeholder="请填写验证码" />
      </div>
      <div class="tips">
        <p>温馨提示：</p>
        <p>请使用与网上国网登录账号相同手机号进行验证，避免出现返现无法到账的问题。</p>
      </div>
    </main>
    <div class="button" :class="{active: completeFlag}" @click="login">验证</div>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      // 验证码
      codePatn: '',
      // 手机号
      phoneValue: '',
      // 手机验证码
      codeValue: '',
      // 图片验证码
      picValue: '',
      // 验证码成功发送
      isCompleteCode: false,
      timeValue: 60,
    };
  },
  watch: {
    isCompleteCode(val) {
      if (val) this.setTime();
    },
  },
  computed: {
    ...mapState({
      reqbase: state => state.app.reqbase,
    }),
    completeFlag() {
      return this.phoneValue && this.codeValue && this.picValue;
    },
  },
  created() {
    this.$nextTick(() => {
      // 获取验证码
      this.refreshCodePatn();
    });
  },
  methods: {
    setTime() {
      setInterval(() => {
        this.timeValue--;
        if (this.timeValue === 0) {
          this.isCompleteCode = false;
        }
      }, 1000);
    },
    ...mapMutations([
      'set__loginInfo',
      'set_userInfo',
    ]),
    ...mapActions([
      'postQryimgcodeApi',
      'postSendcodeApi',
      'postTokenApi',
    ]),
    // 手机号输入验证
    handleBlurPhone() {
      const reg = /^1[0-9]{10}$/;
      if (this.phoneValue === '' || this.phoneValue.length <= 10 || !reg.test(this.phoneValue)) {
        this.$toast('请填写正确的手机号码！');
        this.phoneValue = '';
      }
    },
    // 获取图片验证码
    refreshCodePatn() {
      const data = {
        reqbase: this.reqbase,
        reqqrybase: {
          start: 0,
          count: 10,
          order: 'asc',
        },
        reqparam: {},
      };
      this.postQryimgcodeApi(data).then((res) => {
        if (res) {
          const result = JSON.parse(this.$decrypt(res.data));
          if (result.respbase && result.respbase.status === 'false') {
            this.$toast(result.respbase.returndesc);
          } else if (result.respparam) {
            this.codePatn = result.respparam.url;
          }
        }
      });
    },
    // 发送验证码
    sendCode() {
      if (this.checkEmpty()) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
            telno: this.phoneValue,
            code: this.picValue,
            type: '1',
          },
        };
        this.postSendcodeApi(data).then((res) => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            if (result.respbase && result.respbase.status === 'false') {
              this.$toast(result.respbase.returndesc);
            } else {
              this.isCompleteCode = true;
              this.$toast('发送成功！');
            }
          }
        });
      }
    },
    // 检查数据完整
    checkEmpty() {
      if (!this.phoneValue) {
        this.$toast('请填写手机号码！');
        return false;
      }
      if (!this.picValue) {
        this.$toast('请输入图片验证码！');
        return false;
      }
      return true;
    },
    handleGoHome() {
      this.$router.back();
    },
    login() {
      if (this.completeFlag) {
        const data = {
          reqbase: this.reqbase,
          reqqrybase: {
            start: 0,
            count: 10,
            order: 'asc',
          },
          reqparam: {
            telno: this.phoneValue,
            tel_code: this.codeValue,
            type: '1',
          },
        };
        this.postTokenApi(data).then((res) => {
          if (res) {
            const result = JSON.parse(this.$decrypt(res.data));
            if (result.respbase && result.respbase.status === 'false') {
              this.$toast(result.respbase.returndesc);
            } else if (result.respparam) {
              this.$toast('欢迎进入掌电商城！');
              this.set_userInfo(Object.assign({}, result.respparam, data.reqparam));
              this.set__loginInfo(result.respparam);
              this.$router.push({
                name: 'index',
              });
            }
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  background: #ffffff;
  .header {
    position: relative;
    width: 10rem;
    height: 1.173333rem;
    line-height: 1.173333rem;
    background: rgba(255, 255, 255, 1);
    border-bottom: .013333rem solid #EFF0F0;
    img {
      position: absolute;
      left: 0.4rem;
      top: 0.293333rem;
      width: 0.453333rem;
      height: 0.453333rem;
    }
  }
  main {
    width: 8.4rem;
    padding: 0.533333rem 0.8rem;
    text-align: left;
    .input {
      display: flex;
      align-items: center;
      border-bottom: .013333rem solid #bfbfbf;
      padding-bottom: 0.013333rem;
      margin-bottom: .266667rem;
      height: 1.28rem;
      input {
        width: 100%;
        height: .8rem;
        background: #ffffff;
        border-radius: 0;
        font-size: 0.373333rem;
        color: #333333;
        outline: none;
      }
    }
    .number {
      display: flex;
      height: 1.28rem;
      align-items: center;
      border-bottom: .013333rem solid #bfbfbf;
      .number-input {
        flex: 1;
        height: .8rem;
        border-right: 1px solid #BFBFBF;
        input {
          width: 100%;
          height: .8rem;
          font-size: 0.373333rem;
          color: #333333;
          outline: none;
        }
      }
      .number-button {
        padding-left: .133333rem;
        color: #0C82F1;
        font-size: .373333rem;
      }
      .number-value {
        color: #0C82F1;
        font-size: .373333rem;
        padding: 0 .8rem;
      }
    }
    .tips {
      margin-top: .533333rem;
      color: #5c5c5c;
      font-size: 0.32rem;
      line-height: 1.5;
    }
    .code {
      display: flex;
      margin: .533333rem 0 .266667rem 0;
      font-size: 0.373333rem;
      align-items: center;
      color: #333333;
      .code-block {
        margin: 0 18px;
        width: 2.133333rem;
        height: .8rem;
        background: rgba(247, 247, 251, 1);
        img {
          height: 100%;
          width: 100%;
        }
      }
      .code-button {
        color: #0C82F1;
      }
    }
  }
  .button {
    margin: 0 auto;
    width: 9.2rem;
    line-height: 1.2rem;
    height: 1.2rem;
    background: rgba(158, 207, 252, 1);
    border-radius: 12px;
    font-size: 0.426667rem;
    color: #ffffff;
    &.active {
      background: linear-gradient(-90deg, rgba(75, 167, 252, 1), rgba(12, 130, 241, 1));
    }
  }
}
</style>
