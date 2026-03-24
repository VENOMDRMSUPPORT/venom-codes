-- =====================================================
-- Venom Codes - Support Tickets Full Seeder
-- WARNING: DEVELOPMENT / STAGING USE ONLY
-- This script resets ticket-related tables and seeds complete sample data.
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\support_tickets_full_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblticket_watchers`;
TRUNCATE TABLE `tblticketactions`;
TRUNCATE TABLE `tblticketfeedback`;
TRUNCATE TABLE `tblticketnotes`;
TRUNCATE TABLE `tblticketreplies`;
TRUNCATE TABLE `tbltickettags`;
TRUNCATE TABLE `tblticketlog`;
TRUNCATE TABLE `tblticketmaillog`;
TRUNCATE TABLE `tbltickets`;
TRUNCATE TABLE `tblticketdepartments`;
TRUNCATE TABLE `tblticketstatuses`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Resolve IDs from existing seeded users/admins
-- -----------------------------------------------------
SET @client_id_1 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.one@venom-codes.test' LIMIT 1), 1);
SET @client_id_2 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.two@venom-codes.test' LIMIT 1), 2);
SET @client_id_3 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client.three@venom-codes.test' LIMIT 1), 3);
SET @client_id_4 = COALESCE((SELECT `id` FROM `tblclients` WHERE `email` = 'client@venom-codes.test' LIMIT 1), 4);
SET @admin_id_1 = COALESCE((SELECT `id` FROM `tbladmins` ORDER BY `id` ASC LIMIT 1), 1);
SET @admin_id_2 = COALESCE((SELECT `id` FROM `tbladmins` ORDER BY `id` ASC LIMIT 1 OFFSET 1), @admin_id_1);

-- -----------------------------------------------------
-- Ticket statuses
-- -----------------------------------------------------
INSERT INTO `tblticketstatuses` (`title`, `color`, `sortorder`, `showactive`, `showawaiting`, `autoclose`) VALUES
('Open', '#779500', 1, 1, 1, 0),
('Answered', '#000000', 2, 1, 0, 1),
('Customer-Reply', '#ff6600', 3, 1, 1, 1),
('Closed', '#888888', 10, 0, 0, 0),
('On Hold', '#224488', 5, 1, 0, 0),
('In Progress', '#cc0000', 6, 1, 0, 0);

-- -----------------------------------------------------
-- Ticket departments
-- -----------------------------------------------------
INSERT INTO `tblticketdepartments`
(`name`, `description`, `email`, `clientsonly`, `piperepliesonly`, `noautoresponder`, `hidden`, `order`, `host`, `port`, `login`, `password`, `mail_auth_config`, `feedback_request`, `prevent_client_closure`)
VALUES
('General Support', 'General account and dashboard support', 'support@venom-codes.test', 'on', '', '', '', 1, '', '', '', '', '', 1, 0);
SET @dept_general = LAST_INSERT_ID();

INSERT INTO `tblticketdepartments`
(`name`, `description`, `email`, `clientsonly`, `piperepliesonly`, `noautoresponder`, `hidden`, `order`, `host`, `port`, `login`, `password`, `mail_auth_config`, `feedback_request`, `prevent_client_closure`)
VALUES
('Technical Support', 'Licensing, activation, and node troubleshooting', 'technical@venom-codes.test', 'on', '', '', '', 2, '', '', '', '', '', 1, 1);
SET @dept_technical = LAST_INSERT_ID();

INSERT INTO `tblticketdepartments`
(`name`, `description`, `email`, `clientsonly`, `piperepliesonly`, `noautoresponder`, `hidden`, `order`, `host`, `port`, `login`, `password`, `mail_auth_config`, `feedback_request`, `prevent_client_closure`)
VALUES
('Billing Department', 'Invoices, renewals, payment methods, and credits', 'billing@venom-codes.test', 'on', '', '', '', 3, '', '', '', '', '', 1, 0);
SET @dept_billing = LAST_INSERT_ID();

-- -----------------------------------------------------
-- Tickets
-- -----------------------------------------------------
INSERT INTO `tbltickets`
(`tid`, `did`, `userid`, `contactid`, `requestor_id`, `prevent_client_closure`, `name`, `email`, `cc`, `c`, `ipaddress`, `date`, `title`, `message`, `status`, `urgency`, `admin`, `attachment`, `attachments_removed`, `lastreply`, `flag`, `clientunread`, `adminunread`, `replyingadmin`, `replyingtime`, `service`, `merged_ticket_id`, `editor`, `pinned_at`, `ai_token_charged_at`, `updated_at`)
VALUES
('VC-240001', @dept_technical, @client_id_4, 0, 0, 1, 'Automation Client', 'client@venom-codes.test', '', 'f1ca274f38ce4f349e0ff8e8d6dff9cb', '127.0.0.1', '2026-03-11 12:10:00', 'License activation failed after migration', 'After moving to a new VPS, license validation returns hardware mismatch error. Need transfer guidance.', 'In Progress', 'High', 'Support Team', '', 0, '2026-03-11 12:40:00', @admin_id_1, 0, '', 0, '2026-03-11 12:40:00', 'License Service', 0, 'plain', NULL, NULL, '2026-03-11 12:40:00');
SET @ticket_id_1 = LAST_INSERT_ID();

INSERT INTO `tbltickets`
(`tid`, `did`, `userid`, `contactid`, `requestor_id`, `prevent_client_closure`, `name`, `email`, `cc`, `c`, `ipaddress`, `date`, `title`, `message`, `status`, `urgency`, `admin`, `attachment`, `attachments_removed`, `lastreply`, `flag`, `clientunread`, `adminunread`, `replyingadmin`, `replyingtime`, `service`, `merged_ticket_id`, `editor`, `pinned_at`, `ai_token_charged_at`, `updated_at`)
VALUES
('VC-240002', @dept_billing, @client_id_2, 0, 0, 0, 'Client Two', 'client.two@venom-codes.test', '', '8d4fb71ae7cb4bd1ad2a6672f2e3df67', '127.0.0.1', '2026-03-11 12:20:00', 'Invoice shows duplicate renewal line', 'Invoice INV-2026-10021 appears to include an extra renewal item. Please verify and correct if needed.', 'Customer-Reply', 'Medium', '', '', 0, '2026-03-11 12:55:00', 0, 1, '1', 0, '2026-03-11 12:55:00', 'Billing', 0, 'plain', NULL, NULL, '2026-03-11 12:55:00');
SET @ticket_id_2 = LAST_INSERT_ID();

INSERT INTO `tbltickets`
(`tid`, `did`, `userid`, `contactid`, `requestor_id`, `prevent_client_closure`, `name`, `email`, `cc`, `c`, `ipaddress`, `date`, `title`, `message`, `status`, `urgency`, `admin`, `attachment`, `attachments_removed`, `lastreply`, `flag`, `clientunread`, `adminunread`, `replyingadmin`, `replyingtime`, `service`, `merged_ticket_id`, `editor`, `pinned_at`, `ai_token_charged_at`, `updated_at`)
VALUES
('VC-240003', @dept_general, @client_id_1, 0, 0, 0, 'Client One', 'client.one@venom-codes.test', '', 'b9cd4d3d0dd14f6c880e4f3865f9ca30', '127.0.0.1', '2026-03-11 12:30:00', 'Need confirmation for load balancer limits', 'Please confirm current plan limits for additional load balancers and whether upgrade applies instantly.', 'Answered', 'Low', 'Support Team', '', 0, '2026-03-11 13:00:00', @admin_id_1, 0, '', 0, '2026-03-11 13:00:00', 'Product Inquiry', 0, 'plain', NULL, NULL, '2026-03-11 13:00:00');
SET @ticket_id_3 = LAST_INSERT_ID();

INSERT INTO `tbltickets`
(`tid`, `did`, `userid`, `contactid`, `requestor_id`, `prevent_client_closure`, `name`, `email`, `cc`, `c`, `ipaddress`, `date`, `title`, `message`, `status`, `urgency`, `admin`, `attachment`, `attachments_removed`, `lastreply`, `flag`, `clientunread`, `adminunread`, `replyingadmin`, `replyingtime`, `service`, `merged_ticket_id`, `editor`, `pinned_at`, `ai_token_charged_at`, `updated_at`)
VALUES
('VC-240004', @dept_technical, @client_id_3, 0, 0, 0, 'Client Three', 'client.three@venom-codes.test', '', '275bc9d915214676900ad2bc7d7a8aab', '127.0.0.1', '2026-03-11 12:45:00', 'API token rotation completed successfully', 'Issue resolved after token rotation and cache clear. You can close this ticket.', 'Closed', 'Low', 'Support Team', '', 0, '2026-03-11 13:10:00', @admin_id_1, 0, '', 0, '2026-03-11 13:10:00', 'API Integration', 0, 'plain', NULL, NULL, '2026-03-11 13:10:00');
SET @ticket_id_4 = LAST_INSERT_ID();

-- -----------------------------------------------------
-- Ticket replies
-- -----------------------------------------------------
INSERT INTO `tblticketreplies`
(`tid`, `userid`, `contactid`, `requestor_id`, `name`, `email`, `date`, `message`, `trace_id`, `admin`, `attachment`, `attachments_removed`, `rating`, `editor`, `agent_score`)
VALUES
(@ticket_id_1, 0, 0, 0, 'Support Team', '', '2026-03-11 12:25:00', 'We verified the migration event. Please confirm old machine deactivation, then we will reissue binding.', NULL, 'Support Team', '', 0, 0, 'plain', NULL),
(@ticket_id_1, @client_id_4, 0, 0, 'Automation Client', 'client@venom-codes.test', '2026-03-11 12:40:00', 'Old machine is now offline. Please proceed with re-bind.', NULL, '', '', 0, 0, 'plain', NULL),
(@ticket_id_2, 0, 0, 0, 'Billing Team', '', '2026-03-11 12:35:00', 'We removed the duplicate charge and regenerated the invoice. Please review the updated invoice total.', NULL, 'Billing Team', '', 0, 0, 'plain', NULL),
(@ticket_id_2, @client_id_2, 0, 0, 'Client Two', 'client.two@venom-codes.test', '2026-03-11 12:55:00', 'Confirmed, I can see the corrected amount now. Thanks.', NULL, '', '', 0, 0, 'plain', NULL),
(@ticket_id_3, 0, 0, 0, 'Support Team', '', '2026-03-11 13:00:00', 'Current plan includes 1 balancer. Upgrade to Ultra enables unlimited balancers instantly after payment.', NULL, 'Support Team', '', 0, 0, 'plain', NULL),
(@ticket_id_4, 0, 0, 0, 'Support Team', '', '2026-03-11 13:10:00', 'Great. Monitoring shows stable behavior after token rotation. Marking as closed.', NULL, 'Support Team', '', 0, 0, 'plain', NULL);

-- -----------------------------------------------------
-- Internal ticket notes
-- -----------------------------------------------------
INSERT INTO `tblticketnotes`
(`ticketid`, `admin`, `date`, `message`, `attachments`, `attachments_removed`, `editor`)
VALUES
(@ticket_id_1, 'Support Team', '2026-03-11 12:42:00', 'Priority raised due to potential downtime risk during migration.', '', 0, 'plain'),
(@ticket_id_2, 'Billing Team', '2026-03-11 12:36:00', 'Duplicate item matched known invoice-generation edge case. Manual correction applied.', '', 0, 'plain'),
(@ticket_id_4, 'Support Team', '2026-03-11 13:11:00', 'Resolved with no further action required. Customer confirmed.', '', 0, 'plain');

-- -----------------------------------------------------
-- Tags and watchers
-- -----------------------------------------------------
INSERT INTO `tbltickettags` (`ticketid`, `tag`) VALUES
(@ticket_id_1, 'activation'),
(@ticket_id_1, 'migration'),
(@ticket_id_2, 'billing'),
(@ticket_id_2, 'invoice'),
(@ticket_id_3, 'sales'),
(@ticket_id_4, 'api');

INSERT INTO `tblticket_watchers` (`ticket_id`, `admin_id`, `created_at`, `updated_at`)
SELECT @ticket_id_1, @admin_id_1, '2026-03-11 12:15:00', '2026-03-11 12:15:00'
WHERE @admin_id_1 > 0;

INSERT INTO `tblticket_watchers` (`ticket_id`, `admin_id`, `created_at`, `updated_at`)
SELECT @ticket_id_2, @admin_id_2, '2026-03-11 12:22:00', '2026-03-11 12:22:00'
WHERE @admin_id_2 > 0;

-- -----------------------------------------------------
-- Ticket actions, feedback, and logs
-- -----------------------------------------------------
INSERT INTO `tblticketactions`
(`ticket_id`, `action`, `status`, `parameters`, `scheduled`, `created_by_admin_id`, `updated_by_admin_id`, `skip_flags`, `status_at`, `processor_id`, `created_at`, `updated_at`)
VALUES
(@ticket_id_1, 'follow_up', 'completed', '{"department":"technical","reason":"migration-rebind"}', '2026-03-11 12:30:00', @admin_id_1, @admin_id_1, 0, '2026-03-11 12:40:00', 'system', '2026-03-11 12:30:00', '2026-03-11 12:40:00'),
(@ticket_id_2, 'request_feedback', 'completed', '{"channel":"email"}', '2026-03-11 12:58:00', @admin_id_1, @admin_id_1, 0, '2026-03-11 13:05:00', 'system', '2026-03-11 12:58:00', '2026-03-11 13:05:00');

INSERT INTO `tblticketfeedback`
(`ticketid`, `adminid`, `rating`, `comments`, `datetime`, `ip`)
VALUES
(@ticket_id_4, @admin_id_1, 5, 'Issue resolved quickly and clearly.', '2026-03-11 13:15:00', '127.0.0.1');

INSERT INTO `tblticketlog`
(`date`, `tid`, `action`)
VALUES
('2026-03-11 12:10:00', @ticket_id_1, 'Ticket Opened'),
('2026-03-11 12:25:00', @ticket_id_1, 'Admin Reply Added'),
('2026-03-11 12:40:00', @ticket_id_1, 'Client Reply Added'),
('2026-03-11 12:20:00', @ticket_id_2, 'Ticket Opened'),
('2026-03-11 12:35:00', @ticket_id_2, 'Admin Reply Added'),
('2026-03-11 12:55:00', @ticket_id_2, 'Client Reply Added'),
('2026-03-11 12:45:00', @ticket_id_4, 'Ticket Opened'),
('2026-03-11 13:10:00', @ticket_id_4, 'Status changed to Closed');

INSERT INTO `tblticketmaillog`
(`date`, `to`, `cc`, `name`, `email`, `subject`, `message`, `status`, `attachment`)
VALUES
('2026-03-11 12:10:05', 'technical@venom-codes.test', '', 'Automation Client', 'client@venom-codes.test', '[Ticket ID: VC-240001] License activation failed after migration', 'New ticket notification sent to Technical Support.', 'Success', ''),
('2026-03-11 12:35:05', 'client.two@venom-codes.test', '', 'Client Two', 'client.two@venom-codes.test', '[Ticket ID: VC-240002] Billing update', 'Invoice correction notice sent to client.', 'Success', ''),
('2026-03-11 13:10:05', 'client.three@venom-codes.test', '', 'Client Three', 'client.three@venom-codes.test', '[Ticket ID: VC-240004] Ticket closed', 'Closure confirmation email sent.', 'Success', '');

-- =====================================================
-- Done: Full support ticket data seeded successfully.
-- =====================================================
