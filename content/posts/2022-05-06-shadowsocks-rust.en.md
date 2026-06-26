---
title: "Configuring and Optimizing Shadowsocks Rust"
date: 2022-05-06 16:10:22
author: "haoxiqiang"
tags: ["shadowsocks", "vpn", "network"]
categories: ["DevOps"]
ShowToc: true
TocOpen: false
---

During the recent holiday, I reorganized the home network with the goal of streaming 4K content without buffering. Since I was rebuilding the server anyway, I decided to migrate from the old setup to the new shadowsocks-rust implementation.

## System Update

```bash
sudo apt update && sudo apt upgrade
```

## Installing and Configuring SS

### Option 1: Build from Source via Cargo

```bash
# Install Rust toolchain
curl https://sh.rustup.rs -sSf | sh

# Configure Cargo environment (add to .profile / .bash_profile)
# CARGO_HOME sets the installation path
# target-cpu=native lets rustc optimize for the current CPU
CARGO_HOME=/root/cargo
RUSTFLAGS="-C target-cpu=native"
source .profile

# Install build dependencies
sudo apt install build-essential

# Install shadowsocks-rust
cargo install shadowsocks-rust
```

### Option 2: Download Prebuilt Binary

```bash
wget https://github.com/shadowsocks/shadowsocks-rust/releases/download/v1.14.3/shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
tar -xf shadowsocks-v1.14.3.x86_64-unknown-linux-gnu.tar.xz
cp ssserver /usr/local/bin
chmod a+x /usr/local/bin/ssserver
```

### Configuration

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

Test the server:

```bash
ssserver -c /etc/shadowsocks/config.json
```

## Setting Up Auto-Start

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

## Network Optimization (BBR)

BBR (Bottleneck Bandwidth and Round-trip propagation time) is a TCP congestion control algorithm developed by Google. It estimates the bottleneck bandwidth and minimum RTT to dynamically adjust the sending rate, outperforming traditional loss-based algorithms in high-latency, high-throughput scenarios.

```bash
# Check if BBR is already enabled
lsmod | grep bbr

# If not enabled, run the following
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

> BBR should be used with the `fq` (Fair Queue) qdisc for optimal performance.

## Starting the Service

```bash
sysctl --system
systemctl start shadowsocks-server
systemctl enable shadowsocks-server

# Reload after config changes
systemctl daemon-reload
systemctl restart shadowsocks-server

# Verify status
systemctl status shadowsocks-server
netstat -tunlp
```

## Alternative: x-ui

I discovered [x-ui](https://github.com/vaxilu/x-ui) through discussions — it's more convenient for most users. Here's a quick setup:

```bash
# Install x-ui, visit http://ip:54321
bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)
```

```bash
# Install acme.sh and create HTTPS certificate
curl https://get.acme.sh | sh -s email=your@email.com
~/.acme.sh/acme.sh --register-account -m your@email.com
~/.acme.sh/acme.sh --issue -d yourdomain --standalone
```

## References

- [shadowsocks-rust GitHub Repository](https://github.com/shadowsocks/shadowsocks-rust)
- [shadowsocks-rust Documentation](https://docs.rs/crate/shadowsocks-rust/latest)
- [BBR Congestion Control — Google BBR GitHub](https://github.com/google/bbr)
- [BBR FAQ](https://github.com/google/bbr/blob/master/Documentation/bbr-faq.md)
- [x-ui Project](https://github.com/vaxilu/x-ui)
- [acme.sh](https://github.com/acmesh-official/acme.sh)
