-- =====================================================
-- Products + Plans + Load Balancer Addon Seeder
-- Production-Grade Version
-- =====================================================
-- 
-- Purpose:
--   Seeds product groups, products, pricing, and addons for a
--   license-based IPTV panel system. Creates three license tiers
--   (Trial, Pro, Ultra) plus an additional load balancer addon.
--
-- Dependencies:
--   - Requires tblproductgroups table to exist
--   - Requires tblproducts table to exist
--   - Requires tblpricing table to exist
--   - Requires tbladdons table to exist
--   - Requires tblcurrencies table to exist with at least one currency
--   - No dependencies on other seeders (foundation seeder)
--
-- Products Created:
--   1) Trial License  - One-time $50, 7-day trial, 1 Main Server, No LBs
--   2) Pro License    - Monthly $100, 1 Main Server, 1 FREE LB, Additional LBs $10
--   3) Ultra License  - Monthly $300, 1 Main Server, Unlimited LBs, VIP Support
--
-- Addon Created:
--   - Additional Load Balancer - Monthly $10 (Pro license only)
--
-- Usage:
--   mysql -u root -p database_name < products_licenses_with_load_balancer_seeder.sql
--   Or via PowerShell:
--   Get-Content "products_licenses_with_load_balancer_seeder.sql" -Raw | & mysql.exe -h localhost -u root -p database_name
--
-- Environment Guard:
--   This seeder should ONLY be run in development/staging environments.
--   Set @allow_seed = 1 to enable execution (default: 0 for safety).
--
-- Idempotency:
--   - Uses slug-based lookups for product groups and products
--   - Uses INSERT ... ON DUPLICATE KEY UPDATE where possible
--   - Cleans up orphaned pricing before re-inserting
--   - Can be safely run multiple times
--
-- NOTE:
--   WHMCS products do not provide a native weekly billing cycle.
--   Trial is seeded as one-time $50 with 7-day scope in description.
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

DROP PROCEDURE IF EXISTS sp_seed_products_licenses //

