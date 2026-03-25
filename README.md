# ![VENOM CODES](https://img.shields.io/badge/VENOM-CODES-green?style=for-the-badge)

<div align="center">

# VENOM CODES
**Advanced IPTV Control Platform & Streaming Solutions**

[![Platform](https://img.shields.io/badge/Platform-IPTV-blue)](https://venom-codes.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)](https://github.com/venom-codes)
[![Support](https://img.shields.io/badge/Support-24/7-brightgreen)](https://support.venom-codes.com)

*A professional-grade, self-developed IPTV management and streaming operations platform built for operators who need stability, scalability, and control.*

[Features](#-core-features) • [Pricing](#-pricing-plans) • [Documentation](#-documentation) • [Support](#-get-support)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why VENOM CODES?](#-why-venom-codes)
- [Core Features](#-core-features)
- [Platform Components](#-platform-components)
- [Technical Capabilities](#-technical-capabilities)
- [Use Cases](#-use-cases)
- [Pricing Plans](#-pricing-plans)
- [Project Structure](#-project-structure)
- [Infrastructure](#-infrastructure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Support](#-get-support)
- [License](#-license)

---

## 🎯 Overview

**VENOM CODES** is a specialized platform focused on streaming software solutions, with a strong emphasis on advanced IPTV control panels.

### What Makes Us Different

> **100% Self-Developed Software** — VENOM CODES is not a rebranded clone, not a lightly modified third-party panel, and not a wrapper around an external product. This gives us complete control over our architecture, roadmap, and security practices.

### Our Vision

We provide operators with a professional-grade platform for managing:
- Streaming infrastructure
- Live channels and video-on-demand libraries
- Radio streams and content distribution
- Subscriber management and access control
- Multi-server expansion and load balancing
- Security and anti-abuse protections

---

## 🚀 Why VENOM CODES?

| Advantage | Description |
|-----------|-------------|
| **Original Development** | Fully developed in-house with complete ownership over architecture and features |
| **Operational Stability** | Built for practical deployment, not demonstration |
| **Scalable Infrastructure** | Start small, expand to distributed multi-server networks |
| **Content Control** | Centralized management of live TV, VOD, radio, and metadata |
| **Security First** | Advanced protection against unauthorized access and content abuse |

---

## ✨ Core Features

### 🔒 Security & Anti-Abuse
- **VPN/Proxy Detection** — Block VPN connections, proxy traffic, and data center IPs
- **Fingerprint Protection** — Protect content rights and reduce unauthorized redistribution
- **Smart Access Rules** — IP-based locking, country restrictions, device limits
- **Anti-Automation** — Built-in rate limiting and abuse prevention

### 📡 Streaming Capabilities
- **Multi-Protocol Support** — HTTP, RTMP, RTSP, RTP, UDP, MMS
- **Transcoding Engine** — Optimize content for different devices and connection speeds
- **TV Archive & Timeshift** — Catch-up TV and delayed viewing features
- **Smart Content Management** — TMDB integration for automatic metadata enrichment

### 🌐 Multi-Server Infrastructure
- **Load Balancing** — Distribute traffic across multiple servers
- **Smart Routing** — GeoIP, ISP, and load-based viewer distribution
- **Horizontal Scaling** — Add servers without platform replacement
- **High Availability** — Reliable service delivery with redundancy

### 📺 Content Management
- **Live Channels** — Full control over live streaming content
- **Video-on-Demand** — Movies and series library management
- **Radio Streams** — Audio content distribution
- **Metadata Enrichment** — Automatic content information integration

### 🛡️ Platform Security
```typescript
// Example: Built-in security middleware
import { rateLimit, validateJWT, checkOwnership } from '@venom/backend';

// Secure endpoint with multiple protection layers
router.get('/api/streams',
  rateLimit({ max: 100, windowMs: 60000 }),
  validateJWT,
  checkOwnership('stream'),
  handleStreamRequest
);
```

---

## 🏗️ Platform Components

### Central Management Panel
The main control interface covering:
- Server management and monitoring
- Subscriber and package administration
- Channel and content configuration
- Operational settings and controls
- Access and security management
- Platform-wide configuration

### Content Management Layer
Organizes and handles:
- Live TV channels
- Movies and series libraries
- Radio streams
- Categories and metadata
- Automated content enrichment

### Streaming & Processing Layer
Handles stream preparation and delivery:
- Protocol compatibility
- Format conversion
- Transcoding operations
- Quality adaptation

### Distribution Layer
Manages multi-server behavior:
- Traffic routing algorithms
- Load balancing coordination
- Server health monitoring
- Geographic distribution

### Security Layer
Defensive protections including:
- Suspicious access detection
- Account misuse prevention
- Traffic restrictions
- Stream protection mechanisms

---

## 🔧 Technical Capabilities

### Supported Protocols

| Protocol | Use Case |
|----------|----------|
| HTTP | Web-based streaming and CDN delivery |
| RTMP | Real-time messaging for live ingestion |
| RTSP | Real-time streaming protocol for IP cameras |
| RTP | Real-time transport for low-latency streaming |
| UDP | User datagram protocol for broadcast streams |
| MMS | Microsoft media server protocol support |

### Device Compatibility

- 📺 **MAG Devices** — Full support for MAG set-top boxes
- 📡 **Enigma2** — Compatible with Enigma2 receivers
- 🤖 **Android** — Native Android applications
- 🍎 **iOS** — Native iOS applications
- 🏢 **Enterprise** — Custom deployment environments

### Tech Stack

```yaml
Backend:
  Runtime: Node.js with TypeScript
  Framework: Express.js
  Database: MySQL with connection pooling
  Authentication: JWT with refresh tokens
  Logging: Pino structured logging
  Validation: Zod schema validation

Frontend:
  Framework: Modern React-based SPA
  State Management: Context API
  UI: Component-based architecture
  Build: Optimized production bundles

Infrastructure:
  Web Server: nginx 1.24.0 (custom build)
  PHP: 8.4 (standalone, custom installation)
  Process Manager: PM2 cluster mode
  Service Management: Custom service control system
```

---

## 📊 Use Cases

### 1️⃣ Commercial IPTV Services
Launch and manage a full-featured IPTV service with live channels, VOD, and radio content.

### 2️⃣ Hospitality & Hotels
Deliver television and streaming content across internal networks in hotels, resorts, and compounds.

### 3️⃣ Enterprise Distribution
Internal content distribution for training channels, announcements, and media delivery across branches.

### 4️⃣ Multi-Region Networks
Scalable control system for geographically distributed streaming services.

### 5️⃣ Independent Operators
Small to mid-sized operators launching their own streaming service with clear upgrade paths.

---

## 💰 Pricing Plans

### Quick Comparison

| Plan | Price | Infrastructure | Best For |
|------|-------|----------------|----------|
| **[Pilot](#venom-pilot)** | $50/week | 1 Main Server | Evaluation & Proof of Concept |
| **[Professional](#venom-professional)** | $100/month | 1 Main + 1 LB Server | Small & Mid-sized Operators |
| **[Enterprise](#venom-enterprise)** | $300/month | 1 Main + Unlimited LB | Large-scale & Multi-region |

---

### 🧪 VENOM Pilot
**Evaluation / Trial Plan**

**Price:** `$50 / week`

**Included:**
- 1 Main Server
- Core control panel access
- Basic technical support
- Updates during subscription period

**Best For:**
- Early evaluation and testing
- Pre-launch validation
- Small-scale proof of concept

> *"Start small, validate fast, and test the platform in a real environment before scaling."*

---

### 💼 VENOM Professional
**Standard Monthly Plan**

**Price:** `$100 / month`

**Included:**
- 1 Main Server
- 1 Load Balancer Server
- Live TV, VOD, and Radio workflows
- Full platform panel access
- Specialized technical support
- Ongoing updates

**Best For:**
- Small to mid-sized operators
- Production environments
- Teams wanting room to grow

> *"A balanced plan for operators who need a reliable production setup with room to grow."*

---

### 🏢 VENOM Enterprise
**Advanced / Unlimited Plan**

**Price:** `$300 / month`

**Included:**
- 1 Main Server
- **Unlimited** Load Balancer Servers
- High-flexibility expansion
- Multi-region support
- Full platform access
- Priority technical support

**Best For:**
- Large organizations
- Multi-region services
- Long-term expansion planning

> *"Built for large-scale deployment, multi-region delivery, and unlimited expansion capacity."*

---

## 📁 Project Structure

```
venom/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── routes/         # API routes and endpoints
│   │   ├── middleware/     # Auth, validation, security
│   │   ├── lib/           # Utilities and helpers
│   │   └── config/        # Configuration files
│   └── package.json
│
├── frontend/               # React-based frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Frontend utilities
│   └── package.json
│
├── shared/                # Shared TypeScript code
│   └── api-types/        # Shared API type definitions
│
├── routes/               # Generated API routes
├── pm2.config.js        # Process management config
└── tsconfig.json        # TypeScript configuration

wwwdir/
├── venom/               # Main application
├── whmcs/              # WHMCS integration
└── phpmyadmin/         # Database management
```

---

## 🏛️ Infrastructure

### Custom Stack Overview

VENOM CODES runs on a custom-built infrastructure for maximum performance and control:

| Component | Version | Location |
|-----------|---------|----------|
| PHP | 8.4 (standalone) | `/home/venom/php/` |
| nginx | 1.24.0 (custom) | `/home/venom/nginx/` |
| PHP-FPM | Custom pools | `/home/venom/php/etc/pools.d/` |
| Composer | Standalone | `/home/venom/bin/composer` |
| FFmpeg | Standalone | `/home/venom/bin/ffmpeg` |

### Service Management

All services are managed through the custom service control script:

```bash
# Start all services
/home/venom/service start

# Stop all services
/home/venom/service stop

# Restart services
/home/venom/service restart

# Check status
/home/venom/service status
```

### Configuration Files

```bash
# PHP Configuration
/home/venom/php/etc/php.ini          # Main PHP config
/home/venom/php/etc/php-fpm.conf     # FPM main config
/home/venom/php/etc/pools.d/         # FPM pool files

# nginx Configuration
/home/venom/nginx/conf/nginx.conf    # Main nginx config
/home/venom/nginx/conf/sites/        # Site configurations
/home/venom/nginx/conf/security.conf # Security rules
```

### Runtime & Logs

```bash
# Runtime
/home/venom/php/var/run/             # PID files and sockets
/home/venom/php/var/log/             # PHP-FPM logs
/home/venom/nginx/logs/              # nginx logs

# Log Symlinks
/logs/php-fpm/                       # PHP-FPM log links
/logs/nginx/                         # nginx log links
```

---

## 🚀 Getting Started

### Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Minimum 2GB RAM (4GB+ for production)
- Node.js 18+
- MySQL 8.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/venom-codes/platform.git
cd platform

# Install dependencies
pnpm install

# Build the project
pnpm build

# Start services
/home/venom/service start
```

### Development

```bash
# Backend development
cd backend
pnpm dev

# Frontend development
cd frontend
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Production Deployment

```bash
# Build for production
pnpm build

# Start with PM2
pm2 start pm2.config.js

# Check status
pm2 status
pm2 logs venom
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Platform Reference](./docs/venom_codes_platform_reference.md) | Official product reference and overview |
| [Infrastructure Guide](./docs/INFRASTRUCTURE.md) | Complete infrastructure documentation |
| [API Documentation](./docs/API.md) | REST API reference |
| [Security Guide](./docs/SECURITY.md) | Security best practices |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Production deployment instructions |

---

## 🆘 Get Support

### Support Channels

- **Documentation:** [docs.venom-codes.com](https://docs.venom-codes.com)
- **Email Support:** support@venom-codes.com
- **Ticket System:** [support.venom-codes.com](https://support.venom-codes.com)
- **Community Forum:** [community.venom-codes.com](https://community.venom-codes.com)

### Response Times

| Plan Type | Response Time |
|-----------|---------------|
| Pilot | 24-48 hours |
| Professional | 12-24 hours |
| Enterprise | 4-8 hours (Priority) |

### Reporting Issues

When reporting issues, please include:
- Plan type and account details
- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Server logs and error messages

---

## 🤝 Contributing

We appreciate interest in contributing to VENOM CODES. As this is a commercial platform, please contact us at:

**developers@venom-codes.com**

Before submitting any contributions, please review our:
- Code of Conduct
- Contribution Guidelines
- Security Policy

---

## 📄 License

VENOM CODES is proprietary software. All rights reserved.

Copyright © 2025 VENOM CODES. All rights reserved.

This software and associated documentation are the confidential and proprietary information of VENOM CODES. Unauthorized copying, distribution, or use of this software is strictly prohibited.

For licensing inquiries, contact: **legal@venom-codes.com**

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Website** | [venom-codes.com](https://venom-codes.com) |
| **Documentation** | [docs.venom-codes.com](https://docs.venom-codes.com) |
| **Support** | [support.venom-codes.com](https://support.venom-codes.com) |
| **Status** | [status.venom-codes.com](https://status.venom-codes.com) |
| **Blog** | [blog.venom-codes.com](https://blog.venom-codes.com) |

---

<div align="center">

**Built for operators who need stability, control, and scalability.**

[⬆ Back to Top](#-venom-codes)

</div>
