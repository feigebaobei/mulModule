<template>
	<div class="userInfo">
        <account-nav
        :type="'text'" 
        :tabValue="'修改手机号'"
        :slipper="false"
        ></account-nav>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                    <div class="phone-user">
                        <label>当前手机号</label>&nbsp;
                        <strong id="tel">{{userPhone.substr(0, 3) + '****' + userPhone.substr(7)}}</strong>
                    </div>
                    <el-form-item label="手机号码" prop="phoneNumber" :error="phoneError">
                      <el-input type="text" 
                                v-model="ruleForm.phoneNumber" auto-complete="off"
                                maxlength="11"
                                placeholder="请输入手机号"
                                class="phoneNumber">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code" style="position:relative;" :error="codeError">
                        <el-input type="text" 
                                    v-model="ruleForm.code" auto-complete="off"
                                    maxlength="4"
                                    placeholder="请输入验证码"
                                    class="code">
                        </el-input>
                        <img style="position: absolute;
                                    top:0px;right:0px;"
                                    :src="imgCode"
                                    @click="changeCodeImg"
                                    alt="验证码"
                                    />
                    </el-form-item>
                    <el-form-item label="短信验证码" 
                                      prop="smsCode"
                                      ref="smsCodeTest"
                                      :error="smsError"
                                      style="position:relative;">
                      <el-input type="text" 
                                v-model="ruleForm.smsCode" auto-complete="off"
                                 placeholder="请输入短信验证码"
                                 maxlength="6"
                                class="smsCode">
                    </el-input>
                    <span 
                          style="position:absolute;
                                top:0;right:0"
                                @click="phonecodeAjax('ruleForm')"
                               class="disabled" :class="{'smsBtn': canClick}"
                                >
                          {{smsText}}
                    </span>
                      <div class="smsTip" v-show="!canClick && !canShow">{{smsTip}}</div>
                    </el-form-item>
                        <el-form-item label="当前密码" prop="passWord" ref="password" :error="passwordError">
                          <el-input type="password" 
                                    v-model="ruleForm.passWord" auto-complete="off"
                                    class="passWord"
                                     placeholder="请输入当前网页密码"
                                    maxlength="18">
                          </el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" 
                                     @click="saveInfo('ruleForm', $event)"
                                     class="saveBtn">
                                     保存
                          </el-button>
                        </el-form-item>
	      </el-form>
    </div>
</template>