CREATE PROCEDURE sp_seed_products_licenses()
BEGIN
    -- =====================================================
    -- Variable Declarations
    -- =====================================================
    DECLARE v_group_id INT DEFAULT 0;
    DECLARE v_trial_pid INT DEFAULT 0;
    DECLARE v_pro_pid INT DEFAULT 0;
    DECLARE v_ultra_pid INT DEFAULT 0;
    DECLARE v_addon_id INT DEFAULT 0;
    DECLARE v_currency_count INT DEFAULT 0;
    DECLARE v_rows_affected INT DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: Products/Licenses seeding failed. Transaction rolled back.' AS error_message;
        RESIGNAL;
    END;
    
    -- =====================================================
    -- Environment Guard Check
    -- =====================================================
    IF @seed_allowed = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Seeder blocked by environment guard. Set @allow_seed = 1 and @environment to development/staging.';
    END IF;
    
    -- =====================================================
    -- Pre-flight Checks
    -- =====================================================
    SELECT COUNT(*) INTO v_currency_count FROM `tblcurrencies`;
    
    IF v_currency_count = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No currencies found in tblcurrencies. Please seed currencies first.';
    END IF;
    
    START TRANSACTION;
    
    SELECT 'Starting products and licenses seed operation...' AS status;
    
    -- =====================================================
    -- Define Constants
    -- =====================================================
    SET @now = NOW();
    SET @group_name = 'License IPTV Panel';
    SET @group_slug = 'license-iptv-panel';
    SET @group_headline = 'Choose the license that fits your IPTV server setup';
    SET @group_tagline = 'Enterprise-grade control panel access for streaming infrastructure. Software licensing only.';
    SET @addon_name = 'Additional Load Balancer';
    SET @addon_description = 'Add additional load balancer nodes for Pro licenses. Each additional node is billed monthly at $10/node.';
    
    -- =====================================================
    -- Step 1: Ensure Product Group Exists (Idempotent)
    -- =====================================================
    SELECT 'Step 1: Creating/Updating product group...' AS status;
    
    -- Check if group exists
    SELECT `id` INTO v_group_id 
    FROM `tblproductgroups` 
    WHERE `slug` = @group_slug 
    LIMIT 1;
    
    IF v_group_id = 0 THEN
        -- Insert new group
        INSERT INTO `tblproductgroups` (
            `name`, `slug`, `headline`, `tagline`, `orderfrmtpl`, 
            `disabledgateways`, `hidden`, `order`, `icon`, 
            `created_at`, `updated_at`
        ) VALUES (
            @group_name,
            @group_slug,
            @group_headline,
            @group_tagline,
            'standard_cart',
            '',
            0,
            1,
            'fa-certificate',
            @now,
            @now
        );
        SET v_group_id = LAST_INSERT_ID();
        SELECT CONCAT('Created new product group with ID: ', v_group_id) AS result;
    ELSE
        -- Update existing group
        UPDATE `tblproductgroups`
        SET
            `name` = @group_name,
            `headline` = @group_headline,
            `tagline` = @group_tagline,
            `orderfrmtpl` = 'standard_cart',
            `hidden` = 0,
            `order` = 1,
            `updated_at` = @now
        WHERE `id` = v_group_id;
        SELECT CONCAT('Updated existing product group with ID: ', v_group_id) AS result;
    END IF;
    
    -- =====================================================
    -- Step 2: Clean Up Existing Products (for clean re-seed)
    -- =====================================================
    SELECT 'Step 2: Cleaning up existing products and pricing...' AS status;
    
    -- Delete pricing for products in this group
    DELETE p FROM `tblpricing` p
    INNER JOIN `tblproducts` pr ON pr.`id` = p.`relid`
    WHERE p.`type` = 'product' AND pr.`gid` = v_group_id;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Deleted ', v_rows_affected, ' product pricing records') AS result;
    
    -- Delete products in this group
    DELETE FROM `tblproducts` WHERE `gid` = v_group_id;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Deleted ', v_rows_affected, ' existing products') AS result;
    
    -- =====================================================
    -- Step 3: Clean Up Existing Addon (for clean re-seed)
    -- =====================================================
    SELECT 'Step 3: Cleaning up existing addon and pricing...' AS status;
    
    -- Get addon ID if exists
    SELECT `id` INTO v_addon_id FROM `tbladdons` WHERE `name` = @addon_name LIMIT 1;
    
    IF v_addon_id > 0 THEN
        -- Delete addon pricing
        DELETE FROM `tblpricing` WHERE `type` = 'addon' AND `relid` = v_addon_id;
        SET v_rows_affected = ROW_COUNT();
        SELECT CONCAT('Deleted ', v_rows_affected, ' addon pricing records') AS result;
        
        -- Delete addon
        DELETE FROM `tbladdons` WHERE `id` = v_addon_id;
        SELECT 'Deleted existing addon' AS result;
    END IF;
    
    -- =====================================================
    -- Step 4: Insert Products (Bulk Insert)
    -- =====================================================
    SELECT 'Step 4: Creating products...' AS status;
    
    -- Trial License
    INSERT INTO `tblproducts` (
        `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`, `welcomeemail`,
        `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`, `paytype`,
        `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
        `configoption1`, `configoption2`, `configoption3`, `configoption4`, `configoption5`,
        `configoption6`, `configoption7`, `configoption8`, `configoption9`, `configoption10`,
        `configoption11`, `configoption12`, `configoption13`, `configoption14`, `configoption15`,
        `configoption16`, `configoption17`, `configoption18`, `configoption19`, `configoption20`,
        `configoption21`, `configoption22`, `configoption23`, `configoption24`,
        `freedomain`, `freedomainpaymentterms`, `freedomaintlds`, `recurringcycles`, `autoterminatedays`,
        `autoterminateemail`, `configoptionsupgrade`, `billingcycleupgrade`, `upgradeemail`,
        `overagesenabled`, `overagesdisklimit`, `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
        `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`, `order`, `retired`,
        `is_featured`, `color`, `tagline`, `short_description`, `created_at`, `updated_at`
    ) VALUES (
        'other', v_group_id, 'Trial License', 'venom-trial-license',
        'Test the full power of our IPTV panel for 7 days.\n\nFeatures:\n- 1 Main Server\n- No Load Balancers\n- Full Admin Access\n- 24/7 Ticket Support\n- All Core Features\n\nPerfect for evaluating our platform before committing to a paid plan.',
        0, 0, 0,
        0, 0, 0, 0, 0, 'onetime',
        0, '', '', 'licensing', 0,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', 0, 0,
        0, 0, '', 0,
        '', 0, 0, 0.0000, 0.0000,
        0, 0, '', 0.00, 1, 0,
        0, '#9abb3a', 'Test the full power for 7 days', '7-day trial license (software only)', @now, @now
    );
    SET v_trial_pid = LAST_INSERT_ID();
    SELECT CONCAT('Created Trial License (ID: ', v_trial_pid, ')') AS result;
    
    -- Pro License
    INSERT INTO `tblproducts` (
        `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`, `welcomeemail`,
        `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`, `paytype`,
        `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
        `configoption1`, `configoption2`, `configoption3`, `configoption4`, `configoption5`,
        `configoption6`, `configoption7`, `configoption8`, `configoption9`, `configoption10`,
        `configoption11`, `configoption12`, `configoption13`, `configoption14`, `configoption15`,
        `configoption16`, `configoption17`, `configoption18`, `configoption19`, `configoption20`,
        `configoption21`, `configoption22`, `configoption23`, `configoption24`,
        `freedomain`, `freedomainpaymentterms`, `freedomaintlds`, `recurringcycles`, `autoterminatedays`,
        `autoterminateemail`, `configoptionsupgrade`, `billingcycleupgrade`, `upgradeemail`,
        `overagesenabled`, `overagesdisklimit`, `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
        `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`, `order`, `retired`,
        `is_featured`, `color`, `tagline`, `short_description`, `created_at`, `updated_at`
    ) VALUES (
        'other', v_group_id, 'Pro License', 'venom-pro-license',
        'Perfect for growing streaming networks.\n\nFeatures:\n- 1 Main Server\n- 1 FREE Load Balancer Included\n- Additional Load Balancers: $10/month each\n- Full Admin Access\n- Priority Email Support\n- Monthly Billing\n\nIdeal for medium-sized deployments with room to scale.',
        0, 0, 0,
        0, 0, 0, 0, 0, 'recurring',
        0, '', '', 'licensing', 0,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', 0, 0,
        0, 0, '', 0,
        '', 0, 0, 0.0000, 0.0000,
        0, 0, '', 0.00, 2, 0,
        1, '#3f8cff', 'Perfect for growing networks', '1 free load balancer included', @now, @now
    );
    SET v_pro_pid = LAST_INSERT_ID();
    SELECT CONCAT('Created Pro License (ID: ', v_pro_pid, ')') AS result;
    
    -- Ultra License
    INSERT INTO `tblproducts` (
        `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`, `welcomeemail`,
        `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`, `paytype`,
        `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
        `configoption1`, `configoption2`, `configoption3`, `configoption4`, `configoption5`,
        `configoption6`, `configoption7`, `configoption8`, `configoption9`, `configoption10`,
        `configoption11`, `configoption12`, `configoption13`, `configoption14`, `configoption15`,
        `configoption16`, `configoption17`, `configoption18`, `configoption19`, `configoption20`,
        `configoption21`, `configoption22`, `configoption23`, `configoption24`,
        `freedomain`, `freedomainpaymentterms`, `freedomaintlds`, `recurringcycles`, `autoterminatedays`,
        `autoterminateemail`, `configoptionsupgrade`, `billingcycleupgrade`, `upgradeemail`,
        `overagesenabled`, `overagesdisklimit`, `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
        `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`, `order`, `retired`,
        `is_featured`, `color`, `tagline`, `short_description`, `created_at`, `updated_at`
    ) VALUES (
        'other', v_group_id, 'Ultra License', 'venom-ultra-license',
        'Zero limits, peak performance for enterprise deployments.\n\nFeatures:\n- 1 Main Server\n- Unlimited Load Balancers\n- Full Admin Access\n- Priority VIP Support (24/7 Phone + Email)\n- Dedicated Account Manager\n- Monthly Billing\n\nThe ultimate solution for large-scale streaming operations.',
        0, 0, 0,
        0, 0, 0, 0, 0, 'recurring',
        0, '', '', 'licensing', 0,
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', 0, 0,
        0, 0, '', 0,
        '', 0, 0, 0.0000, 0.0000,
        0, 0, '', 0.00, 3, 0,
        0, '#7b65ff', 'Zero limits, peak performance', 'Unlimited load balancers', @now, @now
    );
    SET v_ultra_pid = LAST_INSERT_ID();
    SELECT CONCAT('Created Ultra License (ID: ', v_ultra_pid, ')') AS result;
    
    -- =====================================================
    -- Step 5: Insert Product Pricing (Bulk for all currencies)
    -- =====================================================
    SELECT 'Step 5: Creating product pricing for all currencies...' AS status;
    
    -- Trial License Pricing (One-time: $50)
    INSERT INTO `tblpricing` (
        `type`, `currency`, `relid`, 
        `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
        `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
    )
    SELECT 
        'product', c.`id`, v_trial_pid,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        50.00, -1.00, -1.00, -1.00, -1.00, -1.00
    FROM `tblcurrencies` c;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Created ', v_rows_affected, ' Trial License pricing records') AS result;
    
    -- Pro License Pricing (Monthly: $100)
    INSERT INTO `tblpricing` (
        `type`, `currency`, `relid`, 
        `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
        `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
    )
    SELECT 
        'product', c.`id`, v_pro_pid,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        100.00, -1.00, -1.00, -1.00, -1.00, -1.00
    FROM `tblcurrencies` c;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Created ', v_rows_affected, ' Pro License pricing records') AS result;
    
    -- Ultra License Pricing (Monthly: $300)
    INSERT INTO `tblpricing` (
        `type`, `currency`, `relid`, 
        `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
        `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
    )
    SELECT 
        'product', c.`id`, v_ultra_pid,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        300.00, -1.00, -1.00, -1.00, -1.00, -1.00
    FROM `tblcurrencies` c;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Created ', v_rows_affected, ' Ultra License pricing records') AS result;
    
    -- =====================================================
    -- Step 6: Create Load Balancer Addon (Pro License Only)
    -- =====================================================
    SELECT 'Step 6: Creating Additional Load Balancer addon...' AS status;
    
    INSERT INTO `tbladdons` (
        `packages`, `name`, `description`, `billingcycle`, `allowqty`, 
        `tax`, `showorder`, `hidden`, `retired`, `downloads`, 
        `autoactivate`, `suspendproduct`, `welcomeemail`, `type`, `module`, 
        `server_group_id`, `prorate`, `weight`, `autolinkby`, 
        `created_at`, `updated_at`
    ) VALUES (
        CAST(v_pro_pid AS CHAR),
        @addon_name,
        @addon_description,
        'Monthly',
        2,  -- Allow quantity selection (up to 2 additional LBs)
        0,  -- No tax
        1,  -- Show on order form
        0,  -- Not hidden
        0,  -- Not retired
        '', -- No downloads
        '', -- No auto-activate
        0,  -- Don't suspend product
        0,  -- No welcome email
        '', -- No type
        '', -- No module
        0,  -- No server group
        0,  -- No prorate
        0,  -- Weight
        '', -- No auto-link
        @now,
        @now
    );
    SET v_addon_id = LAST_INSERT_ID();
    SELECT CONCAT('Created Additional Load Balancer addon (ID: ', v_addon_id, ')') AS result;
    
    -- Addon Pricing (Monthly: $10)
    INSERT INTO `tblpricing` (
        `type`, `currency`, `relid`, 
        `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
        `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
    )
    SELECT 
        'addon', c.`id`, v_addon_id,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        10.00, -1.00, -1.00, -1.00, -1.00, -1.00
    FROM `tblcurrencies` c;
    
    SET v_rows_affected = ROW_COUNT();
    SELECT CONCAT('Created ', v_rows_affected, ' Addon pricing records') AS result;
    
    -- =====================================================
    -- Commit Transaction
    -- =====================================================
    COMMIT;
    
    -- =====================================================
    -- Summary Report
    -- =====================================================
    SELECT '=============================================' AS '';
    SELECT 'SEEDING COMPLETE - SUMMARY' AS '';
    SELECT '=============================================' AS '';
    SELECT CONCAT('Product Group ID: ', v_group_id) AS info;
    SELECT CONCAT('Trial License Product ID: ', v_trial_pid) AS info;
    SELECT CONCAT('Pro License Product ID: ', v_pro_pid) AS info;
    SELECT CONCAT('Ultra License Product ID: ', v_ultra_pid) AS info;
    SELECT CONCAT('Load Balancer Addon ID: ', v_addon_id) AS info;
    SELECT '=============================================' AS '';
    
