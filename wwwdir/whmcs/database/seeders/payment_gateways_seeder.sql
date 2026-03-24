-- =====================================================
-- Payment Gateways Seeder - Production-Grade
-- =====================================================
-- 
-- Purpose:
--   Seeds the tblpaymentgateways table with common payment gateway
--   configurations for a client management system (WHMCS/Blesta compatible).
--
-- Dependencies:
--   - Requires tblpaymentgateways table to exist
--   - No dependencies on other seeders
--
-- Usage:
--   mysql -u root -p database_name < payment_gateways_seeder.sql
--   Or via PowerShell:
--   Get-Content "payment_gateways_seeder.sql" -Raw | & mysql.exe -h localhost -u root -p database_name
--
-- Environment Guard:
--   This seeder should ONLY be run in development/staging environments.
--   Set @allow_seed = 1 to enable execution (default: 0 for safety).
--
-- Idempotency:
--   Uses INSERT ... ON DUPLICATE KEY UPDATE to allow multiple runs
--   without creating duplicates. Relies on unique (gateway, setting) constraint.
--
-- Data Structure:
--   Each gateway has multiple settings (name, API keys, instructions, etc.)
--   - gateway: Internal gateway identifier (e.g., 'paypal', 'stripe')
--   - setting: Configuration key (e.g., 'name', 'email', 'apiKey')
--   - value: Configuration value
--   - order: Display order in the admin panel
--
-- =====================================================

-- Environment guard - prevent accidental production runs
-- Change to 1 to allow execution
SET @allow_seed = 1;
SET @environment = 'development'; -- 'development', 'staging', or 'production'

-- Safety check
SET @seed_allowed = IF(@allow_seed = 1 AND @environment IN ('development', 'staging'), 1, 0);

-- Exit gracefully if not allowed
SELECT IF(@seed_allowed = 0, 
    'ERROR: Seeder blocked. Set @allow_seed = 1 and @environment to development/staging to proceed.',
    'Environment check passed. Proceeding with seed...'
) AS status;

-- =====================================================
-- Stored procedure for safe seeding
-- =====================================================

DELIMITER //

DROP PROCEDURE IF EXISTS sp_seed_payment_gateways //