<script>
import accountNav from '@/components/sub/accountNav.vue'
import axios from '~common/assets/js/axios'
import md5 from 'js-md5'
const Countdown = 60
export default {
  name: 'account',
  metaInfo: {
    title: '修改手机号'
  },
   components: {
    accountNav
  },
  data () {
    // 验证手机
     let checkPhone = (rule, value, callback) => {
        this.phoneFlag = false
        this.canClick = false
       if (!value) {
         callback(new Error('请输入手机号'))
       } else {
         let isPhone = /^(13|15|16|18|14|17|19)[0-9]{9}$/.test(value)
         let is11 = /^\d{11}$/.test(value)
         if (!is11) {
           callback(new Error('手机号由11位数字组成'))
         } else if (isPhone) {
           if (value == this.userPhone) {
             callback(new Error('手机号与账户当前绑定手机号相同，请更换手机号完成绑定'))
           } else {
              this.phoneFlag = true
              if (this.codeFlag) {
                 if (this.totalTime == Countdown || this.totalTime < 0) {
                    this.canClick = true
                }
              }
             callback()
           }
         } else {
           callback(new Error('不支持该手机号号段'))
         }
       }
     }
      // 验证验证码
      let checkCode = (rule, value, callback) => {
         this.codeFlag = false
         this.canClick = false
        if (!value) {
          callback(new Error('请输入网站验证码'))
        } else if (/^\w{4}$/.test(value)) {
        axios.post(this.Service.Profile.checkVCode, {
          vCode: this.ruleForm.code,
          cancelGroupName: 'ajaxProfilecheckVCodeAccount'
        }).then((res) => {
           this.canClick = false
          if (res.stat == 1) {  
            this.codeFlag = true
            if (this.phoneFlag && this.codeFlag) {
                if (this.totalTime == Countdown || this.totalTime < 0) {
                    this.canClick = true
                }
            }
            this.codeError = ''
             callback()
          } else {
            if (this.totalTime <= 0) {
                  if (this.canSaveFlag) {
                      this.canClick = false
                      this.smsText = '获取短信验证码'
                      callback(new Error('网站验证码填写错误'))
                      this.canSaveFlag = false
                      return
                  }
              }
              this.codeFlag = false
              this.ruleForm.code = ''
               callback(new Error('网站验证码填写错误'))
            }
          }).catch((err) => {
                console.log(err)
          })      
        } else {
          callback(new Error('请输入正确的验证码'))
        }
      }
     // 验证短信验证码
     let checkSMSCode = (rule, value, callback) => {
       if (!value && this.canShow) {
         callback(new Error('短信验证码不能为空'))
       } else {
         if (!(value.length == 6 && /^[1-9]\d*|0$/.test(Number(value))) && this.canShow) {
           callback(new Error('短信验证码不正确'))
         } else {
           callback()
         }
       }
     }
     // 验证密码
     let checkPassword = (rule, value, callback) => {
       if (!value) {
         callback(new Error('请输入当前密码'))
       } else {
         if (value.length > 0 && value.length < 6) {
          callback(new Error('密码不能少于6位字符'))
        } else {
          callback()
        }
       }
     }
    return {
      ruleForm: {
          phoneNumber: '',
          passWord: '',
          code: '',
          smsCode: ''
        },
        rules: {
          phoneNumber: [
            { validator: checkPhone, trigger: 'blur' }
          ],
           passWord: [
            { validator: checkPassword, trigger: 'blur' }
          ],
          code: [
            {validator: checkCode, trigger: 'blur'}
          ],
           smsCode: [
            { validator: checkSMSCode, trigger: 'blur' }
          ]
        },
      userPhone: '',
      totalTime: Countdown,
      smsText: '获取短信验证码',
      imgCode: '',
      canClick: false,
      smsTip: '',
      codeFlag: false,
      clockFlag: null,
      canSaveFlag: false,  // 判断用户在倒计时时内有没有点击保存按钮
      canShow: true, // 控制当先获取验证码时，不出现错误提示
      phoneError: '',  // 后台给返回的手机号错误信息
      codeError: '',  // 后台给返回的验证码错误信息
      smsError: '', // 后台给返回的短信验证码错误信息
      passwordError: ''
      }
    },
  mounted () {
    this.getUserInfo()
    this.changeVerificationImg()
  },
  methods: {
    // 获取用户信息
      getUserInfo () {
        axios.get(this.Service.Profile.info).then((res) => {
          if (res.stat == 1) {
            this.userPhone = res.data.phone
          }
        }).catch((err) => {
          console.log(err)
        })     
      },
      // 保存button
      saveInfo (formName, event) {
        this.smsTip = ''
        this.canShow = true
        event.preventDefault()
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.smsError = ''
              this.passwordError = ''
              axios.post(this.Service.Profile.bindPhone, {
                  phone: this.ruleForm.phoneNumber,
                  vCode: this.ruleForm.code,
                  smsCode: this.ruleForm.smsCode,
                  curPwd: md5(this.ruleForm.passWord),
                  cancelGroupName: 'ajaxProfileBindPhoneAccount'
                }).then((res) => {
                    if (res.stat == 1) {
                      this.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        })
                      setTimeout(() => {
                          window.location.reload()
                        }, 500)
                    } else {
                      if (res.data.indexOf('密码') > -1) {
                          this.passwordError = res.data
                          return 
                      } 
                      this.smsError = '短信验证码不正确'
                      this.canSaveFlag = true
                        this.ruleForm.code = ''
                        this.changeVerificationImg()
                        this.getCheckoutCode()
                        this.ruleForm.smsCode = ''
                        if (this.totalTime <= 0 && !this.canClick) {
                          this.smsText = '获取短信验证码'
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })      
            } else {
              console.log('error submit!!')
              return false
            }
          })
      },
      // 失去焦点时验证图形验证码正不正确
      getCheckoutCode () {
        axios.post(this.Service.Profile.checkVCode, {
          vCode: this.ruleForm.code,
          cancelGroupName: 'ajaxProfilecheckVCodeAccount'
        }).then((res) => {
          this.canClick = false
          if (res.stat == 1) {  
            if (this.phoneFlag) {
                this.codeFlag = true
                if (this.totalTime == Countdown || this.totalTime < 0) {
                    this.canClick = true
                }
            }
            this.codeError = ''
          } else {
              if (this.totalTime <= 0) {
                    if (this.canSaveFlag) {
                        this.canClick = false
                        this.smsText = '获取短信验证码'
                        this.codeError = '请输入正确的验证码'
                        this.canSaveFlag = false
                        return
                    }
                }
                this.codeFlag = false
                this.ruleForm.code = ''
                this.codeError = '请输入正确的验证码'
              }
        }).catch((error) => {
          console.log(error)
        }) 
      },
      // 更新验证码图片
      changeVerificationImg () {
          this.imgCode = '/Verifications/show?' + this.generateMixed(12)
          this.code = ''
      },
      // 切换验证码图片
      changeCodeImg () {
        this.changeVerificationImg()
      },
      // 生成随机字符串
      generateMixed (n) {
          var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
          var res = ''
          for (var i = 0; i < n; i++) {
              var id = Math.ceil(Math.random() * 35)
              res += chars[id]
          }
          return res
      },
      // 获取验证码
      phonecodeAjax (formName) {
        if (!this.canClick) return
        this.$refs[formName].validateField('phoneNumber', (error) => {
            if (!error) {
              this.$refs[formName].validateField('code', (error) => {
                  if (!error) {
                  this.canClick = true
                  window.clearInterval(this.clockFlag)
                  this.ruleForm.smsCode = ''
                  this.phoneError = ''
                  this.$refs['smsCodeTest'].clearValidate()
                  axios.post(this.Service.Profile.sendSMSCode, {
                    phone: this.ruleForm.phoneNumber,
                    vCode: this.ruleForm.code,
                    cancelGroupName: 'ajaxProfilesendSMSCodeAccount'
                  }).then((res) => {
                    if (res.stat == 1) {
                      this.totalTime = Countdown
                      this.canClick = false 
                      this.canShow = false
                      this.smsTip = '由于运营商原因，手机短信可能会有延迟，请您耐心等待'
                      this.smsText = this.totalTime + 's后重新发送'
                      this.clockFlag = setInterval(() => {
                      this.totalTime--
                      this.smsText = this.totalTime + 's后重新发送'
                      if (this.totalTime < 0) { 
                        this.canShow = true
                        window.clearInterval(this.clockFlag)
                        if (this.canSaveFlag) {
                          this.canClick = false
                          this.canSaveFlag = false
                          this.smsText = '获取短信验证码'
                          return
                        }     
                        // 当倒计时小于0时清除定时器
                        this.canClick = true
                        this.smsText = '重新发送验证码'
                      }
                    }, 1000)
                    } else if (res.stat == 0) {
                      let str1 = '短'
                      let str2 = '验证码'
                      if (res.data.indexOf(str1) > -1) {
                        this.smsError = res.data
                      } else if (res.data.indexOf(str2) > -1) {
                          this.codeError = res.data
                      } else {
                        this.phoneError = res.data
                      }
                    }
                }).catch((err) => {
                    console.log(err)
                    return false
                })      
              } 
            })
          }
      })      
    }
  }
}
</script>

