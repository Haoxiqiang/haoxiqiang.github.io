---
layout: post
title:  ShadowSocks的配置与优化
date:   2019-12-30 20:29:27
author: haoxiqiang
categories: blog
tags: [shadowsocks]
image:
  feature:
  teaser:
  credit:
  creditlink:
---


最近两天办公室网络波动比较影响工作,在自己的vps上重新给自己设置一套ss用来拉源码
适用于大多数linux,已在ubuntu 16,18测试过

#### 安装并配置ss
``` bash
#install ss
apt install python3-pip
pip3 install https://github.com/shadowsocks/shadowsocks/archive/master.zip
```
``` bash
#config ss
mkdir /etc/shadowsocks
vi /etc/shadowsocks/config.json
{
    "server":"::",
    "server_port":8888,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"自己的密码",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": true
}
#可以测试一下,是否可用
ssserver -c /etc/shadowsocks/config.json
```
#### 优化网络延迟吞吐(bbr/fast tcp/..)
``` bash
#BBR
lsmod | grep bbr
#如果没有bbr则继续,有就忽略
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```
#### 配置自启动
``` bash
vi /etc/systemd/system/shadowsocks-server.service

[Unit]
Description=Shadowsocks Server
After=network.target

[Service]
ExecStartPre=/bin/sh -c 'ulimit -n 51200'
ExecStart=/usr/local/bin/ssserver -c /etc/shadowsocks/config.json
Restart=on-abort

[Install]
WantedBy=multi-user.target
````

#### 优化网络延迟吞吐

``` bash
vi /etc/sysctl.d/local.conf

# max open files
fs.file-max = 51200
# max read buffer
net.core.rmem_max = 67108864
# max write buffer
net.core.wmem_max = 67108864
# default read buffer
net.core.rmem_default = 65536
# default write buffer
net.core.wmem_default = 65536
# max processor input queue
net.core.netdev_max_backlog = 4096
# max backlog
net.core.somaxconn = 4096

# resist SYN flood attacks
net.ipv4.tcp_syncookies = 1
# reuse timewait sockets when safe
net.ipv4.tcp_tw_reuse = 1
# turn off fast timewait sockets recycling
net.ipv4.tcp_tw_recycle = 0
# short FIN timeout
net.ipv4.tcp_fin_timeout = 30
# short keepalive time
net.ipv4.tcp_keepalive_time = 1200
# outbound port range
net.ipv4.ip_local_port_range = 10000 65000
# max SYN backlog
net.ipv4.tcp_max_syn_backlog = 4096
# max timewait sockets held by system simultaneously
net.ipv4.tcp_max_tw_buckets = 5000
# turn on TCP Fast Open on both client and server side
net.ipv4.tcp_fastopen = 3
# TCP receive buffer
net.ipv4.tcp_rmem = 4096 87380 67108864
# TCP write buffer
net.ipv4.tcp_wmem = 4096 65536 67108864
# turn on path MTU discovery
net.ipv4.tcp_mtu_probing = 1

net.ipv4.tcp_congestion_control = bbr
```

#### 启动SS
``` bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server
```
