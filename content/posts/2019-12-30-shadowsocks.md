---
title: "Shadowsocks 的配置与优化"
date: 2019-12-31 20:29:27
author: "haoxiqiang"
tags: ["shadowsocks", "vpn", "bbr", "linux"]
categories: ["DevOps"]
ShowToc: true
TocOpen: false
---

最近办公室网络波动影响工作，在 VPS 上重新搭建了一套 Shadowsocks 用来拉取源码。以下步骤适用于大多数 Linux 发行版，已在 Ubuntu 16.04 和 18.04 上测试通过。

> **2024 更新说明：** 本文使用的 Python 版 `shadowsocks` 已停止维护。推荐使用 [shadowsocks-rust](https://github.com/shadowsocks/shadowsocks-rust)，它是当前官方活跃维护的实现，性能更好且支持现代加密协议。如从零开始搭建，建议直接参考 [shadowsocks-rust 官方文档](https://github.com/shadowsocks/shadowsocks-rust)。下文仍保留 Python 版步骤供参考。

## 基础环境准备

```bash
apt update && apt upgrade -y
```

## 安装并配置 Shadowsocks (Python 版)

### 安装

```bash
apt install python3-pip -y
pip3 install https://github.com/shadowsocks/shadowsocks/archive/master.zip
```

### 配置文件

```bash
mkdir /etc/shadowsocks
vi /etc/shadowsocks/config.json
```

```json
{
    "server":"::",
    "server_port":8888,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"your-password",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": true
}
```

### 防火墙配置

```bash
iptables -I INPUT -p tcp --dport 8888 -j ACCEPT
iptables -I INPUT -p udp --dport 8888 -j ACCEPT

# 如果使用 UFW，则执行：
ufw allow 8888
```

### 测试运行

```bash
ssserver -c /etc/shadowsocks/config.json
```

## 启用 BBR 加速

BBR (Bottleneck Bandwidth and Round-trip propagation time) 是 Google 开发的 TCP 拥塞控制算法，能显著提升网络吞吐量。

```bash
# 检查是否已加载 BBR
lsmod | grep bbr

# 如果未加载，执行以下命令：
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

## 配置 systemd 自启动

```bash
vi /etc/systemd/system/shadowsocks-server.service
```

```ini
[Unit]
Description=Shadowsocks Server
After=network.target

[Service]
ExecStartPre=/bin/sh -c 'iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8888'
ExecStartPre=/bin/sh -c 'iptables -t nat -A PREROUTING -p udp --dport 443 -j REDIRECT --to-port 8888'
ExecStart=/usr/local/bin/ssserver -c /etc/shadowsocks/config.json
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

## 网络参数优化

创建 `/etc/sysctl.d/local.conf`，进一步优化内核网络参数：

```bash
vi /etc/sysctl.d/local.conf
```

```ini
# max open files
fs.file-max = 51200

# max read/write buffer
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.core.rmem_default = 65536
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

# TCP receive/write buffer (min, default, max)
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# turn on path MTU discovery
net.ipv4.tcp_mtu_probing = 1

# BBR congestion control
net.ipv4.tcp_congestion_control = bbr
```

## 启动 Shadowsocks

```bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server

# 如有修改，重新加载配置
systemctl daemon-reload
systemctl restart shadowsocks-server

# 检查状态
systemctl status shadowsocks-server
netstat -tunlp
```

## 参考资料

- [Shadowsocks 官方 GitHub (Python)](https://github.com/shadowsocks/shadowsocks/tree/master)
- [Shadowsocks-rust (推荐替代)](https://github.com/shadowsocks/shadowsocks-rust)
- [Google BBR 拥塞控制算法](https://github.com/google/bbr)
- [TCP BBR 官方文档 - kernel.org](https://www.kernel.org/doc/Documentation/networking/bbr.txt)
- [ArchLinux Wiki: Shadowsocks](https://wiki.archlinux.org/title/Shadowsocks)
