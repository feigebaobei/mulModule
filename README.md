# 订单中心

### 注： 切记每次上线必须找后台更新版本号

## 一、Build Setup

``` bash
# 仓库地址
git clone https://e.coding.net/xue/ocenter.git

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev 项目文件夹名

# build for production with minification
npm run build 项目文件夹名

# build for production and view the bundle analyzer report
npm run build --report
```

## 二、业务模块划分(module)

##### 1.index(不用)

##### 2.order:订单模块(包含订单列表、订单详情、申请退课、申请退兑换卡)

##### 3.balance:我的余额

##### 4.sendCard:赠课卡



## 三、公共模块(common)
![image](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/a7db6834548af2992e1b975658dd0a4415c1c536531072fb48369a0ca8a21c8a09c9e0e35034fbae73650b1d722adff7?pictype=scale&from=30111&version=3.3.3.3&uin=827729574&fname=image.png&size=1024)

## 四、git分支管理规范

#### 1. 本地开发
- 拉取最新master分支
- 从mater分支上新建自己的开发分支进行本地开发；

#### 2.提测规范
- 拉取远程test(测试分支)分支至最新
- 将自己的开发分支合并到test分支上，打包提测

#### 3.上线规范
- 拉取master分支至最新
- 从最新mater上新切一个待上线分支
- 将自己的开发分支合并到待上线分支上，打包修改模块后重新同步到测试环境，进行上线
- 【切记】上线无误后将该待上线分支合并到master上
- 【切记】上线后找后台更新线上版本号
