<template>
	<div class="forget-password">
       	<div class="step">
            <img src="../../../../common/assets/img/step_1.png">
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="rule-form">
            <el-form-item  prop="phoneNumber" :error="phoneError">
              <el-input type="text"  v-model="ruleForm.phoneNumber" auto-complete="off" maxlength="11" class="phoneNumber" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item  prop="code" style="position:relative;" :error="codeError">
                <el-input type="text" 
                  v-model="ruleForm.code" auto-complete="off"
                  placeholder="请输入网站验证码"
                  maxlength="4"
                  class="code"
                 >
                </el-input>
                <img style="position: absolute;top:0px;right:0px;" :src="imgCode" @click="changeCodeImg" alt="验证码"/>
            </el-form-item>
            <el-form-item prop="smsCode" style="position:relative;" :error="smsError" ref="smsCodeTest">
              <el-input type="text" v-model="ruleForm.smsCode" auto-complete="off" class="smsCode"  placeholder="请输入短信验证码" maxlength="6"></el-input>
              <span  @click="phonecodeAjax('ruleForm')" class="disabled" :class="{'smsBtn': canClick}" >
                {{smsText}}
              </span>
               <div class="smsTip" v-show="!canClick && !canShow">{{smsTip}}</div>
          </el-form-item>
            <button  @click="nextStep('ruleForm', $event)" class="next-btn">下一步
            </button>
      </el-form>
    </div>
</template>

<script>
import axios from '~common/assets/js/axios'
const Countdown = 60
export default {
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
        axios.post('/Find/checkVCode', {
          vCode: this.ruleForm.code,
          cancelGroupName: 'ajaxFindcheckVCodeAccount'
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
                  if (this.canNextFlag) {
                      this.canClick = false
                      this.smsText = '获取短信验证码'
                      callback(new Error('网站验证码填写错误'))
                      this.canNextFlag = false
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
       } else if (!(value.length == 6 && /^[1-9]\d*|0$/.test(Number(value))) && this.canShow) {
          // this.canNextFlag = false
           callback(new Error('短信验证码不正确'))
        } else {
           callback()
         }
       }
    return {
      smsError: '',
      codeError: '',
      phoneError: '',
      ruleForm: {
          phoneNumber: '',
          code: '',
          smsCode: ''
        },
        rules: {
          phoneNumber: [
            { validator: checkPhone, trigger: 'blur' }
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
      clockFlag: null, // 倒计时标识
      canNextFlag: false, // 判断用户在倒计时时内有没有点击下一步按钮
      canShow: true,  // 控制当先获取验证码时，不出现错误提示
      smsTip: '',
      phoneFlag: false, // 验证手机号开关
      codeFlag: false  // 验证代码开关
      }
    },
  methods: {
    // 下一步
    nextStep (formName, event) {
       this.smsTip = ''
       this.canShow = true
       event.preventDefault()
       this.$refs[formName].validate((valid) => {
          if (valid) {
            this.smsError = ''
            axios.post('/Find/checkCode', {
                phone: this.ruleForm.phoneNumber,
                vCode: this.ruleForm.code,
                smsCode: this.ruleForm.smsCode,
                cancelGroupName: 'ajaxFindCheckCodeAccount'
            }).then((res) => {
                  if (res.stat == 1) {
                      this.$emit('showSetPass', 2)
                  } else {
                    // 表示点击下一步按钮啦
                      this.canNextFlag = true
                      this.smsError = '短信验证码不正确'
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
          }
        })
    },
    // 失去焦点时验证图形验证码正不正确
    getCheckoutCode () {
          axios.post('/Find/checkVCode', {
            vCode: this.ruleForm.code,
            cancelGroupName: 'ajaxFindcheckVCodeAccount'
          }).then((res) => {
              this.canClick = false
            if (res.stat == 1) {  
              if (this.phoneFlag && this.codeFlag) {
                if (this.totalTime == Countdown || this.totalTime <= 0) {
                    this.canClick = true
                }
              }
               this.codeError = ''
            } else if (res.stat == -1) {
              if (this.totalTime <= 0) {
                  if (this.canNextFlag) {
                      this.canClick = false
                      this.smsText = '获取短信验证码'
                      this.canNextFlag = false
                      return
                  }
              }
                this.codeFlag = false
                this.ruleForm.code = ''
                this.codeError = res.data
            } else {
             if (this.totalTime <= 0) {
                  if (this.canNextFlag) {
                      this.canClick = false
                      this.smsText = '获取短信验证码'
                      this.codeError = res.data
                      this.canNextFlag = false
                      return
                  }
              }
                this.codeFlag = false
                this.ruleForm.code = ''
                this.codeError = res.data
            }
          }).catch((err) => {
            console.log(err)
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
                  axios.post('/Find/smsCode', {
                    phone: this.ruleForm.phoneNumber,
                    vCode: this.ruleForm.code,
                    cancelGroupName: 'ajaxFindesendSMSCodeAccount'
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
                        if (this.canNextFlag) {
                          this.canClick = false
                          this.canNextFlag = false
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
  },  
  mounted () {
    this.changeVerificationImg()
  }
}
</script>

<style lang='less'>
	.forget-password{
    .step{
      overflow: hidden;
      text-align: center;
      margin:90px 0;
    }
    .rule-form{
      width: 380px;
      margin: 0 auto;
      .el-form-item{
          margin-bottom: 32px;
        .el-form-item__error{
            line-height: 20px;
            color:#f00;
          }
      .el-input{
          height: 48px;
            .el-input__inner{
                height: 100%;
                line-height: 48px;
                color:#666;
                 border: 1px solid #ccc;
            }
            .el-input__inner::-webkit-input-placeholder{
                    color:#999;
            }
      }
      .el-form-item__content{
          line-height: 48px;
      }
    }
        .phone-user{
          margin-bottom: 30px;
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
          .code{
            width: 230px;
          }
         .smsCode{
           width: 230px;
          }
          .phon-btn{
            position: absolute;
            width:136px;
            height: 47px;
            line-height: 47px;
            border-radius: 3px;
            color: #fff;
            text-align: center;
            font-size: 16px;
            right: 7px;
            top: 0px;
            z-index: 1;
          }
           .disabled{
              .phon-btn;
              background-color: #ddd;
              border-color: #ddd;
              cursor: not-allowed;  
          }
          .smsBtn{
            .phon-btn;
            background: rgb(55, 188, 155);;
            cursor: pointer;
          }
         
          img{
            width: 136px;
            height: 47px;
            cursor: pointer;
          }
        }
        .next-btn{
           background-color: #f13233;
            width: 100%;
            height: 50px;
            font-size: 14px;
            border: 0;
            color: #fff;
            cursor: pointer;
            border-radius: 3px;
            &:hover{
                background-color: #fa4747;
                 color:#fff;
            }
            &.el-button:hover{
                background-color: #fa4747;
                color:#fff;
            }
        }
    }
  }
</style>