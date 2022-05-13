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
            "server": "0.0.0.0",
            "server_port":8888,
            "method":"aes-256-gcm",
            "password":"pwd"
        }
    ],
    "mode": "tcp",
    "keep_alive": 15,
    "nofile": 10240,
    "ipv6_first": false,
    "ipv6_only": false
}

#可以测试一下,是否可用
ssserver -c /etc/shadowsocks/config.json
```

#### 配置自启动
``` bash
vi /etc/systemd/system/shadowsocks-server.service

[Unit]
Description=shadowsocks-rust service
After=network.target

[Service]
Type=simple
ExecStart=/root/.cargo/bin/ssserver -c /etc/shadowsocks/config.json
ExecStop=/usr/bin/killall ssserver
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ssserver
User=root
Group=root

[Install]
WantedBy=multi-user.target
````
```bash
systemctl enable /etc/systemd/system/shadowsocks-server.service
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

#### 启动SS
``` bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server
#如果有其他修改或者不可用可以重新处理一下
systemctl daemon-reload
systemctl restart shadowsocks-server

systemctl status shadowsocks-server
netstat -tunlp
```
