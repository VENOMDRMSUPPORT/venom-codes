-- =====================================================
-- Venom Codes - Clients Users Seeder
-- WARNING: DEVELOPMENT / STAGING USE ONLY
-- This script truncates client/user tables and recreates sample clients.
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\clients_users_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================
--
-- Login credentials (requested as comments):
-- 1) Email: client.one@venom-codes.test   | Password: Venom#1001
-- 2) Email: client.two@venom-codes.test   | Password: Venom#1002
-- 3) Email: client.three@venom-codes.test | Password: Venom#1003
-- 4) Email: client@venom-codes.test       | Password: client@123
--
-- Note:
-- - tblusers.password uses bcrypt hashes.
-- - tblclients.password is set as MD5 for legacy compatibility fields.
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblusers_clients`;
TRUNCATE TABLE `tblcontacts`;
TRUNCATE TABLE `tblusers`;
TRUNCATE TABLE `tblclients`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- Client/User #1
-- -----------------------------------------------------
INSERT INTO `tblclients` (
  `uuid`, `firstname`, `lastname`, `companyname`, `email`,
  `address1`, `address2`, `city`, `state`, `postcode`, `country`,
  `phonenumber`, `tax_id`, `password`, `authmodule`, `authdata`,
  `currency`, `defaultgateway`, `credit`, `taxexempt`, `latefeeoveride`,
  `overideduenotices`, `separateinvoices`, `disableautocc`, `datecreated`,
  `notes`, `billingcid`, `securityqid`, `securityqans`, `groupid`,
  `cardtype`, `cardlastfour`, `cardnum`, `startdate`, `expdate`, `issuenumber`,
  `bankname`, `banktype`, `bankcode`, `bankacct`, `gatewayid`,
  `lastlogin`, `ip`, `host`, `status`, `language`, `pwresetkey`,
  `emailoptout`, `marketing_emails_opt_in`, `overrideautoclose`, `allow_sso`,
  `email_verified`, `email_preferences`, `created_at`, `updated_at`, `pwresetexpiry`
) VALUES (
  UUID(), 'Client', 'One', 'Venom Client One', 'client.one@venom-codes.test',
  '100 Main Street', '', 'Cairo', 'Cairo', '11511', 'EG',
  '+20.1000000001', '', MD5('Venom#1001'), '', '',
  1, '', 0.00, 0, 0,
  0, 0, 0, '2026-03-11',
  '', 0, 0, '', 0,
  '', '', '', '', '', '',
  '', '', '', '', '',
  NULL, '', '', 'Active', '', '',
  0, 1, 0, 1,
  1, NULL, '2026-03-11 13:00:00', '2026-03-11 13:00:00', '0000-00-00 00:00:00'
);
SET @client_id_1 = LAST_INSERT_ID();

INSERT INTO `tblusers` (
  `first_name`, `last_name`, `email`, `password`, `language`,
  `second_factor`, `second_factor_config`, `remember_token`, `reset_token`,
  `security_question_id`, `security_question_answer`, `last_ip`, `last_hostname`,
  `last_login`, `email_verification_token`, `email_verification_token_expiry`,
  `email_verified_at`, `reset_token_expiry`, `created_at`, `updated_at`
) VALUES (
  'Client', 'One', 'client.one@venom-codes.test',
  '$2y$10$zbvtiE4z7kRxn3qMIWkZLuk67gdVx7DGR4Y8s7WEGK3Zwd.I2.6me', '',
  '', NULL, '', '',
  0, '', '', '',
  NULL, '', NULL,
  '2026-03-11 13:00:00', NULL, '2026-03-11 13:00:00', '2026-03-11 13:00:00'
);
SET @user_id_1 = LAST_INSERT_ID();

INSERT INTO `tblusers_clients` (
  `auth_user_id`, `client_id`, `invite_id`, `owner`,
  `permissions`, `last_login`, `created_at`, `updated_at`
) VALUES (
  @user_id_1, @client_id_1, 0, 1,
  NULL, NULL, '2026-03-11 13:00:00', '2026-03-11 13:00:00'
);

-- -----------------------------------------------------
-- Client/User #2
-- -----------------------------------------------------
INSERT INTO `tblclients` (
  `uuid`, `firstname`, `lastname`, `companyname`, `email`,
  `address1`, `address2`, `city`, `state`, `postcode`, `country`,
  `phonenumber`, `tax_id`, `password`, `authmodule`, `authdata`,
  `currency`, `defaultgateway`, `credit`, `taxexempt`, `latefeeoveride`,
  `overideduenotices`, `separateinvoices`, `disableautocc`, `datecreated`,
  `notes`, `billingcid`, `securityqid`, `securityqans`, `groupid`,
  `cardtype`, `cardlastfour`, `cardnum`, `startdate`, `expdate`, `issuenumber`,
  `bankname`, `banktype`, `bankcode`, `bankacct`, `gatewayid`,
  `lastlogin`, `ip`, `host`, `status`, `language`, `pwresetkey`,
  `emailoptout`, `marketing_emails_opt_in`, `overrideautoclose`, `allow_sso`,
  `email_verified`, `email_preferences`, `created_at`, `updated_at`, `pwresetexpiry`
) VALUES (
  UUID(), 'Client', 'Two', 'Venom Client Two', 'client.two@venom-codes.test',
  '200 Main Street', '', 'Giza', 'Giza', '12511', 'EG',
  '+20.1000000002', '', MD5('Venom#1002'), '', '',
  1, '', 0.00, 0, 0,
  0, 0, 0, '2026-03-11',
  '', 0, 0, '', 0,
  '', '', '', '', '', '',
  '', '', '', '', '',
  NULL, '', '', 'Active', '', '',
  0, 1, 0, 1,
  1, NULL, '2026-03-11 13:01:00', '2026-03-11 13:01:00', '0000-00-00 00:00:00'
);
SET @client_id_2 = LAST_INSERT_ID();

INSERT INTO `tblusers` (
  `first_name`, `last_name`, `email`, `password`, `language`,
  `second_factor`, `second_factor_config`, `remember_token`, `reset_token`,
  `security_question_id`, `security_question_answer`, `last_ip`, `last_hostname`,
  `last_login`, `email_verification_token`, `email_verification_token_expiry`,
  `email_verified_at`, `reset_token_expiry`, `created_at`, `updated_at`
) VALUES (
  'Client', 'Two', 'client.two@venom-codes.test',
  '$2y$10$Z/Qa4j3glaWy59YV2avvX.pJQcEZHYph7OSYjl1C52VTG/9TvVuR6', '',
  '', NULL, '', '',
  0, '', '', '',
  NULL, '', NULL,
  '2026-03-11 13:01:00', NULL, '2026-03-11 13:01:00', '2026-03-11 13:01:00'
);
SET @user_id_2 = LAST_INSERT_ID();

INSERT INTO `tblusers_clients` (
  `auth_user_id`, `client_id`, `invite_id`, `owner`,
  `permissions`, `last_login`, `created_at`, `updated_at`
) VALUES (
  @user_id_2, @client_id_2, 0, 1,
  NULL, NULL, '2026-03-11 13:01:00', '2026-03-11 13:01:00'
);

-- -----------------------------------------------------
-- Client/User #3
-- -----------------------------------------------------
INSERT INTO `tblclients` (
  `uuid`, `firstname`, `lastname`, `companyname`, `email`,
  `address1`, `address2`, `city`, `state`, `postcode`, `country`,
  `phonenumber`, `tax_id`, `password`, `authmodule`, `authdata`,
  `currency`, `defaultgateway`, `credit`, `taxexempt`, `latefeeoveride`,
  `overideduenotices`, `separateinvoices`, `disableautocc`, `datecreated`,
  `notes`, `billingcid`, `securityqid`, `securityqans`, `groupid`,
  `cardtype`, `cardlastfour`, `cardnum`, `startdate`, `expdate`, `issuenumber`,
  `bankname`, `banktype`, `bankcode`, `bankacct`, `gatewayid`,
  `lastlogin`, `ip`, `host`, `status`, `language`, `pwresetkey`,
  `emailoptout`, `marketing_emails_opt_in`, `overrideautoclose`, `allow_sso`,
  `email_verified`, `email_preferences`, `created_at`, `updated_at`, `pwresetexpiry`
) VALUES (
  UUID(), 'Client', 'Three', 'Venom Client Three', 'client.three@venom-codes.test',
  '300 Main Street', '', 'Alexandria', 'Alexandria', '21511', 'EG',
  '+20.1000000003', '', MD5('Venom#1003'), '', '',
  1, '', 0.00, 0, 0,
  0, 0, 0, '2026-03-11',
  '', 0, 0, '', 0,
  '', '', '', '', '', '',
  '', '', '', '', '',
  NULL, '', '', 'Active', '', '',
  0, 1, 0, 1,
  1, NULL, '2026-03-11 13:02:00', '2026-03-11 13:02:00', '0000-00-00 00:00:00'
);
SET @client_id_3 = LAST_INSERT_ID();

INSERT INTO `tblusers` (
  `first_name`, `last_name`, `email`, `password`, `language`,
  `second_factor`, `second_factor_config`, `remember_token`, `reset_token`,
  `security_question_id`, `security_question_answer`, `last_ip`, `last_hostname`,
  `last_login`, `email_verification_token`, `email_verification_token_expiry`,
  `email_verified_at`, `reset_token_expiry`, `created_at`, `updated_at`
) VALUES (
  'Client', 'Three', 'client.three@venom-codes.test',
  '$2y$10$n1g1108xmA5.KSz1QlGNEevgFzTxcWVc6qAZQYSd3XhMWKJjB40LG', '',
  '', NULL, '', '',
  0, '', '', '',
  NULL, '', NULL,
  '2026-03-11 13:02:00', NULL, '2026-03-11 13:02:00', '2026-03-11 13:02:00'
);
SET @user_id_3 = LAST_INSERT_ID();

INSERT INTO `tblusers_clients` (
  `auth_user_id`, `client_id`, `invite_id`, `owner`,
  `permissions`, `last_login`, `created_at`, `updated_at`
) VALUES (
  @user_id_3, @client_id_3, 0, 1,
  NULL, NULL, '2026-03-11 13:02:00', '2026-03-11 13:02:00'
);

-- -----------------------------------------------------
-- Client/User #4 (Automated Test Flow)
-- -----------------------------------------------------
INSERT INTO `tblclients` (
  `uuid`, `firstname`, `lastname`, `companyname`, `email`,
  `address1`, `address2`, `city`, `state`, `postcode`, `country`,
  `phonenumber`, `tax_id`, `password`, `authmodule`, `authdata`,
  `currency`, `defaultgateway`, `credit`, `taxexempt`, `latefeeoveride`,
  `overideduenotices`, `separateinvoices`, `disableautocc`, `datecreated`,
  `notes`, `billingcid`, `securityqid`, `securityqans`, `groupid`,
  `cardtype`, `cardlastfour`, `cardnum`, `startdate`, `expdate`, `issuenumber`,
  `bankname`, `banktype`, `bankcode`, `bankacct`, `gatewayid`,
  `lastlogin`, `ip`, `host`, `status`, `language`, `pwresetkey`,
  `emailoptout`, `marketing_emails_opt_in`, `overrideautoclose`, `allow_sso`,
  `email_verified`, `email_preferences`, `created_at`, `updated_at`, `pwresetexpiry`
) VALUES (
  UUID(), 'Automation', 'Client', 'Venom Automation Client', 'client@venom-codes.test',
  '400 Main Street', '', 'Cairo', 'Cairo', '11512', 'EG',
  '+20.1000000004', '', MD5('client@123'), '', '',
  1, '', 0.00, 0, 0,
  0, 0, 0, '2026-03-11',
  'Automated login flow test account', 0, 0, '', 0,
  '', '', '', '', '', '',
  '', '', '', '', '',
  NULL, '', '', 'Active', '', '',
  0, 1, 0, 1,
  1, NULL, '2026-03-11 13:03:00', '2026-03-11 13:03:00', '0000-00-00 00:00:00'
);
SET @client_id_4 = LAST_INSERT_ID();

INSERT INTO `tblusers` (
  `first_name`, `last_name`, `email`, `password`, `language`,
  `second_factor`, `second_factor_config`, `remember_token`, `reset_token`,
  `security_question_id`, `security_question_answer`, `last_ip`, `last_hostname`,
  `last_login`, `email_verification_token`, `email_verification_token_expiry`,
  `email_verified_at`, `reset_token_expiry`, `created_at`, `updated_at`
) VALUES (
  'Automation', 'Client', 'client@venom-codes.test',
  '$2y$10$hO5sxYfNcM0VomBOztrOqORQzRTOU.4M1sJeQ2NwWzGowizi8ErrW', '',
  '', NULL, '', '',
  0, '', '', '',
  NULL, '', NULL,
  '2026-03-11 13:03:00', NULL, '2026-03-11 13:03:00', '2026-03-11 13:03:00'
);
SET @user_id_4 = LAST_INSERT_ID();

INSERT INTO `tblusers_clients` (
  `auth_user_id`, `client_id`, `invite_id`, `owner`,
  `permissions`, `last_login`, `created_at`, `updated_at`
) VALUES (
  @user_id_4, @client_id_4, 0, 1,
  NULL, NULL, '2026-03-11 13:03:00', '2026-03-11 13:03:00'
);

-- =====================================================
-- Done: sample client users seeded successfully.
-- =====================================================
