-- =====================================================
-- Fix Addons Visibility + Default Currency (USD) Seeder
-- Production-Grade Version
-- =====================================================
-- 
-- Purpose:
--   This seeder normalizes addon mappings and sets USD as the default
--   currency for the system. It also ensures clients have active Pro
--   services so that the Additional Load Balancer addon is visible
--   and orderable in the client area.
--
-- Dependencies:
--   - Requires tblcurrencies table with USD currency entry
--   - Requires tblclients table (can be empty)
--   - Requires tblproducts table with 'venom-pro-license' product
--   - Requires tbladdons table with 'Additional Load Balancer' addon
--   - Requires tblhosting table for service records
--   - DEPENDS ON: products_licenses_with_load_balancer_seeder.sql
--
-- Operations Performed:
--   1) Sets USD as the system default currency
--   2) Migrates existing clients to USD currency
--   3) Normalizes Additional Load Balancer addon package mapping
--   4) Creates active Pro license services for clients (addon visibility)
--
-- Usage:
--   mysql -u root -p database_name < fix_addons_and_currency_seeder.sql
--   Or via PowerShell:
--   Get-Content "fix_addons_and_currency_seeder.sql" -Raw | & mysql.exe -h localhost -u root -p database_name
--
-- Environment Guard:
--   This seeder should ONLY be run in development/staging environments.
--   Set @allow_seed = 1 to enable execution (default: 0 for safety).
--
-- Idempotency:
--   - Uses UPDATE for currency and addon normalization
--   - Uses INSERT ... SELECT with NOT EXISTS for services (no duplicates)
--   - Can be safely run multiple times
--
-- =====================================================

-- =====================================================
-- Environment Guard Configuration
-- =====================================================
-- Change @allow_seed to 1 to allow execution
SET @allow_seed = 1;
SET @environment = 'development'; -- 'development', 'staging', or 'production'

-- Safety check - only allow in non-production environments
SET @seed_allowed = IF(@allow_seed = 1 AND @environment IN ('development', 'staging'), 1, 0);

-- Exit message if blocked
SELECT IF(@seed_allowed = 0, 
    'ERROR: Seeder blocked. Set @allow_seed = 1 and @environment to development/staging to proceed.',
    'Environment check passed. Proceeding with seed...'
) AS status;

-- =====================================================
-- Stored Procedure for Safe Seeding
-- =====================================================

DELIMITER //

DROP PROCEDURE IF EXISTS sp_fix_addons_and_currency //

