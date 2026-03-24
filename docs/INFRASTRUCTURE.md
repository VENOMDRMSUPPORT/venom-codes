# Venom-Codes Infrastructure Documentation

Complete guide for Venom-Codes custom tools, services management, and deployment infrastructure.

---

## Table of Contents

1. [The Service Manager](#-the-service-manager-recommended)
2. [Custom Tools Overview](#-custom-tools-overview)
3. [Manual Service Control](#-manual-service-control-advanced)
4. [Quick Start](#-quick-start)
5. [Troubleshooting](#-troubleshooting)
6. [Performance Tuning](#-performance-tuning)
7. [Deployment](#-deployment)

---

## 🎯 The Service Manager (Recommended)

**IMPORTANT:** This is the **PRIMARY and RECOMMENDED** way to manage all services on Venom-Codes infrastructure.

```bash
/home/venom/service <command>
```

### Available Commands

| Command | Description |
|---------|-------------|
| `start` | Start all services (PHP-FPM + nginx) |
| `stop` | Stop all services gracefully |
| `restart` | Restart all services |
| `reload` | Reload configurations (zero downtime) |
| `status` | Show service status |
| `clean` | Clean all log files (truncate) |
| `clear` | Clear and recreate log directories with fresh permissions |

### Quick Examples

```bash
# Start all services
/home/venom/service start

# Stop all services
/home/venom/service stop

# Restart all services
/home/venom/service restart

# Reload configs (zero downtime)
/home/venom/service reload

# Check status
/home/venom/service status

# Clean logs
/home/venom/service clean
```

### What the Service Manager Handles

The service manager automatically handles:
- ✅ Starting PHP-FPM with correct config path
- ✅ Starting nginx with correct config path
- ✅ Proper process management and PID handling
- ✅ Permission handling (works as venom user or root)
- ✅ Graceful shutdown procedures
- ✅ Dependency management (PHP-FPM before nginx)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  /home/venom/service                         │
│                 (Service Manager - Go Binary)                │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌────────────────────┐        ┌────────────────────┐
│   PHP-FPM 8.4      │        │   nginx 1.24.0     │
│  /home/venom/bin/  │        │  /home/venom/bin/  │
├────────────────────┤        ├────────────────────┤
│ Config:            │        │ Config:            │
│ /home/venom/php/   │        │ /home/venom/nginx/ │
│ etc/php.ini        │        │ conf/nginx.conf    │
└────────────────────┘        └────────────────────┘
```

---

## 📍 Custom Tools Overview

All binaries are stored in a single directory `/home/venom/bin/` with symbolic links in Ubuntu system for convenience.

### Primary Path

```
/home/venom/bin/          ← Main source for all tools
```

### Symbolic Links Summary

| Tool | Primary Path | Symbolic Link | System |
|------|-----------------|----------------|--------|
| PHP | `/home/venom/bin/php` | `/usr/bin/php` | Ubuntu |
| PHP-FPM | `/home/venom/bin/php-fpm` | `/usr/sbin/php-fpm` | Ubuntu |
| nginx | `/home/venom/bin/nginx` | `/usr/sbin/nginx` | Ubuntu |
| Composer | `/home/venom/bin/composer` | `/usr/bin/composer` | Ubuntu |
| FFmpeg | `/home/venom/bin/ffmpeg` | `/usr/bin/ffmpeg` | Ubuntu |

---

## 1️⃣ PHP

### Paths

| Component | Path |
|-----------|------|
| Binary | `/home/venom/bin/php` |
| Symbolic Link | `/usr/bin/php` |
| Config | `/home/venom/php/etc/php.ini` |
| FPM Config | `/home/venom/php/etc/php-fpm.conf` |

### Usage

```bash
/home/venom/bin/php --version
# or via symlink
php --version
```

### Information

- Standalone installation independent from Ubuntu PHP
- Not affected by system updates
- Uses custom configuration files

---

## 2️⃣ PHP-FPM

### Paths

| Component | Path |
|-----------|------|
| Binary | `/home/venom/bin/php-fpm` |
| Symbolic Link | `/usr/sbin/php-fpm` |
| Config | `/home/venom/php/etc/php-fpm.conf` |
| Pool Files | `/home/venom/php/etc/pools.d/` |
| Runtime | `/home/venom/php/var/run/` |
| Logs | `/home/venom/php/var/log/` |

### Starting PHP-FPM

**Standard Start:**
```bash
/home/venom/bin/php-fpm -c /home/venom/php/etc/php.ini
```

**With Custom PID:**
```bash
/home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini
```

**Background Mode:**
```bash
/home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini &
```

**With Daemonize Option:**
```bash
# Edit /home/venom/php/etc/php-fpm.conf:
# daemonize = yes

/home/venom/bin/php-fpm -c /home/venom/php/etc/php.ini
```

### Stopping PHP-FPM

**Graceful Stop:**
```bash
/home/venom/bin/php-fpm -s quit
```

**Force Kill:**
```bash
pkill -9 php-fpm
```

**Using PID File:**
```bash
kill $(cat /home/venom/php/var/run/php-fpm.pid)
```

### Reloading PHP-FPM

**Reload Configuration (graceful):**
```bash
/home/venom/bin/php-fpm -s reload
```

**Reload with Logging:**
```bash
/home/venom/bin/php-fpm -s reload && sleep 1 && tail -f /home/venom/php/var/log/php-fpm.log
```

### Verify Status

```bash
# Check if running
ps aux | grep php-fpm | grep -v grep

# Check listening ports
netstat -tlnp | grep php-fpm
lsof -i :9000

# Check socket
ls -l /home/venom/php/var/run/php-fpm.sock
```

### Configuration Example

**File:** `/home/venom/php/etc/php-fpm.conf`

Key settings:
```ini
; Emergency restart threshold
emergency_restart_threshold = 10

; Emergency restart interval
emergency_restart_interval = 1m

; Process manager types: static, dynamic, ondemand
pm = dynamic

; Max children
pm.max_children = 50

; Start servers
pm.start_servers = 5

; Min spare servers
pm.min_spare_servers = 2

; Max spare servers
pm.max_spare_servers = 10

; Process idle timeout
pm.process_idle_timeout = 10s

; Max requests per process
pm.max_requests = 1000
```

---

## 3️⃣ nginx

### Paths

| Component | Path |
|-----------|------|
| Binary | `/home/venom/bin/nginx` |
| Symbolic Link | `/usr/sbin/nginx` |
| Main Config | `/home/venom/nginx/conf/nginx.conf` |
| Site Config | `/home/venom/nginx/conf/sites/venom-codes.test.conf` |
| Security Config | `/home/venom/nginx/conf/security.conf` |
| FastCGI Config | `/home/venom/nginx/conf/fastcgi_params` |
| SSL Config | `/home/venom/nginx/conf/ssl.conf` |
| Certificates | `/home/venom/nginx/certs/` |
| Error Log | `/home/venom/nginx/logs/error.log` / `/logs/nginx/error.log` |
| Access Log | `/home/venom/nginx/logs/access.log` / `/logs/nginx/access.log` |

### Starting nginx

**Standard Start:**
```bash
/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf
```

**With Process Name:**
```bash
/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf -p /home/venom/nginx/
```

**Check Configuration Before Start:**
```bash
/home/venom/bin/nginx -t -c /home/venom/nginx/conf/nginx.conf
```

**Start in Background:**
```bash
/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf &
```

### Stopping nginx

**Graceful Shutdown:**
```bash
/home/venom/bin/nginx -s quit
```

**Fast Shutdown:**
```bash
/home/venom/bin/nginx -s stop
```

**Force Kill:**
```bash
pkill -9 nginx
```

### Reloading nginx

**Reload Configuration (no downtime):**
```bash
/home/venom/bin/nginx -s reload
```

**Reopen Log Files:**
```bash
/home/venom/bin/nginx -s reopen
```

### Verify Status

```bash
# Check if running
ps aux | grep nginx | grep -v grep

# Check listening ports
netstat -tlnp | grep nginx
lsof -i :80
lsof -i :443

# Check master and worker processes
ps -ef | grep nginx

# Test configuration
/home/venom/bin/nginx -t -c /home/venom/nginx/conf/nginx.conf
```

### Configuration Example

**File:** `/home/venom/nginx/conf/nginx.conf`

Key settings:
```nginx
# Worker processes
worker_processes auto;

# Worker connections
events {
    worker_connections 2048;
}

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 10m;

# Timeouts
keepalive_timeout 65;
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

---

## 4️⃣ Composer

### Paths

| Component | Path |
|-----------|------|
| Binary | `/home/venom/bin/composer` |
| Symbolic Link | `/usr/bin/composer` |

### Usage

```bash
/home/venom/bin/composer --version
# or via symlink
composer --version
```

### Diagnostics

```bash
/home/venom/bin/composer diagnose
composer diagnose         # (via symbolic link)
```

---

## 5️⃣ FFmpeg

### Paths

| Component | Path |
|-----------|------|
| Binary | `/home/venom/bin/ffmpeg` |
| Symbolic Link | `/usr/bin/ffmpeg` |
| Probe Tool | `/home/venom/bin/ffprobe.filepart` |

### Usage

```bash
/home/venom/bin/ffmpeg -version
# or via symlink
ffmpeg -version
```

---

## 🌐 Live Website

### Project Paths

| Component | Path |
|-----------|------|
| Web Root | `/home/venom/wwwdir/` |
| Test URL | `http://venom-codes.test` |

The website is served via nginx configured in `/home/venom/nginx/conf/sites/venom-codes.test.conf`

---

## 🔧 Manual Service Control (Advanced Use Only)

**IMPORTANT:** Use the [Service Manager](#-the-service-manager-recommended) whenever possible. Only use these commands for troubleshooting or when the service manager is not available.

#### Quick Start - Start All Services

```bash
# PHP-FPM
/home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini

# nginx
/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf
```

#### Quick Stop - Stop All Services

```bash
# PHP-FPM
pkill -f php-fpm

# nginx
/home/venom/bin/nginx -s stop
```

#### Quick Restart - Restart Services

```bash
# PHP-FPM
pkill -f php-fpm && sleep 2 && /home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini

# nginx
/home/venom/bin/nginx -s reload
```

---

## 📊 Service Monitoring

### Health Check Commands

```bash
# All services status
echo "=== PHP-FPM Status ===" && ps aux | grep php-fpm | grep -v grep
echo "=== nginx Status ===" && ps aux | grep nginx | grep -v grep

# Port availability
echo "=== Port 9000 (PHP-FPM) ===" && netstat -tlnp | grep 9000
echo "=== Port 80 (HTTP) ===" && netstat -tlnp | grep 80
echo "=== Port 443 (HTTPS) ===" && netstat -tlnp | grep 443

# Socket status
echo "=== PHP-FPM Socket ===" && ls -l /home/venom/php/var/run/php-fpm.sock
```

### Log Monitoring

**PHP-FPM Logs:**
```bash
# Main error log
tail -f /home/venom/php/var/log/php-fpm.log

# Error log (symlink location)
tail -f /logs/php-fpm/error.log

# Access log
tail -f /logs/php-fpm/access.log
```

**nginx Logs:**
```bash
# Main error log
tail -f /home/venom/nginx/logs/error.log
tail -f /logs/nginx/error.log

# Access log
tail -f /home/venom/nginx/logs/access.log
tail -f /logs/nginx/access.log

# Combined monitoring
tail -f /logs/nginx/error.log & tail -f /logs/php-fpm/error.log
```

### System Monitoring

```bash
# CPU and Memory usage
top -p $(pgrep -f php-fpm | tr '\n' ',' | sed 's/,$//'),$(pgrep -f nginx | tr '\n' ',' | sed 's/,$//') 

# Open file descriptors
lsof -p $(pgrep -f php-fpm | head -1)

# Connection status
netstat -an | grep ESTABLISHED | wc -l
```

---

## 🔍 Quick Verification Commands

```bash
# Verify all tools
echo "=== PHP ===" && php --version
echo "=== PHP-FPM ===" && php-fpm --version
echo "=== nginx ===" && nginx -v
echo "=== Composer ===" && composer --version
echo "=== FFmpeg ===" && ffmpeg -version

# Check running services
echo "=== Running Services ===" 
ps aux | grep -E "php-fpm|nginx" | grep -v grep

# Check primary binaries
ls -lah /home/venom/bin/
```

---

## 🔧 Troubleshooting

### PHP-FPM Connection Refused

```bash
# Check if running
ps aux | grep php-fpm

# Check socket exists
ls -l /home/venom/php/var/run/php-fpm.sock

# Check permissions
stat /home/venom/php/var/run/php-fpm.sock

# Verify configuration
/home/venom/bin/php-fpm -t -c /home/venom/php/etc/php.ini

# Check logs
tail -50 /home/venom/php/var/log/php-fpm.log
```

### nginx Connection Refused

```bash
# Check if running
ps aux | grep nginx

# Check ports
netstat -tlnp | grep nginx
lsof -i :80

# Test configuration
/home/venom/bin/nginx -t -c /home/venom/nginx/conf/nginx.conf

# Check logs
tail -50 /home/venom/nginx/logs/error.log
```

### High Memory Usage

```bash
# Monitor process top consumers
ps aux --sort=-%mem | head -10

# Check PHP-FPM process count and memory
ps aux | grep php-fpm
ps aux | grep -c php-fpm

# Check nginx workers
ps aux | grep nginx
```

### Port Already in Use

```bash
# Find process using port
lsof -i :80
lsof -i :9000

# Kill process (if needed)
kill -9 $(lsof -t -i :80)
kill -9 $(lsof -t -i :9000)
```

---

## 🔄 Deployment & Service Lifecycle

### Full Restart Sequence

```bash
#!/bin/bash
# Safe restart of all services

echo "Stopping PHP-FPM..."
/home/venom/bin/php-fpm -s quit
sleep 2

echo "Stopping nginx..."
/home/venom/bin/nginx -s stop
sleep 2

echo "Starting PHP-FPM..."
/home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini
sleep 2

echo "Starting nginx..."
/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf
sleep 2

echo "Verifying services..."
ps aux | grep -E "php-fpm|nginx" | grep -v grep
```

### Emergency Stop (Keep Logs)

```bash
# Stop without data loss
echo "Graceful shutdown starting..."
/home/venom/bin/nginx -s quit
/home/venom/bin/php-fpm -s quit
sleep 5
pkill -f php-fpm
pkill -f nginx
echo "Services stopped"
```

### Verify Deployment

```bash
#!/bin/bash
# After deployment verification

echo "=== Service Check ==="
ps aux | grep -E "php-fpm|nginx" | grep -v grep

echo "=== Port Check ==="
netstat -tlnp | grep -E "9000|80|443"

echo "=== Log Check ==="
echo "PHP-FPM last 10 entries:"
tail -10 /home/venom/php/var/log/php-fpm.log
echo "nginx last 10 entries:"
tail -10 /home/venom/nginx/logs/error.log

echo "=== Website Connectivity ==="
curl -I http://venom-codes.test
```

---

## 📌 Performance Tuning

### PHP-FPM Optimization

**File:** `/home/venom/php/etc/php-fpm.conf`

Key tuning parameters:
```ini
; Emergency restart threshold
emergency_restart_threshold = 10

; Emergency restart interval
emergency_restart_interval = 1m

; Process manager types: static, dynamic, ondemand
pm = dynamic

; Max children
pm.max_children = 50

; Start servers
pm.start_servers = 5

; Min spare servers
pm.min_spare_servers = 2

; Max spare servers
pm.max_spare_servers = 10

; Process idle timeout
pm.process_idle_timeout = 10s

; Max requests per process
pm.max_requests = 1000
```

### nginx Optimization

**File:** `/home/venom/nginx/conf/nginx.conf`

Key tuning parameters:
```nginx
# Worker processes (auto = number of CPU cores)
worker_processes auto;

# Connections per worker
events {
    worker_connections 2048;
}

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 10m;

# Timeouts
keepalive_timeout 65;
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

---

## 🆘 Quick Reference

### ⭐ RECOMMENDED - Service Manager

| Task | Command |
|------|---------|
| **Start all services** | `/home/venom/service start` |
| **Stop all services** | `/home/venom/service stop` |
| **Restart all services** | `/home/venom/service restart` |
| **Reload configs** | `/home/venom/service reload` |
| **Check status** | `/home/venom/service status` |
| **Clean logs** | `/home/venom/service clean` |

### Manual Commands (Advanced Use Only)

| Task | Command |
|------|---------|
| Start PHP-FPM | `/home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini` |
| Stop PHP-FPM | `pkill -f php-fpm` |
| Reload PHP-FPM | `/home/venom/bin/php-fpm -s reload` |
| Start nginx | `/home/venom/bin/nginx -c /home/venom/nginx/conf/nginx.conf` |
| Stop nginx | `/home/venom/bin/nginx -s stop` |
| Reload nginx | `/home/venom/bin/nginx -s reload` |
| Check PHP-FPM | `ps aux \| grep php-fpm \| grep -v grep` |
| Check nginx | `ps aux \| grep nginx \| grep -v grep` |
| Test nginx config | `/home/venom/bin/nginx -t -c /home/venom/nginx/conf/nginx.conf` |
| View PHP-FPM logs | `tail -f /home/venom/php/var/log/php-fpm.log` |
| View nginx logs | `tail -f /home/venom/nginx/logs/error.log` |
| Check all services | `ps aux \| grep -E "php-fpm\|nginx" \| grep -v grep` |
| Verify all tools | `php -v && php-fpm -v && nginx -v && composer -V && ffmpeg -version` |

---

## 📝 Important Notes

1. **USE SERVICE MANAGER** - Always use `/home/venom/service` for service management
2. **All tools are system-independent** - Not affected by Ubuntu updates
3. **Symbolic links provide shortcuts** - Use standard commands without full paths
4. **Binaries exist directly** - No backups or extra symlinks inside `/home/venom/bin/`
5. **Configurations are separate** - Config files in separate directories (`nginx/conf/`, `php/etc/`, etc.)
6. **System maintenance** - To update, replace files in `/home/venom/bin/` directly
7. **Backward compatibility** - Maintain custom paths for consistency and isolation
