<template>
  <transition name="el-fade-in-linear">
    <div class="message-box">
      <div class="modal-adj-lesson">
        <div class="modal-header">
          <h3 class="adj-lesson-text">调课</h3>
          <a :data-xeslog-params='"key=xeslog-myCourse-click-ajaxChangeStuCourse-ocenter&action=click-click-ajaxChangeStuCourse&time=" + adjustTime + "&ajaxTime=" + ajaxTime' class="my-el-icon-close" href="javascript:void(0)"  @click="toogleAdjustCourse(false)">
            <i class="el-icon-close"></i>
          </a>
        </div>
        <div class="modal-body">
          <!-- 首屏 调课 -->
          <div class="first-screen" v-if="showIndex==0">
            <div class="adj-lesson-content">
              <div class="adj-lesson-hint">
                <i class="icon-jingtanhao-tips"></i>
                温馨提示：调课功能仅支持相同教学内容课程间的调换，可以调换上课时间，主讲老师。
              </div>
              <ul class="adj-lesson-hint-desc">
                <li>由于原辅导老师的开班数量及剩余名额有限，您可能被分到新辅导老师的班级，且无法调回原辅导老师班级中，请谨慎操作；</li>
                <li>配套录播课程不会更换；</li>
                <li>原课程已结束讲次不会更换为新课程对应讲次的回放。</li>
              </ul>
            </div>
            <!-- 调课的可选信息 -->
            <template v-if="adjustClassInfo != null">
              <template v-if="adjustClassInfo == '加载失败'">
                <div class="adj-lesson-info adjust-fail" style="padding: 40px 180px;">
                  <img src="~common/assets/img/monkey_null.png" alt="">
                  <p>很抱歉，数据加载失败!</p>
                </div>
              </template>
              <template v-else>
                <div class="adj-lesson-self">
                  当前上课信息：
                  <span class="adj-lesson-self-info">
                      {{adjustClassInfo.stuCouInfo.name}}
                    <em>
                      <span v-for="(name,index) in adjustClassInfo.stuCouInfo.teachers" v-if="index<2" :key="name.id + index">{{name.name}} </span>
                      <span v-if="adjustClassInfo.stuCouInfo.teachers.length>2">等</span>
                    </em>
                  </span>
                </div>
                <!-- <div class="adj-lesson-info adjust-fail" v-if="adjustClassInfo.courseList instanceof Array"> -->
                <div class="adj-lesson-info adjust-fail" v-if="adjustClassInfo.courseList.length == 0">
                  <img src="~common/assets/img/monkey_null.png" alt="">
                  <p>好遗憾，没有相同教学内容的课程可以调换!</p>
                </div>
                <template v-else>
                  <div class="adj-lesson-info">
                    <div class="adj-lesson-header"> 可调课程 <em>由于名额已满或其他原因，课程置灰不能调入。</em></div>
                    <div class="adj-lesson-main" >
                      <div
                        class= "lesson-info"
                        :class="[{'class-none':item.status==0},{'lesson-info-foreign-bg':item.preShow==1},{'lesson-info-hover':item.status==1},{'lesson-info-active':id==index}]"
                        v-for= "(item, index) in adjustClassInfo.courseList"
                        v-if="item.status!=0"
                        @click= "chooseFn(item.status,index)"
                        :key="item.id"
                      >
                        <i class="el-icon-circle-check lesson-info-check"></i>
                        <span class="lesson-info-name">
                          <p>{{item.name}}</p>
                          <em v-for="(name,index) in item.teachers" :key="name.id" v-if="index<2" :class="{'first' : index==0}">
                            {{name.name}}
                          </em>
                          <em v-if="item.teachers.length>2">
                            等
                          </em>
                        </span>
                      </div>
                      <div
                        class= "lesson-info"
                        :class="[{'class-none':item.status==0},{'lesson-info-foreign-bg':item.preShow==1},{'lesson-info-hover':item.status==1},{'lesson-info-active':id==index}]"
                        v-for= "(item, index) in adjustClassInfo.courseList"
                        v-if="item.status==0"
                        @click= "chooseFn(item.status,index)" :key="item.id"
                      >
                        <i class="el-icon-circle-check lesson-info-check"></i>
                        <span class="lesson-info-name">
                          <p>{{item.name}}</p>
                          <em v-for="(name,index) in item.teachers" v-if="index<2" :class="{'first' : index==0}" :key="name.id">
                            {{name.name}}
                          </em>
                          <em v-if="item.teachers.length>2">
                            等
                          </em>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="adj-lesson-opreation">
                    <button v-if='id != null' :data-xeslog-params='"key=xeslog-myCourse-click-ajaxChangeStuCourse-ocenter&action=click-ajaxChangeStuCourse&stuCouId="+ activeCourseInfo.stuCouId + "&courseId=" + adjustClassInfo.courseList[this.id].id + "&classId=" + adjustClassInfo.courseList[this.id].classId' @click="sendAdjLessonBtn">确认</button>
                    <button v-else @click="sendAdjLessonBtn" class='color-ccc'>确认</button>
                  </div>
                </template>
              </template>
            </template>
            <!-- 等待返回值 -->
            <template v-else>
              <div class="adj-lesson-info adjust-fail">
                <div class="el-loading-mask" style="">
                  <div class="el-loading-spinner">
                    <i class="el-icon-loading"></i>
                    <p class="el-loading-text">拼命加载中</p></div>
                </div>
              </div>
            </template>
          </div>

          <!-- 第二屏幕 调课成功 -->
          <div class="second-screen" v-if="showIndex==1">
            <div class="adj-lesson-success">
              <div class="left success-icon">
                <img src="~common/assets/img/monkey_success.png" alt="调课成功icon">
              </div>
              <div class="right success-info">
                <h3 class="adj-lesson-success-text">调课成功，记得要按时上课哦！</h3>
                <p>由</p>
                <p class="old-lesson-desc">
                  <span>{{adjustClassInfo.stuCouInfo.name.substring(0,55)}}{{adjustClassInfo.stuCouInfo.name.length>55 ? '...' : ''}}</span>
                  <em>
                    <span v-for="(name,index) in adjustClassInfo.stuCouInfo.teachers" v-if="index<2" :key="name.id">{{name.name}} </span>
                    <span v-if="adjustClassInfo.stuCouInfo.teachers.length>2">等</span>
                  </em>
                </p>
                <p>调至</p>
                <p class="adj-lesson-desc">
                  <span>{{adjustClassInfo.courseList[id].name.substring(0,55)}}{{adjustClassInfo.courseList[id].name.length>55 ? '...' : ''}}</span>
                  <em>
                    <span v-for="(name,index) in adjustClassInfo.courseList[id].teachers" v-if="index<2" :key="name.id">{{name.name}} </span>
                    <span v-if="adjustClassInfo.courseList[id].teachers.length>2">等</span>
                  </em>
                </p>
              </div>
            </div>
            <div class="adj-lesson-opreation">
            <button :data-xeslog-params='"key=xeslog-myCourse-click-closeChangeStuCourse-ocenter&action=click-closeChangeStuCourse&time=" + adjustTime + "&ajaxTime=" + ajaxTime' @click="toogleAdjustCourse(false)">完成</button>
            <button  :data-xeslog-params='"key=xeslog-myCourse-click-goStuCourse-ocenter&action=click-goStuCourse&time=" + adjustTime + "&ajaxTime=" + ajaxTime' @click="toogleAdjustCourse(false,true)">去学习中心</button>
            </div>
          </div>
          <!-- 第二屏幕 调课不成功-->
          <div class="second-screen" v-if="showIndex==2">
            <div class="adj-lesson-fail">
              <div class="left success-icon">
                <img src="~common/assets/img/monkey_fail.png" alt="调课失败icon">
              </div>
              <div class="right fail-info">
                <h3 class="adj-lesson-fail-text">调课失败！</h3>
                <div class="fail">{{failInfo}}</div>
              </div>
            </div>
            <div class="adj-lesson-opreation">
              <button @click="toogleAdjustCourse(false)">关闭</button>
               <button  @click="toogleAdjustCourse(false,true)">去学习中心</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/javascript">
   // import MockData3 from '../MockData/MockData3.js'
  import axios from '~common/assets/js/axios.js'
  export default {
    data () {
      return {
        id: null, // 选中数据的id
        showIndex: 0,
        courseName: null,
        failInfo: null,
        sendData: true,
        adjustTime: null,
        ajaxTime: null,
        isElishClass: 0  // 优先课程样式
      }
    },
    created () {
      this.adjustTime = Date.now()
    },
    mounted () {
      document.body.appendChild(this.$el)
      this.$nextTick(() => {
        // this.$lockScroll(true)
      })
    },
    destroyed () {
    //   this.$lockScroll()
    },
    props: ['adjustClassInfo', 'activeCourseInfo'],
    methods: {
      // 关闭弹层
      toogleAdjustCourse: function toogleAdjustCourse (val, isFlag) {
        if (isFlag) {
            this.$emit('toogleAdjustCourse', val)
            window.open('http://i.xueersi.com/study/MyCourses/index#/')
        }
        let _this = this
        this.$emit('toogleAdjustCourse', val)
        axios.adjustCourse && axios.adjustCourse.cancel()
        setTimeout(function () {
          _this.showIndex = 0
          _this.id = null
        }, 500)
      },
      // 选择课程
      chooseFn: function chooseFn (status, id) {
        if (status === 0) return
        this.id = id
        // console.log(1111)
      },
      // 点击发送请求
      sendAdjLessonBtn: function sendAdjLessonBtn () {
        if (this.id === null) return
        if (this.sendData) {
          this.sendData = false
          this.ajaxTime = Date.now()
          axios.post('//i.xueersi.com/study/Web/MyCourse/ajaxChangeStuCourse', {
            stuCouId: this.activeCourseInfo.stuCouId,
            courseId: this.adjustClassInfo.courseList[this.id].id,
            classId: this.adjustClassInfo.courseList[this.id].classId,
            cancelGroupName: 'ajaxChangeStuCourseOcenter'
          })
          .then((res) => {
            this.sendData = true
            if (res.stat === 1) {
              this.showIndex = 1
              this.courseName = this.adjustClassInfo.courseList[this.id].name
              this.adjustTime = Date.now() - this.adjustTime
              this.ajaxTime = Date.now() - this.ajaxTime
            }
            if (res.stat === 0) {
              this.showIndex = 2
              this.failInfo = res.data
              this.adjustTime = Date.now() - this.adjustTime
              this.ajaxTime = Date.now() - this.ajaxTime
            }
          })
          .catch(() => {
            this.sendData = true
            this.showIndex = 2
            this.adjustTime = Date.now() - this.adjustTime
            this.ajaxTime = Date.now() - this.ajaxTime
          })
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .icon-jingtanhao-tips{
    display: inline-block;
    vertical-align: middle;
    width:14px;
    height: 14px;
    background: url("../../assets/img/warn_tips.png") no-repeat;
    background-size: 100% 100%;
  }
  .message-box {
    overflow: scroll;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.6);
    .modal-adj-lesson {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -291.5px 0 0 -375px;
      width: 750px;
      height: 588px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 10px #666;
      .modal-header {
        height: 50px;
        line-height: 50px;
        padding: 0 10px 0 20px;
        border-radius: 5px 5px 0 0;
        background-color: #f5f5f5;
        color: #333;
        h3 {
          float: left;
          font-size: 16px;
          font-weight: normal;
        }
        .my-el-icon-close {
          display: block;
          color: #b4b4b4;
          float: right;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 22px;
          text-align: center;
          font-weight: normal;
          margin-top: 8px;
          position: relative;
          &:hover {
            border-radius: 15px;
            background-color: #f13232;
            color: #fff;
          }
        }
      }
      .modal-body {
        .screen-enter-active, screen-leave-active {
          transition: all .5s ease;
        }
        .first-screen, .second-screen {
          padding: 10px  20px;
        }
        .adj-lesson-hint {
          font-size: 14px;
          color: #666;
          line-height: 14px;
          .el-icon-warning {
            color: #f13232;
          }
          .icon-jingtanhao{
            color: #F13232;
          }
        }
        .adj-lesson-opreation {
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 86px;
          z-index: 10;
          background:linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,0.5));
          border-radius: 0px 0px 2px 2px ;
          text-align: center;
          button {
            outline: none;
            border: none;
            width: 140px;
            height: 46px;
            line-height: 46px;
            font-size: 16px;
            background-color: #f13232;
            color: #fff;
            cursor: pointer;
            margin-top: 20px;
            border-radius:2px;
            &:hover {
              background-color: #E02727;
              box-shadow: 0 0 10px #e5e5e5;
            }
          }
          .color-ccc{
            background: #ccc;
            // cursor: no-drop;
            cursor: default;
            &:hover{
              background-color: #ccc;
              box-shadow: 0 0 0 #fff;
            }
          }
        }
        .first-screen {
          /*position: relative;*/
          height:538px;
          overflow-y:auto;
          &：after{
            display: block;
            height: 86px;
            content:'';
            visibility: hidden;
          }
          .adj-lesson-content {
            height: 94px;
            padding: 10px 0px 10px 10px;
            border: 1px solid #e0e0e0;
            border-radius: 2px;
            background: rgba(249, 249, 249, 1);

            .adj-lesson-hint-desc {
              font-size: 12px;
              margin-top: 7px;
              li {
                position: relative;
                padding-left: 20px;
                line-height: 18px;
                color:#999;
                &:before {
                  content: '';
                  position: absolute;
                  top: 7px;
                  left: 5px;
                  display: inline-block;
                  width: 4px;
                  height: 4px;
                  border-radius: 2px;
                  background-color: #cbcbcb;
                }
              }
            }
          }
          .adj-lesson-self {
            height: 50px;
            display: table-cell;
            vertical-align: middle;
            font-size: 16px;
            color: #666;
            .adj-lesson-self-info {
              color: #f13232;
            }
          }
          .adj-lesson-info {
            /*height: 236px;*/
            min-height:236px;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            color: #666;
            font-size: 16px;
            margin-bottom: 86px;
            .adj-lesson-header {
              padding-left: 90px;
              height: 50px;
              line-height: 50px;
              font-size: 16px;
              color: #666666;
              em {
                display: inline-block;
                margin-left: 8px;
                font-size: 12px;
                color: #333333;
              }
            }
            .adj-lesson-main {
              padding: 0 20px;
              /*overflow-y: auto;*/
              /*height: 170px;*/
              .lesson-info {
                position: relative;
                overflow: hidden;
                height: 46px;
                line-height: 46px;
                border: 1px solid #e0e0e0;
                border-radius: 25px;
                margin-bottom: 11px;
                cursor: pointer;
                box-sizing: border-box;
                .lesson-info-check {
                  float: left;
                  margin: 0 0px 0 5px;
                  line-height: 46px;
                  font-size: 35px;
                  color: #e0e0e0;
                }
                .lesson-info-name {
                  display: inline-block;
                  width: 605px;
                  height: 46px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  p{
                    float: left;
                    width: 455px;
                    height: 46px;
                    margin-right: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .first{
                    margin-right: 3px;
                  }
                  em {
                    display: block;
                    width: 68px;
                    float: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
              .lesson-info-hover:hover, .lesson-info-active {
                border: 1px solid #F13232;
                /*background-color: transparent;*/
                line-height: 47px;
                .lesson-info-check {
                  line-height: 46px;
                  margin: 0 0px 0 4px;
                }
              }
              .lesson-info-active .lesson-info-check {
                color: #f13232;
              }
              .lesson-info-foreign-bg{
                background-color:#FFF5F5;
              }
            }
          }
        }
        .second-screen {
          .adj-lesson-fail{
            margin: 135px 0 100px;
            padding-left: 30px;
          }
          .adj-lesson-success,.adj-lesson-fail {
            margin: 100px 0;
            overflow: hidden;
            font-size: 16px;
            .left {
              float: left;
            }
            .right {
              float: right;
            }
            .success-icon {
              width: 290px;
              text-align: right;
              img {
                width: 180px;
              }
            }
            .success-info,.fail-info {
              width: 420px;
              text-align: left;
              padding: 0 20px;
              .fail{
                width: 235px;
                line-height: 26px;
              }
              .adj-lesson-success-text,.adj-lesson-fail-text {
                line-height: 60px;
                font-size: 24px;
                font-weight: normal;
                color: #f13232;
              }
              .adj-lesson-success-text{
                color: #333 !important;
              }
              .old-lesson-desc, .adj-lesson-desc {
                line-height: 26px;
                color: #f13232;
              }
            }
            .fail-info{
              width: 370px;
              margin-top: 35px;
            }
          }
        }
      }

    }
    .test {
      width: 200px;
      height: 200px;
      background-color: red;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -100px;
      margin-top: -100px;
    }
  }
  .adjust-fail{
    position: relative;
    padding: 40px 110px;
    .el-loading-spinner .el-loading-text {
      color: #409eff;
      margin: 3px 0;
      font-size: 14px;
      float: none;
      line-height: 40px;
    }
    .el-loading-spinner i{
      color: #f13232;
    }
    .el-loading-spinner .el-loading-text{
      color: #f13232;
    }
    img{
      float: left;
      width: 160px;
    }
    p{
      float: right;
      line-height: 170px;
      font-size: 16px;
      color: #666666;
    }
  }
  .class-none{
    position: relative;
    cursor: default !important;
    // cursor: no-drop !important;
    &:after{
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: #ffffff;
      opacity: 0.5;
    }
     &:hover{
        background: #ffffff !important;
      }
    .class-hover-div{
      display: none !important;
    }
  }
</style>
