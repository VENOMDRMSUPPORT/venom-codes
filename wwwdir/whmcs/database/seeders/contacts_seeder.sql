-- Contacts Seeder
-- Seeds one deterministic sub-contact per active client (idempotent)

SET @now_ts = NOW();

-- 1) Remove old deterministic contacts from previous runs
DELETE FROM `tblcontacts`
WHERE `email` LIKE 'seed.contact.%@venom.local';

-- 2) Insert one subaccount contact per active client
INSERT INTO `tblcontacts` (
  `userid`,
  `firstname`,
  `lastname`,
  `companyname`,
  `email`,
  `address1`,
  `address2`,
  `city`,
  `state`,
  `postcode`,
  `country`,
  `phonenumber`,
  `tax_id`,
  `subaccount`,
  `password`,
  `permissions`,
  `domainemails`,
  `generalemails`,
  `invoiceemails`,
  `productemails`,
  `supportemails`,
  `affiliateemails`,
  `pwresetkey`,
  `created_at`,
  `updated_at`,
  `pwresetexpiry`
)
SELECT
  c.`id` AS `userid`,
  CONCAT('Contact ', c.`id`) AS `firstname`,
  'Seeder' AS `lastname`,
  c.`companyname` AS `companyname`,
  CONCAT('seed.contact.', c.`id`, '@venom.local') AS `email`,
  c.`address1` AS `address1`,
  c.`address2` AS `address2`,
  c.`city` AS `city`,
  c.`state` AS `state`,
  c.`postcode` AS `postcode`,
  c.`country` AS `country`,
  c.`phonenumber` AS `phonenumber`,
  '' AS `tax_id`,
  1 AS `subaccount`,
  '' AS `password`,
  'profile,contacts,products,manageproducts,domains,managedomains,invoices,affiliates,emails,tickets,managecredits' AS `permissions`,
  1 AS `domainemails`,
  1 AS `generalemails`,
  1 AS `invoiceemails`,
  1 AS `productemails`,
  1 AS `supportemails`,
  0 AS `affiliateemails`,
  '' AS `pwresetkey`,
  @now_ts AS `created_at`,
  @now_ts AS `updated_at`,
  '0000-00-00 00:00:00' AS `pwresetexpiry`
FROM `tblclients` c
WHERE c.`status` = 'Active';
