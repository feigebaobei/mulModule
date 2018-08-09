<template>
    <div class="image-container">
        <div class="image-left-box">
            <div class="update-imgae-bax">
                <el-upload
                        class="avatar-uploader"
                        name="avatar"
                        ref="upload"
                        :multiple="false"
                        :auto-upload="false"
                        :show-file-list="false"
                        :action="importFileUrl"
                        :on-change="fileChange"
                        :with-credentials="withCredentials" 
                        :class="{'avatar-uploader-img':imageUrl}"
                        >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <span v-if="!imageUrl" class="upload-text">上传头像
            </span>
                </el-upload>
                <div class="upload-type-tips" v-if="!imageUrl">仅支持JPG、GIF、PNG且文件小于2M，照片尺寸请大于200×200</div>
                <el-button type="primary" @click="saveImage">保存</el-button>
                <!-- <el-button v-show="imageUrl" class="input-load" type="primary" @click="uploadImage"><i class="el-icon-plus avatar-uploader-input"></i>上传头像</el-button> -->
            </div>
        </div>
        <div class="image-right-box">
            <!--头像缩略图预览开始-->
            <p class="preview-title">预览</p>
            <p>您选定的头像会生成3种尺寸，请注意各尺寸的头像是否清晰</p>
            <div class="hp-small">
                <img v-if="imageUrl" :src="imageUrl">
                <img v-else :src="previewImgUrl">
                <div class="size">40×40像素</div>
            </div>
            <div class="hp-middle">
                <img v-if="imageUrl" :src="imageUrl">
                <img v-else :src="previewImgUrl">
                <div class="size">60×60像素</div>
            </div>
            <div class="hp-big">
                <img v-if="imageUrl" :src="imageUrl">
                <img v-else :src="previewImgUrl">
                <div class="size">100×100像素</div>
            </div>
        </div>
        <!--头像缩略图预览结束-->
    </div>
</template>
<script>
    import {Button} from 'element-ui'
    import axios from 'axios'
    export default {
        props: ['userInfo'],
        data () {
            return {
                imageUrl: '', // 当前上传图片
                previewImgUrl: '', // 预览图片
                withCredentials: '',  // cookie
                importFileUrl: '//account.xueersi.com/Profile/resetAvatar', 
                finishUpload: false,  // 上传之后，清楚img
                rejectedFinishUpload: false, // 取消上传之后清楚
                infoImage: ''  // 用户头像
            }
        },
        components: {
             'el-button': Button
        },
        mounted () {
            this.infoImage = this.userInfo.avatar_path + '?v=' + this.userInfo.avatar_version
            this.previewImgUrl = this.infoImage
        },
        methods: {
            fileChange (file, fileList) {
              // 只保留一个文件
              if (fileList.length > 1) {
                 fileList.shift()
              }
                let flag = this.beforeAvatarUpload(file)
                // 通过验证并且没点击确定的时候也没点击取消的时候
                if (flag && !this.finishUpload) {
                  // console.log(flag, this.finishUpload, 'flag1')
                  // console.log(111111)
                   this.imageUrl = URL.createObjectURL(file.raw)
                   this.previewImgUrl = URL.createObjectURL(file.raw)
                 } else if (flag && this.finishUpload) {
                    // console.log(flag, this.finishUpload, 'flag2')
                    this.previewImgUrl = URL.createObjectURL(file.raw)
                    this.infoImage = URL.createObjectURL(file.raw)
                    this.finishUpload = false
               }
            },
            beforeAvatarUpload (file) {
                let curFile = file.raw
                const isJPG = curFile.type === 'image/jpeg'
                const isPNG = curFile.type === 'image/png'
                const isGIF = curFile.type === 'image/gif'
                const isLt2M = curFile.size / 1024 / 1024 < 2

                if (!isJPG && !isPNG && !isGIF) {
                    this.$message.error('图片必须为 JPG, GIF, PNG 类型!')
                     return 
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!')
                     return 
                }
                  return true
            },
            uploadImage () {
                // 触发input的默认上传事件
                let uploadElement = document.querySelector('.el-upload__input')
                uploadElement.click()
            },
            // 保存图片
            saveImage () {
                if (!this.imageUrl) {
                    this.$message({
                        showClose: true,
                        message: '请选择图片',
                        type: 'error'
                    })
                } else {
                    this.confirmImage()
                }
            },
            // 确认上传
            confirmImage () {
                this.$confirm('是否确定上传头像？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this.submitUpload()
                    this.imageUrl = ''
                    this.finishUpload = true
                }).catch(() => {
                     this.imageUrl = ''
                     this.previewImgUrl = this.infoImage
                })
            },
            // 提交到服务器
            submitUpload () { 
                this.$refs.upload.submit()
                 this.$message({
                    showClose: true,
                    message: '上传头像成功',
                    type: 'success'
                })
            }
        }
    }
</script>
<style lang='less'>
    .image-container{
        padding: 40px 20px 50px 20px;
        overflow: hidden;
        height: 580px;
        background: #fff;
        .image-left-box{
            float: left;
            width:72%;
            .update-imgae-bax{
                width: 420px;
                height: 450px;
                margin: 0 auto;
                position: relative;
                .avatar-uploader{
                    width: 400px;
                    height: 340px;
                    background-color: #f5f5f5;
                    position: relative;
                }
                .upload-text{
                    font-size: 16px;
                    color:#333;
                }
                .el-button{
                    padding: 0;
                    text-align: center;
                    line-height: 35px;
                }
                .el-button--primary, .avatar-uploader-button{
                    margin-top:20px;
                    width: 100px;
                    height: 35px;
                    font-size: 14px;
                    background-color: #f13232;
                    border-color: #f13232;
                    &:hover{
                        background-color: #fa4747;
                    }
                }
                .input-load{
                    position: absolute;
                    right: 20px;
                    text-align: center;
                }
            }
            .upload-type-tips{
                position: absolute;
                top: 240px;
                left: 35px;
                font-size: 12px;
                color: #999999;
            }
        }
        .image-right-box{
            float: left;
            border-left: 1px solid #eaeaea;
            color: #666666;
            font-size: 12px;
            padding: 0 50px;
            width: 27%;
            height: 460px;
            .preview-title{
                font-weight: bold;
                color: #666666;
            }
            img{
                display: block;
                margin: 30px auto 10px;
                border-radius: 50%;
                padding: 4px;
                border: 1px solid #dedede;
            }
            .size{
                text-align: center;
            }
            .hp-small{
                img{
                    width: 40px;
                    height: 40px;
                }
            }
            .hp-middle{
                img{
                    width: 60px;
                    height: 60px;
                }
            }
            .hp-big{
                img{
                    width: 100px;
                    height: 100px;
                }
            }

        }
    }
    .avatar-uploader .el-upload {
        border: 1px solid #bfbfbf;
        width: 150px;
        height: 42px;
        line-height: 42px;
        background: #fff;
        margin:0 auto;
        cursor: pointer;
        overflow: hidden;
        border-radius: 2px;
        color: #333;
        margin:150px 0 0 125px;
    }
    .avatar-uploader-img .el-upload {
      border: 1px solid transparent;
       background: transparent;
}
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 16px;
        color: #333;
        line-height: 42px;
        text-align: center;
    }
    .avatar {
        max-width: 400px;
        max-height: 340px;
        position: absolute;
        z-index: 20;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%)
    }
</style>


