<template>
        <div class="set-new-password">
            <div class="step">
                <img src="../../../../common/assets/img/step_2.png">
            </div>
            <div class="password-content">
                <el-form class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" status-icon>
                    <el-form-item  prop="newPass">
                        <el-input type="password" placeholder="请输入新密码" v-model="ruleForm.newPass" auto-complete="off" maxlength="18" onkeydown="if(event.keyCode==32) return false"></el-input>
                    </el-form-item>
                    <div class="password-type" v-show="passwordtypeShow">
                        <span class="security">安全强度</span>
                        <strong :class="strongtType"></strong>   
                    </div>
                    <el-form-item prop="checkPass">
                        <el-input type="password" placeholder="请再次输入新密码" v-model="ruleForm.checkPass" auto-complete="off" maxlength="18" onkeydown="if(event.keyCode==32) return false"></el-input>
                    </el-form-item>
                    <button  class="el-button" @click="submitForm('ruleForm', $event)">下一步</button>
                </el-form>
            </div>
        </div>
</template>
<script>
/* eslint-disable */
import { Button} from 'element-ui'
import axios from '~common/assets/js/axios'
export default {
    data () {
        let validNewPass = (rule, value, callback) => {
             this.passwordtypeShow = false
             if (!value) {
                callback(new Error('请输入新密码'))
               } else if (!this.isvalidPassword(value)) {
                   callback(new Error('密码中必须包含数字和字母'))
                } else if (value.length < 6) {
                     callback(new Error('密码不能少于6位字符'))
                } else {
                 callback()
                   this.passwordtypeShow = true
            }
        }
        let validcheckPass = (rule, value, callback) => {
             if (!value) {
                callback(new Error('请再次输入密码'))
               } else if (value !== this.ruleForm.newPass) {
                 callback(new Error('两次输入密码不一致!'))
               } else {
                 callback()
            }
        }
        return {
            msgError: '',
            ruleForm: {
                newPass: '',  // 新密码
                checkPass: '' // 确认密码
            },
            passwordtypeShow: false,
            passErroe:'',
            rules: {
                newPass: [{trigger: 'blur', validator: validNewPass}],
                checkPass: [{trigger: 'blur', validator: validcheckPass}]
            }
        }
    },
    computed: {
        strongtType () {  // 密码强度显示
          return 'strong-' + this.strongSize
        },
        strongSize () {
            let score = this.strength(this.ruleForm.newPass)
            return score < 6 ? 1 : (score <= 49 ? 2 : 3);
        }
    },
    components: {
        'el-button': Button
    },
    methods: {
         submitForm (formName, event) {
            event.preventDefault()
            let that = this
            that.$refs[formName].validate((valid) => {
                if (valid) {
                let url = '/Find/resetPwd'
                    axios.post(url, {
                        pwd: md5(that.ruleForm.newPass),
                        confirm: md5(that.ruleForm.checkPass)
                    })
                    .then((res) => {
                        if (res.stat === 1) {
                            that.$emit('showSetSuess', 3)
                        } else if(res.stat === -1) {
                           that.$alert('页面过期，请刷新重试', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    setTimeout(() => {
                                    window.location.reload()
                                }, 500)
                                },
                                showClose: false
                            })
                        } else {
                                that.$message({
                                showClose: true,
                                message: res.data,
                                type: 'error'
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                } else {
                    return false
            }
            })
        },
        isvalidPassword (str) {
             const reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/
            // const reg = /^$|^[^\d]*$|^[^a-zA-Z]*$|\s/
            return reg.test(str)
        },
        // 验证密码强度
        strength (password) {
            let score = 0
            /* 单独数字 */
            if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) { score += 5 }
            /* 特殊字符 */
            if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~,\[,\]].*[!,@,#,$,%,^,&,*,?,_,~,\[,\]])/)) { score += 5 }
            /* 单独字母 */
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) { score += 5 }
            /* 字母以及数字的组合 */
            if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) { score += 15 }
            /* 特殊字符以及数字 */
            if (password.match(/([!,@,#,$,%,^,&,*,?,_,~,\[,\]])/) && password.match(/([0-9])/)) { score += 15 }
            /* 特殊字符以及字母 */
            if (password.match(/([!,@,#,$,%,^,&,*,?,_,~,\[,\]])/) && password.match(/([a-zA-Z])/)) { score += 15 }
            /* 特殊字符+数字+字母 */
            if (password.match(/^\w+$/) && password.match(/^\d+$/) && password.match(/([!,@,#,$,%,^,&,*,?,~,\[,\]])/)) { score += 20 }
            return score
        }
    }
  }
</script>
<style lang='less'>
.set-new-password{
    .step{
        overflow: hidden;
        text-align: center;
        margin:90px 0;
    }
    .login-link{
        width: 380px;
        margin: 0 auto;
        .btn_login {
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: #ff3333;
            text-align: center;
            font-size: 18px;
            color:#fff;
            font-family: 'Microsoft Yahei';
            border:0;
            outline: none;
            border-radius: 3px;
            cursor: pointer;
        }
    }
    .password-content{
        width:380px;
        margin: 0 auto;
        .el-form{
            position: relative;
            .password-type{
            position: absolute;
            right:0;
            top:54px;
            color:#828282;
            font-size:12px;
            .security{
                display: inline-block;
                vertical-align: top;
                margin-top: 1px;
            }
            .strong-type{
                display: inline-block;
                width: 96px;
                height: 17px;
            }
            .strong-1{
                .strong-type; 
                background: url("../../../../common/assets/img/bg_strength.gif") no-repeat center 0;
            }
             .strong-2{
                .strong-type; 
                background: url("../../../../common/assets/img/bg_strength.gif") no-repeat center 0;
                background-position: 0% -30px;
            }
             .strong-3{
                .strong-type; 
                background: url("../../../../common/assets/img/bg_strength.gif") no-repeat center 0;
                 background-position: 0% -60px;
            }
            }
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
        }
        .el-button{
            background-color: #f13233;
            width: 100%;
            height: 50px;
            font-size: 14px;
            border: 0;
            color: #fff;
            border-radius: 3px;
            &:hover{
                background-color: #fa4747;
                color:#fff;
            }
        }
    }
}

</style>