CREATE PROCEDURE sp_seed_payment_gateways()
BEGIN
    -- Error handling variables
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: Payment gateways seeding failed. Transaction rolled back.' AS error_message;
        RESIGNAL;
    END;
    
    -- Check environment guard
    IF @seed_allowed = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Seeder blocked by environment guard. Set @allow_seed = 1 and @environment to development/staging.';
    END IF;
    
    START TRANSACTION;
    
    SELECT 'Starting payment gateways seed operation...' AS status;
    
    -- =====================================================
    -- Bulk insert using ON DUPLICATE KEY UPDATE for idempotency
    -- This allows the seeder to be run multiple times safely
    -- =====================================================
    
    INSERT INTO `tblpaymentgateways` (`gateway`, `setting`, `value`, `order`) VALUES
    -- Bank Transfer Payment Gateway (Order: 1)
    ('banktransfer', 'name', 'Bank Transfer', 1),
    ('banktransfer', 'instructions', 'Bank Name: First National Bank\nPayee Name: Your Company LLC\nSort Code: 12-34-56\nAccount Number: 1234567890\n\nPlease include your invoice number in the transfer reference.', 1),
    ('banktransfer', 'disabled', '0', 1),
    
    -- PayPal Payment Gateway (Order: 2)
    ('paypal', 'name', 'PayPal', 2),
    ('paypal', 'email', 'payments@yourcompany.tld', 2),
    ('paypal', 'forceonetime', '0', 2),
    ('paypal', 'forceoncheckout', '0', 2),
    ('paypal', 'disabled', '0', 2),
    
    -- Stripe Payment Gateway (Order: 3)
    ('stripe', 'name', 'Stripe', 3),
    ('stripe', 'publishable_key', 'pk_test_demo_placeholder', 3),
    ('stripe', 'secret_key', 'sk_test_demo_placeholder', 3),
    ('stripe', 'webhook_endpoint', 'https://billing.yourcompany.tld/modules/gateways/callback/stripe.php', 3),
    ('stripe', 'webhook_secret', 'whsec_demo_placeholder', 3),
    ('stripe', 'disabled', '0', 3),
    
    -- Authorize.net Payment Gateway (Order: 4)
    ('authorize', 'name', 'Authorize.net', 4),
    ('authorize', 'loginid', 'demo_api_login_id', 4),
    ('authorize', 'transkey', 'demo_transaction_key', 4),
    ('authorize', 'testmode', 'on', 4),
    ('authorize', 'disabled', '0', 4),
    
    -- 2Checkout Payment Gateway (Order: 5)
    ('twocheckout', 'name', '2Checkout', 5),
    ('twocheckout', 'accountnumber', '901234567', 5),
    ('twocheckout', 'secretword', 'demo_secret_word', 5),
    ('twocheckout', 'testmode', 'on', 5),
    ('twocheckout', 'disabled', '0', 5),
    
    -- Skrill Payment Gateway (Order: 6)
    ('moneybookers', 'name', 'Skrill', 6),
    ('moneybookers', 'email', 'skrill@yourcompany.tld', 6),
    ('moneybookers', 'disabled', '0', 6),
    
    -- Perfect Money Payment Gateway (Order: 7)
    ('perfectmoney', 'name', 'Perfect Money', 7),
    ('perfectmoney', 'account', 'U1234567', 7),
    ('perfectmoney', 'alternatepassphrase', 'demo_passphrase', 7),
    ('perfectmoney', 'disabled', '0', 7),
    
    -- Payza Payment Gateway (Order: 8)
    ('payza', 'name', 'Payza', 8),
    ('payza', 'merchantid', 'merchant@yourcompany.tld', 8),
    ('payza', 'securitycode', 'demo_security_code', 8),
    ('payza', 'disabled', '0', 8),
    
    -- Coinbase Commerce Payment Gateway (Order: 9)
    ('coinbase', 'name', 'Coinbase Commerce', 9),
    ('coinbase', 'apiKey', 'demo_api_key_coinbase', 9),
    ('coinbase', 'apiSecret', 'demo_api_secret_coinbase', 9),
    ('coinbase', 'webhookSecret', 'demo_webhook_secret', 9),
    ('coinbase', 'disabled', '0', 9),
    
    -- Razorpay Payment Gateway (Order: 10)
    ('razorpay', 'name', 'Razorpay', 10),
    ('razorpay', 'key_id', 'rzp_test_demo_key', 10),
    ('razorpay', 'key_secret', 'demo_key_secret', 10),
    ('razorpay', 'webhook_secret', 'demo_razorpay_webhook', 10),
    ('razorpay', 'disabled', '0', 10),
    
    -- Cash on Delivery Payment Gateway (Order: 11)
    ('cashondelivery', 'name', 'Cash on Delivery', 11),
    ('cashondelivery', 'instructions', 'Please prepare the exact amount for delivery. Our courier will collect payment upon delivery. Have your invoice number ready.', 11),
    ('cashondelivery', 'disabled', '0', 11),
    
    -- Cheque Payment Gateway (Order: 12)
    ('cheque', 'name', 'Cheque', 12),
    ('cheque', 'instructions', 'Please make your cheque payable to: Your Company LLC\n\nSend to:\n123 Business Street, Suite 100\nNew York, NY 10001\nUSA\n\nInclude your invoice number on the back of the cheque.', 12),
    ('cheque', 'disabled', '0', 12),
    
    -- Western Union Payment Gateway (Order: 13)
    ('westernunion', 'name', 'Western Union', 13),
    ('westernunion', 'instructions', 'Please send payment via Western Union to:\n\nName: John Smith\nAddress: 123 Business Street, New York, NY 10001, USA\n\nEmail the MTCN Number to: billing@yourcompany.tld', 13),
    ('westernunion', 'disabled', '0', 13),
    
    -- MoneyGram Payment Gateway (Order: 14)
    ('moneygram', 'name', 'MoneyGram', 14),
    ('moneygram', 'instructions', 'Please send payment via MoneyGram to:\n\nName: John Smith\nAddress: 123 Business Street, New York, NY 10001, USA\n\nEmail the Reference Number to: billing@yourcompany.tld', 14),
    ('moneygram', 'disabled', '0', 14),
    
    -- BitPay Payment Gateway (Order: 15)
    ('bitpay', 'name', 'BitPay', 15),
    ('bitpay', 'apiKey', 'demo_bitpay_api_key', 15),
    ('bitpay', 'apiSecret', 'demo_bitpay_api_secret', 15),
    ('bitpay', 'disabled', '0', 15),
    
    -- Square Payment Gateway (Order: 16)
    ('square', 'name', 'Square', 16),
    ('square', 'accessToken', 'demo_square_access_token', 16),
    ('square', 'locationId', 'LOCATION_DEMO_ID', 16),
    ('square', 'disabled', '0', 16),
    
    -- Mercado Pago Payment Gateway (Order: 17)
    ('mercadopago', 'name', 'Mercado Pago', 17),
    ('mercadopago', 'client_id', 'demo_mercadopago_client_id', 17),
    ('mercadopago', 'client_secret', 'demo_mercadopago_client_secret', 17),
    ('mercadopago', 'disabled', '0', 17),
    
    -- Paystack Payment Gateway (Order: 18)
    ('paystack', 'name', 'Paystack', 18),
    ('paystack', 'public_key', 'pk_test_demo_paystack_public', 18),
    ('paystack', 'secret_key', 'sk_test_demo_paystack_secret', 18),
    ('paystack', 'disabled', '0', 18),
    
    -- Mollie Payment Gateway (Order: 19)
    ('mollie', 'name', 'Mollie', 19),
    ('mollie', 'apiKey', 'test_demo_mollie_api_key', 19),
    ('mollie', 'description', 'Invoice Payment', 19),
    ('mollie', 'disabled', '0', 19),
    
    -- Sofort Payment Gateway (Order: 20)
    ('sofort', 'name', 'Sofort', 20),
    ('sofort', 'configkey', 'demo_sofort_config_key', 20),
    ('sofort', 'disabled', '0', 20),
    
    -- iDEAL Payment Gateway (Order: 21)
    ('ideal', 'name', 'iDEAL', 21),
    ('ideal', 'merchantid', 'demo_ideal_merchant_id', 21),
    ('ideal', 'secretkey', 'demo_ideal_secret_key', 21),
    ('ideal', 'disabled', '0', 21),
    
    -- SEPA Payment Gateway (Order: 22)
    ('sepa', 'name', 'SEPA', 22),
    ('sepa', 'account_holder', 'Your Company LLC', 22),
    ('sepa', 'iban', 'DE89370400440532013000', 22),
    ('sepa', 'bic', 'DEUTDEFF', 22),
    ('sepa', 'instructions', 'Please transfer the amount to the following bank account within 14 days:\n\nAccount Holder: Your Company LLC\nIBAN: DE89370400440532013000\nBIC: DEUTDEFF\nBank: Deutsche Bank\n\nReference: Your invoice number', 22),
    ('sepa', 'disabled', '0', 22),
    
    -- WeChat Pay Payment Gateway (Order: 23)
    ('wechatpay', 'name', 'WeChat Pay', 23),
    ('wechatpay', 'appid', 'wx_demo_appid', 23),
    ('wechatpay', 'mchid', '1234567890', 23),
    ('wechatpay', 'apikey', 'demo_wechat_api_key', 23),
    ('wechatpay', 'disabled', '0', 23),
    
    -- Alipay Payment Gateway (Order: 24)
    ('alipay', 'name', 'Alipay', 24),
    ('alipay', 'partner', '2088123456789012', 24),
    ('alipay', 'key', 'demo_alipay_key', 24),
    ('alipay', 'disabled', '0', 24),
    
    -- Paymentwall Payment Gateway (Order: 25)
    ('paymentwall', 'name', 'Paymentwall', 25),
    ('paymentwall', 'project_key', 'demo_project_key', 25),
    ('paymentwall', 'secret_key', 'demo_secret_key_pw', 25),
    ('paymentwall', 'widget_code', 'p1', 25),
    ('paymentwall', 'disabled', '0', 25)
    ON DUPLICATE KEY UPDATE
        `value` = VALUES(`value`),
        `order` = VALUES(`order`);
    
    COMMIT;
    
    SELECT CONCAT('Successfully seeded/updated ', COUNT(DISTINCT gateway), ' payment gateways') AS result
    FROM tblpaymentgateways;
    
END //

DELIMITER ;

-- =====================================================
-- Execute the seeding procedure
-- =====================================================

CALL sp_seed_payment_gateways();

-- Clean up the procedure (optional - comment out if you want to keep it)
DROP PROCEDURE IF EXISTS sp_seed_payment_gateways;

-- =====================================================
-- Verification query
-- =====================================================
SELECT 
    gateway,
    COUNT(*) as settings_count,
    MAX(`order`) as display_order
FROM tblpaymentgateways
GROUP BY gateway
ORDER BY display_order;

-- =====================================================
-- Done: Payment gateways seeded successfully.
-- =====================================================
