-- Payment Methods Seeder (Account Pay Methods)
-- Purpose: seed valid pay method rows with linked payment records
-- so `/index.php?rp=/account/paymentmethods` can render without fatal errors.

SET @now_ts = NOW();

-- 1) Clean old demo methods + linked rows (idempotent)
DELETE cc
FROM `tblcreditcards` cc
INNER JOIN `tblpaymethods` pm ON pm.`id` = cc.`pay_method_id`
WHERE pm.`description` IN (
  'Demo Remote Bank Account - Primary',
  'Demo Remote Card - Backup'
);

DELETE ba
FROM `tblbankaccts` ba
INNER JOIN `tblpaymethods` pm ON pm.`id` = ba.`pay_method_id`
WHERE pm.`description` IN (
  'Demo Remote Bank Account - Primary',
  'Demo Remote Card - Backup'
);

DELETE FROM `tblpaymethods`
WHERE `description` IN (
  'Demo Remote Bank Account - Primary',
  'Demo Remote Card - Backup'
);

-- 2) Insert pay methods (parent rows)
INSERT INTO `tblpaymethods` (
  `userid`,
  `description`,
  `contact_id`,
  `contact_type`,
  `payment_id`,
  `payment_type`,
  `gateway_name`,
  `order_preference`,
  `created_at`,
  `updated_at`,
  `deleted_at`
)
SELECT
  uc.`auth_user_id` AS `userid`,
  'Demo Remote Bank Account - Primary' AS `description`,
  0 AS `contact_id`,
  'Client' AS `contact_type`,
  0 AS `payment_id`,
  'RemoteBankAccount' AS `payment_type`,
  'banktransfer' AS `gateway_name`,
  0 AS `order_preference`,
  @now_ts AS `created_at`,
  @now_ts AS `updated_at`,
  NULL AS `deleted_at`
FROM `tblusers_clients` uc
WHERE uc.`owner` = 1;

INSERT INTO `tblpaymethods` (
  `userid`,
  `description`,
  `contact_id`,
  `contact_type`,
  `payment_id`,
  `payment_type`,
  `gateway_name`,
  `order_preference`,
  `created_at`,
  `updated_at`,
  `deleted_at`
)
SELECT
  uc.`auth_user_id` AS `userid`,
  'Demo Remote Card - Backup' AS `description`,
  0 AS `contact_id`,
  'Client' AS `contact_type`,
  0 AS `payment_id`,
  'RemoteCreditCard' AS `payment_type`,
  'stripe' AS `gateway_name`,
  1 AS `order_preference`,
  @now_ts AS `created_at`,
  @now_ts AS `updated_at`,
  NULL AS `deleted_at`
FROM `tblusers_clients` uc
WHERE uc.`owner` = 1
ORDER BY uc.`auth_user_id` ASC
LIMIT 1;

-- 3) Insert linked payment rows (child rows)
INSERT INTO `tblbankaccts` (
  `pay_method_id`,
  `bank_name`,
  `acct_type`,
  `bank_data`,
  `created_at`,
  `updated_at`,
  `deleted_at`
)
SELECT
  pm.`id` AS `pay_method_id`,
  'Demo Bank' AS `bank_name`,
  'Checking' AS `acct_type`,
  '' AS `bank_data`,
  @now_ts AS `created_at`,
  @now_ts AS `updated_at`,
  NULL AS `deleted_at`
FROM `tblpaymethods` pm
WHERE pm.`description` = 'Demo Remote Bank Account - Primary'
  AND pm.`payment_type` = 'RemoteBankAccount'
  AND pm.`gateway_name` = 'banktransfer';

INSERT INTO `tblcreditcards` (
  `pay_method_id`,
  `card_type`,
  `last_four`,
  `expiry_date`,
  `card_data`,
  `created_at`,
  `updated_at`,
  `deleted_at`
)
SELECT
  pm.`id` AS `pay_method_id`,
  'Visa' AS `card_type`,
  '4242' AS `last_four`,
  DATE_ADD(@now_ts, INTERVAL 2 YEAR) AS `expiry_date`,
  '' AS `card_data`,
  @now_ts AS `created_at`,
  @now_ts AS `updated_at`,
  NULL AS `deleted_at`
FROM `tblpaymethods` pm
WHERE pm.`description` = 'Demo Remote Card - Backup'
  AND pm.`payment_type` = 'RemoteCreditCard'
  AND pm.`gateway_name` = 'stripe';

-- 4) Backfill payment_id on pay methods to point to linked rows
UPDATE `tblpaymethods` pm
SET pm.`payment_id` = (
    SELECT ba.`id`
    FROM `tblbankaccts` ba
    WHERE ba.`pay_method_id` = pm.`id`
    ORDER BY ba.`id` DESC
    LIMIT 1
)
WHERE pm.`payment_type` = 'RemoteBankAccount'
  AND pm.`description` = 'Demo Remote Bank Account - Primary';

UPDATE `tblpaymethods` pm
SET pm.`payment_id` = (
    SELECT cc.`id`
    FROM `tblcreditcards` cc
    WHERE cc.`pay_method_id` = pm.`id`
    ORDER BY cc.`id` DESC
    LIMIT 1
)
WHERE pm.`payment_type` = 'RemoteCreditCard'
  AND pm.`description` = 'Demo Remote Card - Backup';
