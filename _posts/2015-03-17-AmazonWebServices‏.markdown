---
layout: post
title:  Amazon Web Services‏搭建一个Socket 5代理来访问google
date:   2015-03-17 15:20:57
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---
最开始怎么注册账号就不说了,附上地址[https://console.aws.amazon.com](https://console.aws.amazon.com)
不翻墙也可以访问,前面都是中文的, 唯一的需求的就是你要有一张信用卡,注册好了,然后就建立一个最基础的虚拟机.建立方式按照提示一步步走,看见可以选择`Free tier eligible`就要选择这个就对了.附上一张配置图,差不多照着来就OK了,唯一需要注意的就是`Auto-assign Public IP`要设置成`Enable` 

<!-- more -->
![配置图](/images/ams02.png)

都配置完了就可以从终端登录了,登录就是`ssh`过去就可以了,在你点击`launch`的时候会提示你

![Connect](/images/ams01.png)
做到这里就需要安装软件了
终端登录过去
``` bash
//开发工具
#yum groupinstall "Development tools"
//安装编译前的一些依赖
#yum install -y pam-devel openldap-devel openssl-devel
//安装ss5 http://ss5.sourceforge.net/software.htm
#wget http://hivelocity.dl.sourceforge.net/project/ss5/ss5/3.8.9-8/ss5-3.8.9-8.tar.gz
#tar xzf ss5-3.8.9-8.tar.gz
#cd ss5-3.8.9-8
#./configure
#make&& make install
//配置Socket 5
#vim /etc/opt/ss5/ss5.conf
//取消两条注释
auth 0.0.0.0/0  -  -
permit - 0.0.0.0/0 – 0.0.0.0/0  -  -  -  -  -
//给ss5脚本添加权限,并启动
#chmod +x /etc/init.d/ss5
#chkconfig –add ss5
#chkconfig ss5 on
#service ss5 start
```
我们需要在AMS Console添加一个端口,我这个是当时是添加了一个1080的端口

![SecurityGroups](/images/ams03.png)

测试一下
``` bash
[root@ip-172-31-24-53 ~]# netstat  -anpt | grep ss5
tcp        0      0 0.0.0.0:1080                0.0.0.0:*                   LISTEN      6264/ss5
```

现在就可以试用一下代理了,我在`Chrome`中使用了`SwitchyOmega`代理,其他的也是一样.配置一下Connect里面的那个`Ip`和添加的这个端口就可以了

### 常见错误及解决

* 错误一：
	``` bash
	checking security/pam_misc.h usability... no
	checking security/pam_misc.h presence... no
	checking for security/pam_misc.h... no
	configure: error: *** Some of the headers weren't found ***
	```
	解决方法：
	安装 pam pam-devel
	``` bash
	[root@ip-172-31-24-53 ~]# yum install -y pam pam-devel
	```

* 错误二：编译报错：
	``` bash
	[root@ip-172-31-24-53 ~]# make
	make[1]: Entering directory /usr/local/src/ss5-3.8.9/common
	gcc -g -O2 -DLINUX -D_FILE_OFFSET_BITS=64 -I . -I ../include   -fPIC   -c -o SS5OpenLdap.o SS5OpenLdap.c
	```
	解决方法：
	安装 openldap	
	``` bash
	[root@ip-172-31-24-53 ~]# yum install -y openldap-devel  openldap
	```

* 错误三：编译报错：

	在包含自 SS5Radius.c：22 的文件中:
	../include/SS5Radius.h:22:25: 错误：openssl/md5.h：没有那个文件或目录
	SS5Radius.c: 在函数‘S5RadiusAuth’中:

	解决方法：
	安装 openldap	
	``` bash
	[root@ip-172-31-24-53 ~]# yum install -y openssl-devel  openssl
	```


      