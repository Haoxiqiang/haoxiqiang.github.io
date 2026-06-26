---
title: "Shadowsocks Setup and Optimization"
date: 2019-12-31 20:29:27
author: "haoxiqiang"
tags: ["shadowsocks", "vpn", "bbr", "linux"]
categories: ["DevOps"]
ShowToc: true
TocOpen: false
---

Network instability at the office was affecting work, so I set up a Shadowsocks server on my VPS for source code pulls. The steps below work on most Linux distributions and have been tested on Ubuntu 16.04 and 18.04.

> **2024 Update:** The Python version of `shadowsocks` used in this guide is no longer maintained. The actively maintained implementation is [shadowsocks-rust](https://github.com/shadowsocks/shadowsocks-rust), which offers better performance and support for modern encryption protocols. For a fresh setup, refer to the [shadowsocks-rust documentation](https://github.com/shadowsocks/shadowsocks-rust). The original Python-based steps are preserved below for reference.

## System Preparation

```bash
apt update && apt upgrade -y
```

## Install and Configure Shadowsocks (Python Edition)

### Installation

```bash
apt install python3-pip -y
pip3 install https://github.com/shadowsocks/shadowsocks/archive/master.zip
```

### Configuration

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

### Firewall Rules

```bash
iptables -I INPUT -p tcp --dport 8888 -j ACCEPT
iptables -I INPUT -p udp --dport 8888 -j ACCEPT

# If using UFW:
ufw allow 8888
```

### Quick Test

```bash
ssserver -c /etc/shadowsocks/config.json
```

## Enable BBR Acceleration

BBR (Bottleneck Bandwidth and Round-trip propagation time) is Google's TCP congestion control algorithm that significantly improves network throughput.

```bash
# Check if BBR is already loaded
lsmod | grep bbr

# If not loaded, run:
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

## Systemd Service for Auto-Start

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

## Kernel Network Parameter Tuning

Create `/etc/sysctl.d/local.conf` for further network optimization:

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

## Start Shadowsocks

```bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server

# Reload after any config changes
systemctl daemon-reload
systemctl restart shadowsocks-server

# Verify status
systemctl status shadowsocks-server
netstat -tunlp
```

## References

- [Shadowsocks Official GitHub (Python)](https://github.com/shadowsocks/shadowsocks/tree/master)
- [Shadowsocks-rust (Recommended Replacement)](https://github.com/shadowsocks/shadowsocks-rust)
- [Google BBR Congestion Control](https://github.com/google/bbr)
- [TCP BBR Documentation - kernel.org](https://www.kernel.org/doc/Documentation/networking/bbr.txt)
- [ArchLinux Wiki: Shadowsocks](https://wiki.archlinux.org/title/Shadowsocks)
