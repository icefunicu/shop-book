<template>
  <el-container class="login-container">
    <el-header>
      <el-row type="flex" class="header">
        <el-col :span="24"> 
          <h3>校园二手书籍交易平台</h3> 
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="main-content">
        <div class="main-bg"></div>
        <div class="main-form">
          <h2 class="form-title">欢迎登录</h2>
          <el-form
            ref="form"
            :model="formData"
            :rules="formRules"
            :hide-required-asterisk="true"
            label-width="80px"
          >
            <el-form-item label="登陆账号" prop="name">
              <el-input
                v-model.trim="formData.name"
                maxlength="11"
                placeholder="请输入登陆手机号"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item label="登陆密码" prop="pwd">
              <el-input
                v-model.trim="formData.pwd"
                maxlength="16"
                placeholder="请输入密码"
                type="password"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="formData.savePwd">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item class="btn-container">
              <div class="button-group">
                <el-button type="primary" class="login-btn" @click="submitForm('form')"
                  >商家登录
                </el-button>
                <el-button class="register-btn" @click.native="linkToReg">商家注册</el-button>
                <el-button type="warning" class="admin-btn" @click="adminLogin">管理员登录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-footer>
      <p>&copy; Power By Peng Wenxiang</p>
    </el-footer>
  </el-container>
</template>

<script>
import MD5 from "crypto-js/md5";
import { JSEncrypt } from "jsencrypt";
import Base64 from "./../util/base64";
import { login } from "./../api/login";
import { getPublicKey } from "./../api/common";
import { mobileReg, handleError } from "./../util/util";

const SAVE_NAME = "saveItem";

