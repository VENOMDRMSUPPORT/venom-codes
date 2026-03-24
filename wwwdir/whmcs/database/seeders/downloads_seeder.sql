-- =====================================================
-- Venom Codes - Downloads Seeder
-- Server Licensing & Infrastructure Solutions
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\downloads_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

-- -----------------------------------------------------
-- RESET: Clear existing Downloads data before seeding
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblproduct_downloads`;
TRUNCATE TABLE `tbldownloads`;
TRUNCATE TABLE `tbldownloadcats`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Categories
-- -----------------------------------------------------
INSERT INTO `tbldownloadcats`
(`parentid`, `name`, `description`, `hidden`, `created_at`, `updated_at`)
VALUES
(0, 'Client Tools', 'Official client-side tools and utilities', 0, '2026-03-11 12:00:00', '2026-03-11 12:00:00');
SET @dl_cat_1 = LAST_INSERT_ID();

INSERT INTO `tbldownloadcats`
(`parentid`, `name`, `description`, `hidden`, `created_at`, `updated_at`)
VALUES
(0, 'Setup & Integration Guides', 'Deployment and integration documentation', 0, '2026-03-11 12:00:00', '2026-03-11 12:00:00');
SET @dl_cat_2 = LAST_INSERT_ID();

INSERT INTO `tbldownloadcats`
(`parentid`, `name`, `description`, `hidden`, `created_at`, `updated_at`)
VALUES
(0, 'Templates & Configs', 'Production-ready templates and baseline configs', 0, '2026-03-11 12:00:00', '2026-03-11 12:00:00');
SET @dl_cat_3 = LAST_INSERT_ID();

-- -----------------------------------------------------
-- Downloads
-- NOTE:
-- `location` should point to a real file in WHMCS downloads storage
-- or a valid remote URL, depending on your setup.
-- -----------------------------------------------------
INSERT INTO `tbldownloads`
(`category`, `type`, `title`, `description`, `downloads`, `location`, `clientsonly`, `hidden`, `productdownload`, `created_at`, `updated_at`)
VALUES
(
  @dl_cat_1,
  'zip',
  'Venom Agent CLI (Linux x64)',
  'Command-line utility for license diagnostics and node checks.',
  0,
  'venom-agent-cli-linux-x64.zip',
  1, 0, 0,
  '2026-03-11 12:05:00',
  '2026-03-11 12:05:00'
),
(
  @dl_cat_1,
  'zip',
  'Venom Agent CLI (Windows x64)',
  'Windows build of the agent CLI for operations teams.',
  0,
  'venom-agent-cli-windows-x64.zip',
  1, 0, 0,
  '2026-03-11 12:05:00',
  '2026-03-11 12:05:00'
),
(
  @dl_cat_1,
  'tar',
  'Health Check Scripts Pack',
  'Automation scripts for health checks and service verification.',
  0,
  'venom-health-check-scripts.tar.gz',
  1, 0, 0,
  '2026-03-11 12:05:00',
  '2026-03-11 12:05:00'
),
(
  @dl_cat_2,
  'pdf',
  'Quick Start Deployment Guide',
  'Step-by-step first deployment guide for new installations.',
  0,
  'venom-quick-start-deployment-guide.pdf',
  0, 0, 0,
  '2026-03-11 12:06:00',
  '2026-03-11 12:06:00'
),
(
  @dl_cat_2,
  'pdf',
  'Load Balancer Integration Guide',
  'Operational guide for single and multi-balancer routing.',
  0,
  'venom-load-balancer-integration-guide.pdf',
  0, 0, 0,
  '2026-03-11 12:06:00',
  '2026-03-11 12:06:00'
),
(
  @dl_cat_2,
  'txt',
  'Firewall & Ports Checklist',
  'Required ports and security checklist before activation.',
  0,
  'venom-firewall-ports-checklist.txt',
  0, 0, 0,
  '2026-03-11 12:06:00',
  '2026-03-11 12:06:00'
),
(
  @dl_cat_3,
  'json',
  'Default Multi-Node Config Template',
  'Baseline JSON template for multi-node rollout.',
  0,
  'venom-default-multinode-config-template.json',
  1, 0, 0,
  '2026-03-11 12:07:00',
  '2026-03-11 12:07:00'
),
(
  @dl_cat_3,
  'zip',
  'Nginx Reverse Proxy Templates',
  'Ready-to-use Nginx templates for reverse proxy and failover.',
  0,
  'venom-nginx-reverse-proxy-templates.zip',
  1, 0, 0,
  '2026-03-11 12:07:00',
  '2026-03-11 12:07:00'
);

-- =====================================================
-- Done: Downloads seeded successfully.
-- =====================================================
