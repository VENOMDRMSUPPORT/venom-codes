-- =====================================================
-- Venom Codes - Announcements Seeder
-- Server Licensing & Infrastructure Solutions
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\announcements_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

-- -----------------------------------------------------
-- RESET: Clear existing announcements before seeding
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblannouncements`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Seed announcements
-- -----------------------------------------------------
INSERT INTO `tblannouncements`
(`date`, `title`, `announcement`, `published`, `parentid`, `language`, `created_at`, `updated_at`)
VALUES
(
  '2026-03-10 10:00:00',
  'Platform Stability Update Completed',
  '<p>We have completed a stability update across the Venom Codes platform.</p><p>This update improves control panel responsiveness, license validation reliability, and session handling under high traffic.</p><p>No action is required from clients.</p>',
  1, 0, '', '2026-03-10 10:00:00', '2026-03-10 10:00:00'
),
(
  '2026-03-06 14:30:00',
  'License Transfer Window Improvements',
  '<p>License transfer requests are now processed with improved workflow checks.</p><ul><li>Faster confirmation</li><li>Clearer transfer status</li><li>Lower delay during server migration</li></ul><p>If you are planning infrastructure migration, open a support ticket before the move.</p>',
  1, 0, '', '2026-03-06 14:30:00', '2026-03-06 14:30:00'
),
(
  '2026-03-01 09:00:00',
  'Scheduled Infrastructure Maintenance',
  '<p>Scheduled maintenance was completed for backend monitoring services.</p><p>During this window, some clients may have seen short delays in dashboard metrics updates. Core license services remained online.</p>',
  1, 0, '', '2026-03-01 09:00:00', '2026-03-01 09:00:00'
),
(
  '2026-02-24 12:15:00',
  'Support Routing Optimization Is Live',
  '<p>Support routing has been optimized for faster technical handling.</p><ul><li>Critical technical requests are prioritized</li><li>Billing and account requests are routed to dedicated queues</li><li>Average first response time has been reduced</li></ul>',
  1, 0, '', '2026-02-24 12:15:00', '2026-02-24 12:15:00'
),
(
  '2026-02-15 11:20:00',
  'Billing Reminder Enhancements',
  '<p>Invoice reminder delivery has been improved to reduce missed renewals.</p><p>Reminder sequence now includes earlier notifications before due dates with clearer invoice details.</p>',
  1, 0, '', '2026-02-15 11:20:00', '2026-02-15 11:20:00'
),
(
  '2026-02-05 16:00:00',
  'New Client Guides and Documentation',
  '<p>We published new onboarding and operations guides in our client documentation flow.</p><p>These updates cover activation, load balancer expansion, and renewal best practices.</p>',
  1, 0, '', '2026-02-05 16:00:00', '2026-02-05 16:00:00'
);

-- =====================================================
-- Done: Announcements seeded successfully.
-- =====================================================
