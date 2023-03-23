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
sudo apt update && sudo apt upgrade
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
```bash
sudo apt install build-essential
cargo install shadowsocks-rust
```
or install binary
```bash
wget https://github.com/shadowsocks/shadowsocks-rust/releases/download/v1.14.3/shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
tar -xf shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
cp ssserver /usr/local/bin
chmod a+x /usr/local/bin/ssserver
```
```
``` bash
#config ss
mkdir /etc/shadowsocks
vi /etc/shadowsocks/config.json
{
    "server": "::",
    "server_port":8888,
    "method":"aes-256-gcm",
    "password":"pw"
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
ExecStart=ssserver -c /etc/shadowsocks/config.json
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

#### x-ui
交流时候发下x-ui对于大多数更省事,尝试一次
```bash
# install x-ui, visit:  ip:54321
bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)
```

```bash
# install acme,create https cer.
curl https://get.acme.sh | sh -s email=your@email.com
~/.acme.sh/acme.sh --register-account -m your@email.com
~/.acme.sh/acme.sh --issue -d yourdomain --standalone
```

https://github.com/vaxilu/x-ui
https://github.com/acmesh-official/acme.sh