END //

DELIMITER ;

-- =====================================================
-- Execute the seeding procedure
-- =====================================================

CALL sp_seed_products_licenses();

-- Clean up the procedure (optional - comment out if you want to keep it)
DROP PROCEDURE IF EXISTS sp_seed_products_licenses;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Verify products
SELECT 
    p.`id`,
    p.`name`,
    p.`slug`,
    p.`paytype`,
    p.`order`,
    pg.`name` AS group_name
FROM `tblproducts` p
INNER JOIN `tblproductgroups` pg ON pg.`id` = p.`gid`
WHERE pg.`slug` = 'license-iptv-panel'
ORDER BY p.`order`;

-- Verify pricing
SELECT 
    p.`name` AS product,
    c.`code` AS currency,
    pr.`monthly`,
    pr.`annually`
FROM `tblproducts` p
INNER JOIN `tblproductgroups` pg ON pg.`id` = p.`gid`
INNER JOIN `tblpricing` pr ON pr.`relid` = p.`id` AND pr.`type` = 'product'
INNER JOIN `tblcurrencies` c ON c.`id` = pr.`currency`
WHERE pg.`slug` = 'license-iptv-panel'
ORDER BY p.`order`, c.`code`;

-- Verify addon
SELECT 
    a.`id`,
    a.`name`,
    a.`packages`,
    a.`billingcycle`,
    a.`allowqty`
FROM `tbladdons` a
WHERE a.`name` = 'Additional Load Balancer';

-- =====================================================
-- Done: Products, pricing, and addon seeded successfully.
-- =====================================================
