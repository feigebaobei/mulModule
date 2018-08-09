<template>
    <div class="profile">
        <div class="profile-wrapper" >
            <div class="profile-group">
                <span class="group-item" v-for="(tab, index) in tabs" :key="tab.id" :class="{cur:iscur===index}" @click="tabChange(tab,index)" >{{tab.name}}</span>
            </div>
            <keep-alive>
                <component :is="tabview" :userInfo="userInfo" class="base-content-box" v-if="userInfo.id"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
    import BaseInfo from '@/components/baseInfo.vue'
    import HeadImage from '@/components/headImage.vue'
    import {Loading} from 'element-ui'
    import axios from 'axios'
    export default {
        data () {
            return {
                tabview: 'baseInfo',
                iscur: 0,
                tabs: [
                    {name: '基础资料', type: 'baseInfo'},
                    {name: '头像设置', type: 'headImage'}
                ],
                userInfo: {},
                loadFlag: false,  // 加载信息
                loadingInstance: null,
                loadingTimer: null
            }
        },
        components: {
            BaseInfo,
            HeadImage
        },
        watch: {
            loadFlag: function () {
                if (!this.loadFlag) {
                    this.loadingInstance.close()
                    this.loadingInstance = null
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.loading('.base-content-box')
                this.getUserInfo()
            })
        },
        methods: {
            tabChange (tab, index) {
                this.iscur = index
                this.tabview = tab.type
            },
            getUserInfo () {
              //   let url = 'https://easy-mock.com/mock/5b3c8fe51f38430dca0af7b6/info/profile/info'
                 let url = '/Profile/info'
                axios.get(url).then((res) => {
                    this.loadFlag = false
                    clearTimeout(this.loadingTimer)
                    if (res.stat === 1) {
                        this.userInfo = res.data
                    }
                })
                    .catch((err) => {
                        clearTimeout(this.loadingTimer)
                        this.loadFlag = false
                        console.log(err)
                    })
            },
            loading (selector) {
                let loadTime = 400
                this.loadingTimer = setTimeout(() => {
                    this.loadFlag = true
                    if (this.loadFlag) {
                        this.loadingInstance = Loading.service({
                            target: document.querySelector(selector),
                            text: '拼命加载中',
                            spinner: 'el-icon-loading',
                            fullscreen: false,
                            background: 'rgba(255, 255, 255, 0.8)',
                            customClass: 'loading'
                        })
                    }
                    clearTimeout(this.loadingTimer)
                }, loadTime)
            }
        }
    }
</script>
<style lang='less' scoped>
    .profile{
        .profile-wrapper{
            background-color: #fff;
            .profile-group{
                width: 100%;
                border-bottom: 1px solid #e5e5e5;
                height: 50px;
                line-height: 30px;
                padding: 10px 20px;
                font-size: 0;
                box-sizing: border-box;
                .group-item{
                    display: inline-block;
                    font-size: 16px;
                    margin-right:35px;
                    cursor: pointer;
                    color:#666;
                    &:hover{
                        color:#f13232;
                    }
                }
                .cur{
                    font-weight: 600;
                    color:#333;
                    &:hover{
                        color:#333;
                    }
                }
            }
            .base-content-box{
                height: 100%;
                box-sizing: border-box;
                overflow: hidden;
            }
        }
    }
</style>