CREATE PROCEDURE sp_fix_addons_and_currency()
BEGIN
    -- =====================================================
    -- Variable Declarations
    -- =====================================================
    DECLARE v_usd_currency_id INT DEFAULT 0;
    DECLARE v_pro_pid INT DEFAULT 0;
    DECLARE v_addon_id INT DEFAULT 0;
    DECLARE v_client_count INT DEFAULT 0;
    DECLARE v_services_created INT DEFAULT 0;
    DECLARE v_rows_affected INT DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: Addons/Currency fix failed. Transaction rolled back.' AS error_message;
        RESIGNAL;
    END;
    
    -- =====================================================
    -- Environment Guard Check
    -- =====================================================
    IF @seed_allowed = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Seeder blocked by environment guard. Set @allow_seed = 1 and @environment to development/staging.';
    END IF;
    
    START TRANSACTION;
    
    SELECT 'Starting addons and currency normalization...' AS status;
    
    -- =====================================================
    -- Define Constants
    -- =====================================================
    SET @now_ts = NOW();
    SET @today = CURDATE();
    SET @next_due = DATE_ADD(CURDATE(), INTERVAL 30 DAY);
    SET @default_payment_method = 'paypal'; -- Default payment method for seeded services
    
    -- =====================================================
    -- Step 1: Validate Prerequisites
    -- =====================================================
    SELECT 'Step 1: Validating prerequisites...' AS status;
    
    -- Get USD currency ID
    SELECT `id` INTO v_usd_currency_id 
    FROM `tblcurrencies` 
    WHERE `code` = 'USD' 
    LIMIT 1;
    
    IF v_usd_currency_id = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'USD currency not found in tblcurrencies. Please add USD currency first.';
    END IF;
    SELECT CONCAT('Found USD currency (ID: ', v_usd_currency_id, ')') AS result;
    
    -- Get Pro License product ID
    SELECT `id` INTO v_pro_pid 
    FROM `tblproducts` 
    WHERE `slug` = 'venom-pro-license' 
    LIMIT 1;
    
    IF v_pro_pid = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Pro License product not found. Run products_licenses_with_load_balancer_seeder.sql first.';
    END IF;
    SELECT CONCAT('Found Pro License product (ID: ', v_pro_pid, ')') AS result;
    
    -- Get Load Balancer addon ID
    SELECT `id` INTO v_addon_id 
    FROM `tbladdons` 
    WHERE `name` = 'Additional Load Balancer' 
    LIMIT 1;
    
    IF v_addon_id = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Additional Load Balancer addon not found. Run products_licenses_with_load_balancer_seeder.sql first.';
    END IF;
    SELECT CONCAT('Found Load Balancer addon (ID: ', v_addon_id, ')') AS result;
    
    -- =====================================================
    -- Step 2: Set USD as Default Currency
    -- =====================================================
    SELECT 'Step 2: Setting USD as default currency...' AS status;
    
    -- First, set all currencies to non-default
    UPDATE `tblcurrencies` SET `default` = 0;
    
    -- Then set USD as default
    UPDATE `tblcurrencies` 
    SET `default` = 1,
        `updated_at` = @now_ts
    WHERE `id` = v_usd_currency_id;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('USD set as default currency (', v_rows_affected, ' row updated)') AS result;
    
    -- =====================================================
    -- Step 3: Migrate Existing Clients to USD
    -- =====================================================
    SELECT 'Step 3: Migrating existing clients to USD...' AS status;
    
    -- Count clients that need updating
    SELECT COUNT(*) INTO v_client_count
    FROM `tblclients`
    WHERE `currency` != v_usd_currency_id OR `currency` IS NULL;
    
    IF v_client_count > 0 THEN
        UPDATE `tblclients` 
        SET `currency` = v_usd_currency_id,
            `updated_at` = @now_ts
        WHERE `currency` != v_usd_currency_id OR `currency` IS NULL;
        
        SET v_rows_affected = ROW_COUNT();
        SELECT CONCAT('Migrated ', v_rows_affected, ' clients to USD currency') AS result;
    ELSE
        SELECT 'No clients needed currency migration' AS result;
    END IF;
    
    -- =====================================================
    -- Step 4: Normalize Addon Package Mapping
    -- =====================================================
    SELECT 'Step 4: Normalizing addon package mapping...' AS status;
    
    -- Update the addon to only be available for Pro License
    UPDATE `tbladdons`
    SET 
        `packages` = CAST(v_pro_pid AS CHAR),
        `allowqty` = 2,  -- Allow up to 2 additional load balancers
        `updated_at` = @now_ts
    WHERE `id` = v_addon_id;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Addon package mapping normalized (', v_rows_affected, ' row updated)') AS result;
    
    -- =====================================================
    -- Step 5: Create Active Pro Services for Clients
    -- This ensures the addon is visible and orderable
    -- =====================================================
    SELECT 'Step 5: Creating active Pro services for clients...' AS status;
    
    -- Count clients without active Pro services
    SELECT COUNT(*) INTO v_client_count
    FROM `tblclients` c
    WHERE NOT EXISTS (
        SELECT 1
        FROM `tblhosting` h
        WHERE h.`userid` = c.`id`
          AND h.`packageid` = v_pro_pid
          AND h.`domainstatus` IN ('Active', 'Pending', 'Suspended', 'Completed')
    );
    
    IF v_client_count > 0 THEN
        -- Insert Pro services for clients who don't have one
        -- Using INSERT IGNORE for additional safety
        INSERT INTO `tblhosting` (
            `userid`, `orderid`, `packageid`, `server`, `regdate`, 
            `domain`, `domainstatus`, `paymentmethod`, `qty`, 
            `firstpaymentamount`, `amount`, `billingcycle`, 
            `nextduedate`, `nextinvoicedate`, 
            `termination_date`, `completed_date`,
            `username`, `password`, `notes`,
            `subscriptionid`, `promoid`, `promocount`, 
            `suspendreason`, `overideautosuspend`, `overidesuspenduntil`,
            `dedicatedip`, `assignedips`, `ns1`, `ns2`, 
            `diskusage`, `disklimit`, `bwusage`, `bwlimit`, 
            `lastupdate`, `created_at`, `updated_at`
        )
        SELECT
            c.`id`,
            0,                                    -- orderid (0 = seeded)
            v_pro_pid,                            -- packageid
            0,                                    -- server (0 = no server assigned)
            @today,                               -- regdate
            CONCAT('license-srv-', LPAD(c.`id`, 6, '0'), '.svc.yourcompany.tld'), -- domain (license identifier)
            'Active',                             -- domainstatus
            @default_payment_method,              -- paymentmethod
            1,                                    -- qty
            100.00,                               -- firstpaymentamount
            100.00,                               -- amount (monthly)
            'Monthly',                            -- billingcycle
            @next_due,                            -- nextduedate
            @next_due,                            -- nextinvoicedate
            '0000-00-00',                         -- termination_date
            '0000-00-00',                         -- completed_date
            '',                                   -- username
            '',                                   -- password
            'Seeded Pro license service - enables Load Balancer addon visibility', -- notes
            '',                                   -- subscriptionid
            0,                                    -- promoid
            0,                                    -- promocount
            '',                                   -- suspendreason
            0,                                    -- overideautosuspend
            '0000-00-00',                         -- overidesuspenduntil
            '',                                   -- dedicatedip
            '',                                   -- assignedips
            '',                                   -- ns1
            '',                                   -- ns2
            0,                                    -- diskusage
            0,                                    -- disklimit
            0,                                    -- bwusage
            0,                                    -- bwlimit
            @now_ts,                              -- lastupdate
            @now_ts,                              -- created_at
            @now_ts                               -- updated_at
        FROM `tblclients` c
        WHERE NOT EXISTS (
            SELECT 1
            FROM `tblhosting` h
            WHERE h.`userid` = c.`id`
              AND h.`packageid` = v_pro_pid
              AND h.`domainstatus` IN ('Active', 'Pending', 'Suspended', 'Completed')
        );
        
        SET v_services_created = ROW_COUNT();
        SELECT CONCAT('Created ', v_services_created, ' Pro license services for addon visibility') AS result;
    ELSE
        SELECT 'All clients already have active Pro services' AS result;
    END IF;
    
    -- =====================================================
    -- Commit Transaction
    -- =====================================================
    COMMIT;
    
    -- =====================================================
    -- Summary Report
    -- =====================================================
    SELECT '=============================================' AS '';
    SELECT 'NORMALIZATION COMPLETE - SUMMARY' AS '';
    SELECT '=============================================' AS '';
    SELECT CONCAT('USD Currency ID: ', v_usd_currency_id) AS info;
    SELECT CONCAT('Pro License Product ID: ', v_pro_pid) AS info;
    SELECT CONCAT('Load Balancer Addon ID: ', v_addon_id) AS info;
    SELECT CONCAT('Pro Services Created: ', v_services_created) AS info;
    SELECT '=============================================' AS '';
    
