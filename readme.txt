移动端项目搭建:
1.安装node
  安装完成后，终端输入如下命令显示版本号即安装成功
  node -v
  npm -v
2.推荐安装cnpm
  2.1安装cnpm
     npm install cnpm -g --registry=https://registry.npm.taobao.org
  2.2检查cnpm是否安装成功
     cnpm -v
3.全局安装gulp
     cnpm install gulp -g
4.安装gulp插件
     cnpm install
5.自定义gulp任务说明:
     gulp site-0          //开发环境
     gulp site-0-release  //开发环境正式版
     gulp site-1          //测试环境
     gulp site-1-release  //测试环境正式版
     gulp site-2          //uat
     gulp site-2-release  //uat正式版
     gulp site-3          //生产环境
     gulp site-3-release  //生产环境正式版
