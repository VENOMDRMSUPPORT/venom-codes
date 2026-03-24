-- =====================================================
-- Venom Codes - Email History Seeder
-- Server Licensing & Infrastructure Solutions
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\email_history_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

-- -----------------------------------------------------
-- RESET: Clear existing email history before seeding
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblemails`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Resolve client ids from seeded accounts (with safe fallback)
-- -----------------------------------------------------
SET @client_id_1 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.one@venom-codes.test' LIMIT 1), 1);
SET @client_id_2 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.two@venom-codes.test' LIMIT 1), 2);
SET @client_id_3 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.three@venom-codes.test' LIMIT 1), 3);
SET @client_id_4 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client@venom-codes.test' LIMIT 1), 4);

-- -----------------------------------------------------
-- Seed email history (success + pending + failed samples)
-- -----------------------------------------------------
INSERT INTO `tblemails`
(`userid`, `subject`, `message`, `date`, `to`, `cc`, `bcc`, `attachments`, `pending`, `message_data`, `failed`, `failure_reason`, `retry_count`, `created_at`, `updated_at`, `campaign_id`)
VALUES
(
  @client_id_1,
  'Welcome to Venom Codes',
  '<p>Dear Client One,</p><p>Your account has been activated successfully. You can now access your services and manage your licenses from the client area.</p><p>Regards,<br>Venom Codes Team</p>',
  '2026-03-11 08:30:00',
  'client.one@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Hosting Account Welcome Email","source":"system"}',
  0,
  '',
  0,
  '2026-03-11 08:30:00',
  '2026-03-11 08:30:00',
  0
),
(
  @client_id_2,
  'Invoice Created - INV-2026-10021',
  '<p>Dear Client Two,</p><p>A new invoice has been generated for your active license renewal.</p><p>Please complete payment before the due date to avoid service interruption.</p>',
  '2026-03-11 09:00:00',
  'client.two@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Invoice Created","invoice":"INV-2026-10021"}',
  0,
  '',
  0,
  '2026-03-11 09:00:00',
  '2026-03-11 09:00:00',
  0
),
(
  @client_id_3,
  'Invoice Payment Confirmation - INV-2026-10004',
  '<p>Dear Client Three,</p><p>We received your payment successfully. Your invoice is now marked as paid.</p><p>Thank you for your trust.</p>',
  '2026-03-11 09:45:00',
  'client.three@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Invoice Payment Confirmation","invoice":"INV-2026-10004"}',
  0,
  '',
  0,
  '2026-03-11 09:45:00',
  '2026-03-11 09:45:00',
  0
),
(
  @client_id_4,
  'License Upgrade Completed',
  '<p>Dear Automation Client,</p><p>Your license has been upgraded and new limits are now active.</p><p>No further action is required.</p>',
  '2026-03-11 10:10:00',
  'client@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Service Upgrade Notification","service":"License"}',
  0,
  '',
  0,
  '2026-03-11 10:10:00',
  '2026-03-11 10:10:00',
  0
),
(
  @client_id_2,
  'Billing Reminder - Due in 3 Days',
  '<p>This is a reminder that your invoice will be due in 3 days.</p><p>Please review your billing portal and confirm your payment method.</p>',
  '2026-03-11 10:40:00',
  'client.two@venom-codes.test',
  '',
  '',
  '',
  1,
  '{"template":"Invoice Reminder","stage":"3-days"}',
  0,
  '',
  0,
  '2026-03-11 10:40:00',
  '2026-03-11 10:40:00',
  0
),
(
  @client_id_1,
  'Support Ticket Update - #VC-9182',
  '<p>Your ticket has been updated by our technical team. Please review the latest response in your client area.</p>',
  '2026-03-11 11:05:00',
  'client.one@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Support Ticket Reply","ticket":"VC-9182"}',
  0,
  '',
  0,
  '2026-03-11 11:05:00',
  '2026-03-11 11:05:00',
  0
),
(
  @client_id_3,
  'Action Required: Email Verification',
  '<p>Please verify your email address by opening the verification link from your client area notifications.</p>',
  '2026-03-11 11:20:00',
  'client.three@venom-codes.test',
  '',
  '',
  '',
  0,
  '{"template":"Email Verification"}',
  1,
  'SMTP 550 - Mailbox unavailable',
  2,
  '2026-03-11 11:20:00',
  '2026-03-11 11:25:00',
  0
),
(
  @client_id_4,
  'Security Notice: New Login Detected',
  '<p>A new login to your account was detected from a new device.</p><p>If this was not you, reset your password immediately.</p>',
  '2026-03-11 11:50:00',
  'client@venom-codes.test',
  'security@venom-codes.test',
  '',
  '',
  0,
  '{"template":"Security Alert","event":"new-login"}',
  0,
  '',
  0,
  '2026-03-11 11:50:00',
  '2026-03-11 11:50:00',
  0
);

-- =====================================================
-- Done: Email history seeded successfully.
-- =====================================================
