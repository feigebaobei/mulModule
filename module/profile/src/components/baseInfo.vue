<template>
    <div>
        <div class="base-box">
            <el-form class="base-content" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="用户名:" prop="userName" >
                    <div class="userName">{{ruleForm.name}}</div>
                </el-form-item>
                <el-form-item label="昵称:" prop="nickname" ref="nickName">
                    <el-input v-model="ruleForm.nickname" auto-complete="off"   @focus="nickNameFocus"  @blur="nickNameShow=false" maxlength="18"></el-input>
                    <div class="nick-name-tip" v-show="nickNameShow">请输入不超过6个汉字、18个字母或18个数字</div>
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realname"  v-if="!ruleForm.is_realname_mod" ref="realName">

                    <el-input v-model="ruleForm.realname" auto-complete="off"  @focus="realNameFocus"  @blur="realNameShow=false" maxlength="6"></el-input>
                    <div class="nick-name-tip" v-show="realNameShow">请输入不超过6个汉字</div>
                    <span class="real-name-tip">仅有一次修改机会哦，请珍惜！</span>
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realkname" v-else>
                    <div class="realkname">{{ruleForm.realname}}</div>
                    <div class="real-name-tip-changed">真实姓名仅有一次修改机会，还有其他问题<a href="###" class="zhiCustomBtn" @click='NameZiXun'  data-xeslog-params="key=xeslog-myocenter-account&action=click-Namezixun">点击咨询</a></div>
                </el-form-item>
                <el-form-item label="英文名:" prop="en_name" ref="enName">
                    <el-input v-model="ruleForm.en_name" auto-complete="off"   @focus="enNameFocus"  @blur="enNameShow=false" maxlength="12"></el-input>
                    <div class="nick-name-tip" v-show="enNameShow">请输入不超过12个字母</div>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio-group v-model="ruleForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                        <el-radio :label="3">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年级:" prop="grade">
                    <el-select v-model="ruleForm.grade_name" placeholder="请选择年级" @change="selectGet">
                        <el-option v-for="item in gradeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <div class="grade-tips">学而思网校会在每年7月1日自动为你更新年级</div>
                </el-form-item>
                <el-form-item label="生日:" prop="birthday">
                    <el-date-picker v-model="ruleForm.birthday" type="date" placeholder="请选择日期"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">></el-date-picker>
                </el-form-item>
                <el-form-item label="所在地:" prop="local" >
                    <div class="local">
                        <span>{{ruleForm.province_name}}</span>
                        <span>{{ruleForm.city_name}}</span>
                        <span>{{ruleForm.country_name}}</span></div>
                </el-form-item>
                <el-form-item label="学校:" prop="school" >
                    <el-input v-model="ruleForm.school" maxlength="30"></el-input>
                </el-form-item>
                <el-button type="primary" class="el-button" @click="submitForm('ruleForm')">保存</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {RadioGroup, Button, Loading} from 'element-ui'
    export default {
        props: ['userInfo'],
        data () {
           let validNickName = (rule, value, callback) => {
                let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,18}$/
                let chLen = this.GetChinese(value) ? this.GetChinese(value).length : 0
                let regElis = /^[0-9a-zA-Z]$/
                let strLgen = 0
                if (!regElis.test(value) && chLen > 0) {
                   strLgen = (value.length - chLen) + chLen * 3
                   console.log(strLgen)
                } else {
                     strLgen = value.length
                }
                if (!value) {
                    callback(new Error('请输入昵称'))
                } else if (chLen > 6) {
                    callback(new Error('昵称中文长度不能超过6个'))
                } else if (strLgen > 18) {
                    callback(new Error('昵称中文长度不能超过6个'))
                } else if (!reg.test(value)) {
                    callback(new Error('只能输入数字、汉字和字母'))
                } else {
                    callback()
                }
            }
            let validRealnName = (rule, value, callback) => {
                let reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{1,6}$/
                if (!value) {
                    callback(new Error('请输入真实姓名'))
                } else if (!reg.test(value)) {
                    callback(new Error('只能输入汉字'))
                } else {
                    callback()
                }
            }
            let validElishName = (rule, value, callback) => {
                let reg = /^[a-zA-Z ]{1,12}$/
                if (value == '') {
                    callback()
                } else if (!reg.test(value)) {
                    callback(new Error('只能输入英文字母'))
                } else {
                    callback()
                }
            }
            let validSchool = (rule, value, callback) => {
                let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,50}$/
                if (value == '') {
                    callback()
                } else if (!reg.test(value)) {
                    callback(new Error('只能输入数字、汉字和字母'))
                } else {
                    callback()
                }
            }
            return {
                ruleForm: {
                    name: '',
                    nickname: '', // 昵称
                    realname: '',
                    en_name: ' ',  // 英文名
                    sex: '', // 性别
                    grade_id: '', // 年级
                    grade_name: '',
                    birthday: '', // 生日
                    province_name: '',
                    city_name: '',
                    country_name: '',
                    is_realname_mod: '',  // 真实姓名已经更改过  1可改 0 不可改
                    school: '' // 学校
                },
                rules: {
                    nickname: [{trigger: 'blur', validator: validNickName}],
                    realname: [{trigger: 'blur', validator: validRealnName}],
                    en_name: [{trigger: 'blur', validator: validElishName}],
                    school: [{trigger: 'blur', validator: validSchool}]
                },
                nickNameShow: false,  // 昵称格式提示信息
                realNameShow: false,
                enNameShow: false,
                loadFlag: false,  // 加载信息
                loadingInstance: null,
                loadingTimer: null,
                gradeData: [
                    {label: '大班', value: '1'},
                    {label: '一年级', value: '2'},
                    {label: '二年级', value: '3'},
                    {label: '三年级', value: '4'},
                    {label: '四年级', value: '5'},
                    {label: '五年级', value: '6'},
                    {label: '六年级', value: '7'},
                    {label: '初一', value: '8'},
                    {label: '初二', value: '9'},
                    {label: '初三', value: '10'},
                    {label: '高一', value: '11'},
                    {label: '高二', value: '12'},
                    {label: '高三', value: '13'}
                ]
            }
        },
        components: {
            'el-radio-group': RadioGroup,
            'el-button': Button
        },
        mounted () {
            this.ruleForm = this.userInfo
            this.ruleForm.sex = Number(this.userInfo.sex)
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/Profile/modify'
                        axios.post(url, {
                            enName: this.ruleForm.en_name,
                            nickname: this.ruleForm.nickname,
                            realname: this.ruleForm.realname,
                            gradeId: this.ruleForm.grade_id,
                            birthday: this.ruleForm.birthday,
                            sex: this.ruleForm.sex,
                            school: this.ruleForm.school,
                            cancelGroupName: 'formInfoModify'
                        })
                            .then((res) => {
                                if (res.stat === 1) {
                                    this.$message({
                                        showClose: true,
                                        message: '修改信息成功',
                                        type: 'success'
                                    })
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 500)
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: res.data,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                })
            },
            selectGet (val) {
                this.ruleForm.grade_id = val
            },
            nickNameFocus () {
                this.nickNameShow = true
                this.$refs.nickName.clearValidate()
            },
            realNameFocus () {
                this.realNameShow = true
                this.$refs.realName.clearValidate()
            },
            NameZiXun () {
                if (document.getElementById('zhichiBtn')) {
                    document.getElementById('zhichiBtn').click()
                }
            },
            enNameFocus () {
                this.enNameShow = true
                this.$refs.enName.clearValidate()
            },
            GetChinese (strValue) {  // 截取汉字
                if (strValue != null && strValue != '') {
                    let reg = /[\u4e00-\u9fa5]/g
                    return strValue.match(reg)
                } else {
                    return ''
                }
            }
        }
    }
