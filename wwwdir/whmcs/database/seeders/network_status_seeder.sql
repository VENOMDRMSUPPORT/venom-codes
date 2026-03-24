-- =====================================================
-- Venom Codes - Network Status Seeder
-- Server Licensing & Infrastructure Solutions
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\network_status_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

-- -----------------------------------------------------
-- RESET: Clear existing network issues before seeding
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblnetworkissues`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Seed network issues
-- -----------------------------------------------------
INSERT INTO `tblnetworkissues`
(`title`, `description`, `type`, `affecting`, `server`, `priority`, `startdate`, `enddate`, `status`, `lastupdate`, `created_at`, `updated_at`)
VALUES
(
  'API Gateway Latency Spike',
  '<p>We are investigating elevated response times on the client API gateway.</p><p>License validation may be delayed for a small subset of requests.</p>',
  'System',
  'Client API Gateway',
  NULL,
  'High',
  '2026-03-11 09:10:00',
  NULL,
  'Investigating',
  '2026-03-11 09:45:00',
  '2026-03-11 09:10:00',
  '2026-03-11 09:45:00'
),
(
  'Planned Control Plane Maintenance',
  '<p>Scheduled maintenance window for control plane service updates.</p><p>No license data loss is expected. Short dashboard interruptions may occur during the window.</p>',
  'System',
  'Control Plane Services',
  NULL,
  'Medium',
  '2026-03-14 01:00:00',
  '2026-03-14 03:00:00',
  'Scheduled',
  '2026-03-11 08:30:00',
  '2026-03-11 08:30:00',
  '2026-03-11 08:30:00'
),
(
  'Regional Edge Routing Degradation',
  '<p>Traffic routing degradation has been identified on a regional edge path.</p><p>Engineers are actively rerouting traffic to stable nodes.</p>',
  'Other',
  'Regional Edge Network',
  NULL,
  'Critical',
  '2026-03-11 07:40:00',
  NULL,
  'In Progress',
  '2026-03-11 09:20:00',
  '2026-03-11 07:40:00',
  '2026-03-11 09:20:00'
),
(
  'Database Replication Delay Resolved',
  '<p>Replication lag in the reporting cluster has been fully resolved.</p><p>Monitoring confirms normal sync behavior after corrective actions.</p>',
  'System',
  'Reporting Database Cluster',
  NULL,
  'Low',
  '2026-03-10 04:15:00',
  '2026-03-10 05:05:00',
  'Resolved',
  '2026-03-10 05:10:00',
  '2026-03-10 04:15:00',
  '2026-03-10 05:10:00'
),
(
  'POP3 Monitoring Alert',
  '<p>Intermittent POP3 monitoring checks are reporting timeout alerts.</p><p>This does not impact core licensing operations. Monitoring thresholds are being tuned.</p>',
  'Other',
  'Mail Monitoring Channel',
  NULL,
  'Low',
  '2026-03-11 06:50:00',
  NULL,
  'Reported',
  '2026-03-11 08:05:00',
  '2026-03-11 06:50:00',
  '2026-03-11 08:05:00'
);

-- =====================================================
-- Done: Network Status data seeded successfully.
-- =====================================================