<style lang='less'>
	.userInfo{
    .ruleForm{
      width: 420px;
      margin: 60px 90px 0;
      .el-form-item {
            margin-bottom: 30px;
            .el-form-item__error{
                line-height: 20px;
                color:#f00;
              }
          .el-input{
                .el-input__inner{
                    color:#666;
                    border: 1px solid #ccc;
                }
                .el-input__inner::-webkit-input-placeholder{
                  color:#999;
                }
          }
        }
        .phone-user{
          margin-bottom: 30px;
          label{
            margin-left: 10px;
          }
        }
        .el-button--primary{
          background-color: #f13232;
          border-color: #f13232;
          width:100px;
        }
        .smsTip{
         font-size: 12px;
          color: #666666;
          width: 380px;
          height: 30px;
          position: absolute;
          left:0;
          line-height: 30px;
        }
        .el-form-item{
          .code,.smsCode{
            width: 160px;
          }
          .phon-btn{
            width:120px;
            height: 40px;
            text-align: center;
            border-radius: 3px;
            color:#fff;
            text-align: center;
            font-size: 16px;
          }
          .disabled{
            .phon-btn;
            background-color: #ddd;
            border-color: #ddd;
            cursor: not-allowed;  
          }
          .smsBtn{
            .phon-btn;
            background:#ffbc3c;
            cursor: pointer;
          }
          img{
            width: 120px;
            height: 40px;
            cursor: pointer;
          }
        }
    }
  }
</style>