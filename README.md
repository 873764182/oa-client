# 业务系统前端项目
```
基于VUE与ElementUI实现,项目中可以直接使用

系统的UI大量的参考了VUE-Element-Admin的布局

低侵入式/低污染的权限设计,对业务代码开发影响降到最低

当前系统是一个基础框架系统,可以在此系统基础上直接开发你的业务

修改根目录下的vue.config.js中的代理远程地址到你部署好的后台程序地址即可运行
```

### 相关项目地址
后端地址 [oa-service](https://github.com/873764182/oa-service)  
前端地址 [oa-client](https://github.com/873764182/oa-client)  
  
在线预览 [http://oa.panxiong.net](http://oa.panxiong.net)

### 项目目录结构
```
    标准的vue-cli-3.0项目结构
    components: 存放组件,相关性的多个组件应该建立一个子目录保存
    views: 存放页面级(一个组件是一个页面)组件,多个相关业务的页面应该建立子目录保存
    utils: 存放一些公关对象
    router: 路由信息
```

# 开始使用,编写自己的业务代码
```
1. 在 utils/RemoteApis.js 里定义你在后端系统 "oa-service" 给出的接口

2. 在 views 目录下建立你的页面文件,根据你的业务划分考虑是否应该建立子目录
   建立子目录的目的是好划分业务,如果你觉得没必要可以直接放在views根目录

3. 在 router/menus.js 中为你的页面指定路由路径, 同时将页面需要的所有后端接口在路由的mate的apis中声明

4. 在你的页面中使用"this.$route.meta.apis.xxx"访问后端接口(xxx是你在第三步中声明的名称)

5. 使用"v-permission"指令将相关的界面控件依赖的接口绑定起来
   如:有个添加用户的按钮,这个按钮B,按钮B会关系到添加用户的后端接口A
   则:在B上添加v-permission='A'指令

6. 在nginx中设置好跨域代理(/apis/),然后打包丢到nginx中即可
```

# 关于权限控制的说明
```
因为权限控制是依托API检测来实现的,所以必须把每个页面依赖的接口事先声明出来,所以在路由mate中声明了依赖的接口列表

页面中可以不用"this.$route.meta.apis.xxx"的方式,而是直接导入接口方法,页面也能访问后端接口,但是这样不好做权限控制

如果在页面中使用的接口在路由的mate中没有声明,系统将不知道这个页面依赖了这个接口,也就做不到权限的约束

当然,也不用担心,前端权限控制失效了,后端还是会拦截没有权限的请求的,业务功能也不会有影响

只是页面的UI展示变得不合逻辑,明明没有权限的操作,就不要显示出来给用户看会比较合理

声明页面依赖接口的形式只是控制了页面的显示与隐藏,但是要是页面依赖的10个接口中,只要用户拥有访问其中1个的权限

这个页面也是要给用户显示出来的, 剩余的9个不能操作控制通过"v-permission"指令来判断页面的元素隐藏

隐藏掉用户不能操作的按钮或者其他控件
```

# 权限配置的步骤
```
1. 使用超级管理员账号密码(12345678900/12345678)登录系统

2. 打开"/系统配置/权限定义"配置一个权限,赋予这个权限接口,不同的接口,可以访问不同的界面

3. 打开"/人员管理/系统用户"添加一个用户,用户信息根据需要填写

4. 打开"/人员管理/角色管理"配置一个角色,角色信息根据需要填写

5. 添加完成角色后,点击角色的"更多信息"按钮,切换到角色的"权限配置"选项卡,勾选在第2步创建的权限,点击"保存"按钮保存

6. 切换到角色的"用户列表"选项卡,点击"添加"按钮添加用户.

7. 在弹出的框中,输入你在第3步添加的用户的电话号码点击"确定"按钮即可

8. 退出当前登录的账号

9. 登录你新增的用户账号,即可看到与"超级管理员"不同的界面效果
```
