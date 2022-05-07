---
layout: post
title:  ShadowSocks Rust的配置与优化
date:   2022-05-06 16:10:22
author: haoxiqiang
categories: blog
tags: [shadowsocks]
image:
  feature:
  teaser:
  credit:
  creditlink:
---

5.1在家替换一下之前的实践,家里网络重新弄了一次,这样保证可以刷剧可以看4k的不卡,既然服务器也准备重新弄下,就干脆直接迁移到新的shadowsocks-rust上面

####
```bash
apt update && apt upgrade
```

#### 安装并配置ss
``` bash
# install cargo

apt install cargo
# or
curl https://sh.rustup.rs -sSf | sh

# init cargo env in any env file .profile/.base_profile/...
# set CARGO_HOME for cargo env
# set target-cpu=native feature to let rustc generate and optimize code for the CPU running the compiler.
CARGO_HOME=/root/cargo
RUSTFLAGS="-C target-cpu=native"
source .profile

# install shadowsocks-rust
cargo install shadowsocks-rust
```
``` bash
#config ss
mkdir /etc/shadowsocks
vi /etc/shadowsocks/config.json
{
    "servers": [
        {
            "address": "0.0.0.0",
            "port": 8881,
            "method": "aes-256-gcm",
            "password":"pwd"
        },
        {
            "server": "0.0.0.0",
            "server_port":8888,
            "method":"aes-256-gcm",
            "password":"pwd"
        }
    ],
    "mode": "tcp_and_udp",
    "keep_alive": 15,
    "nofile": 10240,
    "ipv6_first": false,
    "ipv6_only": false
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
ExecStart=ssserver -c /etc/shadowsocks/config.json
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
#如果有其他修改或者不可用可以重新处理一下
systemctl daemon-reload
systemctl restart shadowsocks-server
```