export default {
  data() {
    return {
      logining: false,
      formData: {
        name: "15553598110",
        pwd: "123456",
        savePwd: true
      },
      formRules: {
        name: [{ validator: this.mobileRegFun, trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    let saveItem = localStorage.getItem(SAVE_NAME);
    if (saveItem) {
      saveItem = JSON.parse(saveItem);
      this.formData.name = Base64.decode(saveItem.name);
      this.formData.pwd = Base64.decode(saveItem.pwd);
    }
  },
  methods: {
    adminLogin() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.formData.name !== '15553598110') {
            this.$message({
              message: '您不是管理员，请使用商家登录',
              type: 'warning'
            });
            return;
          }
          
          if (this.formData.savePwd) {
            // base64编码存储
            var obj = {
              name: Base64.encode(this.formData.name),
              pwd: Base64.encode(this.formData.pwd)
            };
            localStorage.setItem(SAVE_NAME, JSON.stringify(obj));
          } else {
            localStorage.removeItem(SAVE_NAME);
          }
          
          try {
            let res = await getPublicKey(); // 获取公钥
            if (res.errorCode === 200) {
              let name = this.formData.name;
              let encryptor = new JSEncrypt();
              encryptor.setPublicKey(res.data); // JSEncrypt 设置公钥
              let md5Pwd = MD5(this.formData.pwd).toString(); // 登录密码进行MD5加密
              let pwd = encodeURI(encryptor.encrypt(md5Pwd)); // JSEncrypt 通过公钥再次进行加密
              let logRes = await login({ name, pwd }); // 执行登录操作
              if (logRes.errorCode === 200) {
                let path = this.$route.query.redirect
                  ? this.$route.query.redirect
                  : "/";
                this.$message({
                  message: "管理员登录成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.$router.push({
                      path: path
                    });
                  }
                });
              } else {
                this.$message({
                  message: logRes.errorMsg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.errorMsg,
                type: "error"
              });
            }
          } catch (error) {
            handleError(error);
          }
        }
      });
    },
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (this.formData.name == '15553598110') {
          this.$message({
            message: '您是管理员，请使用管理员登录',
            type: 'warning'
          });
          return;
        }
        if (valid) {
          if (this.formData.savePwd) {
            // base64编码存储
            var obj = {
              name: Base64.encode(this.formData.name),
              pwd: Base64.encode(this.formData.pwd)
            };
            localStorage.setItem(SAVE_NAME, JSON.stringify(obj));
          } else {
            localStorage.removeItem(SAVE_NAME);
          }
          try {
            let res = await getPublicKey(); // 获取公钥
            if (res.errorCode === 200) {
              let name = this.formData.name;
              let encryptor = new JSEncrypt();
              encryptor.setPublicKey(res.data); // JSEncrypt 设置公钥
              let md5Pwd = MD5(this.formData.pwd).toString(); // 登录密码进行MD5加密
              let pwd = encodeURI(encryptor.encrypt(md5Pwd)); // JSEncrypt 通过公钥再次进行加密
              let logRes = await login({ name, pwd }); // 执行登录操作
              if (logRes.errorCode === 200) {
                let path = this.$route.query.redirect
                  ? this.$route.query.redirect
                  : "/";
                this.$message({
                  message: "登陆成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.$router.push({
                      path: path
                    });
                  }
                });
              } else {
                this.$message({
                  message: logRes.errorMsg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.errorMsg,
                type: "error"
              });
            }
          } catch (error) {
            handleError(error);
          }
        }
      });
    },
    linkToReg() {
      this.$router.push("/register");
    },
    mobileRegFun(rule, value, callback) {
      if (!mobileReg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../styl/variables.styl'

.login-container
  height 100%
  background linear-gradient(to bottom, #f8f9fa, #e9ecef)

  .el-header
    background-color $color-primary
    box-shadow 0 2px 10px rgba(0, 0, 0, 0.1)

    h3
      text-align center
      color #fff
      margin 0
      line-height 60px
      font-size 22px
      font-weight 600
      letter-spacing 1px

  .el-main
    display flex
    padding 40px
    justify-content center
    align-items center

    .main-content
      display flex
      width 100%
      max-width 1200px
      background-color white
      border-radius 12px
      box-shadow 0 10px 30px rgba(0, 0, 0, 0.1)
      overflow hidden

      .main-bg
        flex 1
        min-height 500px
        background-image url('/images/login/login-bg-2.jpg')
        background-repeat no-repeat
        background-size cover
        background-position center
        position relative

        &:after
          content ''
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          background rgba(0, 0, 0, 0.2)
          border-radius 12px 0 0 12px

      .main-form
        display flex
        flex-direction column
        justify-content center
        flex 0 0 400px
        padding 40px

        .form-title
          text-align center
          margin-bottom 30px
          color $color-primary
          font-size 26px
          font-weight 600

        form
          width 100%
          
          .el-form-item
            margin-bottom 22px
            
            .el-button
              border-radius 4px
              padding 12px 20px
              font-size 14px
              width 100%
              margin-bottom 15px
              
            .login-btn
              font-weight 600
              letter-spacing 1px
              
            .register-btn
              background-color #fff
              color #606266
              border-color #dcdfe6
              
              &:hover
                background-color #f5f7fa
                color $color-primary
                border-color $color-primary
                
            .admin-btn
              background-color #e6a23c
              color #fff
              border-color #e6a23c
              margin-bottom 0
              
              &:hover
                background-color #d39530
                border-color #d39530
          
          .btn-container
            margin-top 30px
            width 100%
            
            .button-group
              display flex
              flex-direction column
              width 100%
            
            .el-button
              width 100%
              height 40px
              margin-left 0
              margin-right 0
              margin-bottom 15px
              justify-content center
              border-radius 4px
              font-size 14px
              display flex
              align-items center
              
            .login-btn
              font-weight 600
              letter-spacing 1px
              
            .register-btn
              background-color #fff
              color #606266
              border-color #dcdfe6
              
              &:hover
                background-color #f5f7fa
                color $color-primary
                border-color $color-primary
                
            .admin-btn
              background-color #e6a23c
              color #fff
              border-color #e6a23c
              margin-bottom 0
              
              &:hover
                background-color #d39530
                border-color #d39530
          
          .el-input
            .el-input__inner
              height 40px
              border-radius 4px
              border 1px solid #dcdfe6
              
              &:focus
                border-color $color-primary
                box-shadow 0 0 0 2px rgba(24, 144, 255, 0.2)

  .el-footer
    text-align center
    background-color $color-primary
    line-height 60px
    color #fff
    font-size 14px
    
    p
      margin 0
</style>
