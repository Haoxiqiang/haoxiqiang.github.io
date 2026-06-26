---
title: "ShadowSocks Rust 的配置与优化"
date: 2022-05-06 16:10:22
author: "haoxiqiang"
tags: ["shadowsocks", "vpn", "network"]
categories: ["DevOps"]
ShowToc: true
TocOpen: false
---

五一期间重新整理了家里的网络，目标是看 4K 流媒体不卡顿。既然服务器要重新配置，干脆将旧方案迁移到新的 shadowsocks-rust 上。

## 系统更新

```bash
sudo apt update && sudo apt upgrade
```

## 安装并配置 SS

### 方案一：通过 Cargo 编译安装

```bash
# 安装 Rust 工具链
curl https://sh.rustup.rs -sSf | sh

# 配置 Cargo 环境变量（写入 .profile / .bash_profile 等）
# CARGO_HOME 指定 Cargo 安装路径
# target-cpu=native 让 rustc 为目标 CPU 生成优化代码
CARGO_HOME=/root/cargo
RUSTFLAGS="-C target-cpu=native"
source .profile

# 安装编译依赖
sudo apt install build-essential

# 安装 shadowsocks-rust
cargo install shadowsocks-rust
```

### 方案二：直接下载预编译二进制

```bash
wget https://github.com/shadowsocks/shadowsocks-rust/releases/download/v1.14.3/shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
tar -xf shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
cp ssserver /usr/local/bin
chmod a+x /usr/local/bin/ssserver
```

### 配置文件

```bash
mkdir /etc/shadowsocks
vi /etc/shadowsocks/config.json
```

```json
{
    "server": "::",
    "server_port": 8888,
    "method": "aes-256-gcm",
    "password": "pw"
}
```

测试运行：

```bash
ssserver -c /etc/shadowsocks/config.json
```

## 配置自启动

```bash
vi /etc/systemd/system/shadowsocks-server.service
```

```ini
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
```

```bash
systemctl enable /etc/systemd/system/shadowsocks-server.service
```

## 优化网络延迟与吞吐量（BBR）

BBR（Bottleneck Bandwidth and Round-trip propagation time）是 Google 开发的 TCP 拥塞控制算法，通过估算网络瓶颈带宽和最小 RTT 来动态调整发送速率，相比传统的基于丢包的算法，在高延迟、高吞吐场景下表现更好。

```bash
# 检查 BBR 是否已启用
lsmod | grep bbr

# 如果未启用，执行以下步骤
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

> BBR 需要与 `fq`（Fair Queue）qdisc 配合使用才能发挥最佳效果。

## 启动 SS

```bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server

# 如有配置变更，重新加载
systemctl daemon-reload
systemctl restart shadowsocks-server

# 检查状态
systemctl status shadowsocks-server
netstat -tunlp
```

## x-ui 方案

交流中发现 [x-ui](https://github.com/vaxilu/x-ui) 对大多数人来说更省事，尝试记录如下：

```bash
# 安装 x-ui，访问 http://ip:54321
bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)
```

```bash
# 安装 acme.sh，创建 HTTPS 证书
curl https://get.acme.sh | sh -s email=your@email.com
~/.acme.sh/acme.sh --register-account -m your@email.com
~/.acme.sh/acme.sh --issue -d yourdomain --standalone
```

## 参考资源

- [shadowsocks-rust GitHub 仓库](https://github.com/shadowsocks/shadowsocks-rust)
- [shadowsocks-rust 官方文档](https://docs.rs/crate/shadowsocks-rust/latest)
- [BBR 拥塞控制算法 — Google BBR GitHub](https://github.com/google/bbr)
- [BBR FAQ](https://github.com/google/bbr/blob/master/Documentation/bbr-faq.md)
- [x-ui 项目](https://github.com/vaxilu/x-ui)
- [acme.sh](https://github.com/acmesh-official/acme.sh)