</script>
<style lang='less'>
    .base-box{
        height: 100%;
        padding: 10px 20px 20px 20px;
        box-sizing: border-box;
        overflow: hidden;
        .base-content{
            padding: 40px 60px 0 60px;
            font-size: 14px;
            color:#333;
            .el-form-item{
                position: relative;
                .el-input{
                    width: 260px;
                    .el-input__inner{
                        height: 35px;
                        line-height: 35px;
                    }
                }
                .nick-name-tip{
                    position: absolute;
                    left:0;
                    font-size: 12px;
                    color:#999;
                    height: 20px;
                    line-height: 20px;
                    top:36px;
                }
                .real-name-tip{
                    font-size: 12px;
                    margin-left: 20px;
                    color: #f13232;
                }
                .grade-tips{
                    font-size: 12px;
                    color:#999;
                    line-height: 12px;
                    margin-top: 10px;
                }
                .real-name-tip-changed{
                    color:#999;
                    font-size: 12px;
                    line-height: 14px;
                    a{
                        color: #3399ff;
                        margin-left: 3px;
                    }
                }
                .el-radio__label{
                    color:#333;
                }
            }
            .el-form-item__content{
                line-height: 35px;
            }
            .el-form-item__label{
                line-height: 35px;
                color:#666;
            }
            .el-button{
                background-color: #f13233;
                width: 100px;
                height: 35px;
                margin: 0px 30px 0 100px;
                font-size: 14px;
                border: 0;
                color: #fff;
                &:hover{
                    background-color: #fa4747;
                }
            }
        }
    }
</style>
