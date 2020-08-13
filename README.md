<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
  
  <p align="center">成功马一龙，失败贾老板！</p>
  <p align="left">
    鸣谢：
  </p>
  <p>左老板 <a href="https://github.com/notadd/nt-addon-pay" target="blank">nt-addon-pay</a> 省去编写微信支付的一些ts代码</p>
  <p>zoujingli <a href="https://github.com/zoujingli/WeChatDeveloper" target="blank">WeChatDeveloper</a> 很不错的php支付sdk！看了这位老哥代码，做支付宝支付的时候清晰很多!</p>
  <p>fym201 <a href="https://github.com/fym201/alipay-node-sdk" target="blank">WeChatDeveloper</a> 借用了一些代码~~</p>
  
## tips 

1. 项目正在开发中，随时可能进行大改，还有很多的功能没有实现。(退款等等)
2. 一个人开发精力有限，更新比较慢，bug可能比较多。也欢迎各位大佬提交代码。
3. 如果你有啥好的想法或者点子可以添加我的qq： 523431532（微信同号）


## 描述

一个nestjs编写的支付平台

## 安装

```bash
$ npm install
```

## 运行

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## 使用

需要先去配置后台配置对应的支付参数，拿到系统生成的APPID。然后你就可以愉快的去发送请求了~

```

curl --location --request POST 'http://127.0.0.1:3100/alipay/page?appid=APPID' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'total_amount=100' \
--data-urlencode 'out_trade_no=1123112312312321' \
--data-urlencode 'subject=不晓得'

```


## License

  Nest is [MIT licensed](LICENSE).



