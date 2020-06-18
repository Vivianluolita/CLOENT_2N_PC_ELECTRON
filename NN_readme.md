# NN项目前端规范说明文档

## 项目描述

+ 使用electron和vue打包的桌面应用
+ 当前包含模块home、room、chat, 后续随业务需要添加
+ node使用版本v10.17.0

## 组件划分

+ 以模块为最外层组件名称(home、room、chat), 文件夹同名
+ 功能型模块且业务逻辑无重合划分到最小模块
  -  例如, 主页header有logo、tab切换、个人中心, 3块内容无业务逻辑交互且均包含自身的业务逻辑, 划分为3个小组件
+ 非功能型模块或业务逻辑交叉组件可划分到一个组件
  -  例如, 列表切换的工具栏涉及业务逻辑交互都影响主页列表渲染, 可分到一个组件使用公共方法

## 命名和使用规范

+ 路由
  - 理由命名用小写命名, 见名知意 
    ```
    room.vue
    chat.vue
    home.vue
    ```

+ 组件
  - 组件名用大驼峰命名, 见名知意, 第一个单词需与当前路由相关, 第二个单词与组件相关,  例如
    ```
    home.vue                            //路由
        HomeHeader.vue                  //子组件
        HomeContent.vue                 //子组件
        HomeFooter.vue                  //子组件
            HomeContentHeader.vue       //子组件HomeContent的子组件 
            homeContentFooter.vue       //子组件HomeContent的子组件 
    ```

+ css样式
  - 统一使用less 
  - 使用自适应屏幕的布局, 慎用计算属性
  - 样式命名统一通过 - 连接, 见名知意, 第一个单词需与当前路由相关, 第二个单词与组件相关, 最外层用wrap连接
    ```
    //room路由
    <template>
        <div class="room-wrap">
            <header class="room-header">
                <div class="room-header-xxx"></div>
                <div class="room-header-xxx"></div>
            </header>
            <aside class="room-aside-left">
                <div class="room-aside-left-xxx"></div>
                <div class="room-aside-left-xxx"></div>
            </aside>
            <section class="room-section">
                <div class="room-section-xxx"></div>
                <div class="room-section-xxx"></div>
            </section> 
            <aside class="room-aside-right">
                <div class="room-aside-right-xxx"></div>
                <div class="room-aside-right-xxx"></div>
            </aside>
            <footer class="room-footer">
                <div class="room-footer-xxx"></div>
                <div class="room-footer-xxx"></div>
            </footer>
        </div> 
    </template>
    ```

+ 函数
  - 组件内不定义方法, 方法全部放在electron里面, 页面通过ipc.send通知electron调用方法
  - 方法命名规则为小驼峰命名
    ```
    function openAgora(){
        ...
    }

    function stopAgora(){
        ...
    }
    ```
  - 方法调用方式
    - electron发送方式, '@src/mian/index',方法写在对应的路由文件夹中
      ```
      ipcMain.on('home_change_title', (event, params) => {
         //监听消息, "首页title改变"
         ...   //此处完成操作
         mainWindow.webContents.send('change_success', '已收到消息');
         //操作成功之后回复消息
      });
      ```
    - vue页面中发送方式
      ```
       export default {
            name: 'home',
            methods: {
                //在方法中使用ipcRenderer.send发送消息
                change_title (link) {
                    ipcRenderer.send('home_change_title', link)
                }
            },
            created () {
                //在页面创建成功之后监听electron返回的消息
                ipcRenderer.on('change_success', (event, params) => {
                    console.log('vue title: ', event, params)
                })
            }
       }
      ```
+ 变量
  - 变量命名用小写,使用下划线连接
    ```
    user_id
    user_name
    ```
+ 常量
  - 常量命名用大写
    ```
    const STATICPATH = 'https://static.nn.com'
    ```

