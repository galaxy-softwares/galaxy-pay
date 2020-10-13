<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
  
  <p align="center">成功马一龙，失败贾老板！</p>
  <p align="left">
    鸣谢(不分前后)：
  </p>
  <p>左老板 <a href="https://github.com/notadd/nt-addon-pay" target="blank">nt-addon-pay</a> 省去编写微信支付的一些ts代码</p>
  <p>zoujingli <a href="https://github.com/zoujingli/WeChatDeveloper" target="blank">WeChatDeveloper</a> 很不错的php支付sdk！看了这位老哥代码，做支付宝支付的时候清晰很多!</p>
  <p>fym201 <a href="https://github.com/fym201/alipay-node-sdk" target="blank">WeChatDeveloper</a> 借用了一些代码~~</p>
  <p>weishour 提供的日志</p>

## tips 

1. 支付宝代码不会有太大的调整，支付宝还有几个接口没写。微信xml解析后期变动会比较大。等把微信的接口改完就开始编写接口文档。
2. 一个人开发精力有限，更新比较慢，bug可能比较多。也欢迎各位大佬提交代码。
3. 如果你有啥好的想法或者点子可以添加我的qq： 523431532（微信同号）


## 描述

一个nestjs编写的支付平台

<div align="center">
  <img src="https://github.com/martin-yin/galaxy_pay/blob/master/project_process.jpg" width="700" height="500">
</div> 

<p align="center">支付流程介绍</p>

## 安装

```bash
$ npm install
```

## 运行

```bash
# development
$ npm run start

// 数据登陆账号插入
INSERT INTO `user` VALUES (1, '2020-08-13 17:48:54.426045', '2020-08-13 17:48:54.426045', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '523431532@qq.com');

# watch mode
$ npm run start:dev

```

## 使用

需要先去配置后台配置对应的支付参数，拿到系统生成的APPID。然后你就可以愉快的去发送请求了~

```bash
curl --location --request POST 'http://127.0.0.1:3100/alipay/page' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'appid=j5Se66PgGopFwkfyEv6xMVBYtacbiOCI' \
--data-urlencode 'money=0.01' \
--data-urlencode 'out_trade_no=1241234234234253454' \
--data-urlencode 'body=不知道' \
--data-urlencode 'notify_url=https://pay-test.utools.club/alipay_notify_url' \
--data-urlencode 'return_url=https://pay-test.utools.club'
```


## 最后

to be or not to be, this is a question.


## License

  Nest is [MIT licensed](LICENSE).



