<template>
    <div>
        <div class="finish_tips">
            密码已经修改成功，一定要保管好你的密码哦～            
        </div>
        <div class="login-link">
            <button class="btn_login" @click="jumpLogin">立即登录</button>
        </div>
   </div>
</template>
<script>
    export default {
        methods: {
           jumpLogin () {
                window.location = '//login.xueersi.com/login'
           } 
        }
    }
</script>
<style lang='less' scoped>
.finish_tips {
    height:200px;
    font-size: 24px;
    color:#333;
    text-align: center;
    background: url('../../../../common/assets/img/icon_finish.png') no-repeat center top;
    padding-top:100px;
    margin-top:170px;
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
             &:hover{
                background-color: #fa4747;
            }
        }
    }

</style>
