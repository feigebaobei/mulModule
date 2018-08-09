<template>
    <div class="password">
        <account-nav
      :type="'text'"
      :tabValue="'修改密码'"
      :slipper="false"
    ></account-nav>
    <div class="password-content">
        <el-form label-width="100px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" status-icon>
             <el-form-item label="当前密码:" prop="currentPass" :error="msgError">
                <el-input type="password"  placeholder="请输入当前网站密码" v-model="ruleForm.currentPass" auto-complete="off" maxlength="18" onkeydown="if(event.keyCode==32) return false"></el-input>
            </el-form-item>
             <el-form-item label="新密码:" prop="newPass">
                <el-input type="password" placeholder="请设置密码" v-model="ruleForm.newPass" auto-complete="off" maxlength="18" onkeydown="if(event.keyCode==32) return false"></el-input>
            </el-form-item>
            <div class="password-type" v-show="passwordtypeShow">
                <span class="security">安全强度</span>
                <strong :class="strongtType"></strong>   
            </div>
             <el-form-item label="确认密码:" prop="checkPass">
                <el-input type="password" placeholder="请输入确认密码" v-model="ruleForm.checkPass" auto-complete="off" maxlength="18" onkeydown="if(event.keyCode==32) return false"></el-input>
            </el-form-item>
             <button  class="el-button" @click="submitForm('ruleForm', $event)">保存</button>
        </el-form>
    </div>
    </div>
</template>
<script>
/* eslint-disable */
import accountNav from '@/components/sub/accountNav.vue'
import { Button} from 'element-ui'
import axios from 'axios'
export default {
    data () {
        let validCurrentPass = (rule, value, callback) => {
            if (!value) {
                   callback(new Error('请输入当前网站密码')) 
                } else if (value.length < 6) {
                   callback(new Error('密码不能少于6位字符'))
                } else {
                    callback()
                }
            }
        let validNewPass = (rule, value, callback) => {
             this.passwordtypeShow = false
             if (!value) {
                callback(new Error('请输入新密码'))
               } else if (!this.isvalidPassword(value)) {
                   callback(new Error('密码中必须包含数字和字母'))
                } else if (value.length < 6) {
                     callback(new Error('密码不能少于6位字符'))
                } else if (value == this.ruleForm.currentPass) {
                     callback(new Error('新密码与当前密码相同'))
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
                currentPass: '', // 当前密码
                newPass: '',  // 新密码
                checkPass: '' // 确认密码
            },
            passwordtypeShow: false,
            passErroe:'',
            rules: {
                currentPass: [{trigger: 'blur', validator: validCurrentPass}],
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
        accountNav,
        'el-button': Button
    },
    methods: {
         submitForm (formName, event) {
            event.preventDefault()
            let that = this
            that.$refs[formName].validate((valid) => {
                if (valid) {
                let url = '/Profile/resetPwd'
                 that.msgError = ''
                    axios.post(url, {
                        curPwd: md5(that.ruleForm.currentPass),
                        toPwd: md5(that.ruleForm.newPass),
                        confirm: md5(that.ruleForm.checkPass)
                    })
                    .then((res) => {
                        if (res.stat === 1) {
                            that.$message({
                                showClose: true,
                                message: '修改密码成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                window.location = '//login.xueersi.com/login'
                            },1000)
                        } else {
                            that.msgError = res.data
                            //  that.$refs.ruleForm.fields[0].error = res.data
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
            // 必须包含数字和字母
            const reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/
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
.password{
    height: 100%;
    background: #fff;
    .password-content{
        width:360px;
        margin: 60px 90px 0;
        .el-form{
            position: relative;
            .password-type{
            position: absolute;
            right:0;
            top:105px;
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
                 margin-bottom: 30px;
                 .el-form-item__label{
                     color:#666
                 }
                  .el-form-item__error{
                     line-height: 20px;
                     color:#f00;
                   }
                .el-input{
                    height: 35px;
                     .el-input__inner{
                         height: 100%;
                         line-height: 35px;
                         color:#666;
                     }
                }
                .el-form-item__content{
                    line-height: 35px;
                }
                .el-form-item__label{
                    line-height: 35px;
                }
            }
        }
        .el-button{
            background-color: #f13233;
            width: 110px;
            height: 35px;
            margin: 0px 30px 0 100px;
            font-size: 14px;
            border: 0;
            color: #fff;
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