END //

DELIMITER ;

-- =====================================================
-- Execute the seeding procedure
-- =====================================================

CALL sp_fix_addons_and_currency();

-- Clean up the procedure (optional - comment out if you want to keep it)
DROP PROCEDURE IF EXISTS sp_fix_addons_and_currency;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Verify default currency
SELECT 
    `id`,
    `code`,
    `prefix`,
    `suffix`,
    `default`,
    `rate`
FROM `tblcurrencies`
ORDER BY `default` DESC, `code`;

-- Verify client currency distribution
SELECT 
    c.`currency`,
    cur.`code`,
    COUNT(*) AS client_count
FROM `tblclients` c
LEFT JOIN `tblcurrencies` cur ON cur.`id` = c.`currency`
GROUP BY c.`currency`, cur.`code`;

-- Verify addon configuration
SELECT 
    a.`id`,
    a.`name`,
    a.`packages`,
    a.`billingcycle`,
    a.`allowqty`,
    p.`name` AS linked_product,
    p.`slug` AS product_slug
FROM `tbladdons` a
LEFT JOIN `tblproducts` p ON p.`id` = CAST(a.`packages` AS UNSIGNED)
WHERE a.`name` = 'Additional Load Balancer';

-- Verify Pro services
SELECT 
    c.`id` AS client_id,
    c.`firstname`,
    c.`lastname`,
    c.`email`,
    h.`id` AS service_id,
    h.`domain` AS license_domain,
    h.`domainstatus`,
    h.`billingcycle`,
    h.`amount`,
    h.`nextduedate`
FROM `tblclients` c
INNER JOIN `tblhosting` h ON h.`userid` = c.`id`
INNER JOIN `tblproducts` p ON p.`id` = h.`packageid`
WHERE p.`slug` = 'venom-pro-license'
ORDER BY c.`id`;

-- =====================================================
-- Done: Addon visibility + USD default currency fixed.
-- =====================================================
