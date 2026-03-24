-- =====================================================
-- Venom Theme Validation Seeder
-- =====================================================
-- Purpose: Adds services and invoices in various states
-- to validate Venom theme UI (badges, tables, empty states).
--
-- Creates for client ID 1 (client.one@venom-codes.test):
--   - 1 Active service
--   - 1 Pending service
--   - 1 Suspended service
--   - 1 Cancelled service
--   - 1 Paid invoice
--   - 1 Unpaid invoice
--   - 1 Overdue invoice
--
-- Run: mysql -h 127.0.0.1 -P 7999 -u admin -p whmcs < theme_validation_seeder.sql
-- =====================================================

SET @client_id = 1;
SET @product_id = (SELECT id FROM tblproducts LIMIT 1);
SET @today = CURDATE();
SET @yesterday = DATE_SUB(@today, INTERVAL 1 DAY);
SET @next_month = DATE_ADD(@today, INTERVAL 1 MONTH);
SET @overdue_date = DATE_SUB(@today, INTERVAL 14 DAY);

-- Skip if no products
SELECT IF(@product_id IS NULL, 'ERROR: No products found. Run products seeder first.', 'Proceeding...') AS status;

-- =====================================================
-- Services (tblhosting) - various statuses
-- =====================================================

INSERT INTO tblhosting (
    userid, orderid, packageid, server, regdate, domain, domainstatus,
    paymentmethod, qty, firstpaymentamount, amount, billingcycle,
    nextduedate, nextinvoicedate, termination_date, completed_date,
    username, password, notes, subscriptionid, promoid, promocount,
    suspendreason, overideautosuspend, overidesuspenduntil,
    dedicatedip, assignedips, ns1, ns2, diskusage, disklimit, bwusage, bwlimit,
    lastupdate, created_at, updated_at
) VALUES
-- Active
(@client_id, 0, @product_id, 0, @today, 'theme-val-active-001.example.com', 'Active',
 '', 1, 100.00, 100.00, 'Monthly', @next_month, @next_month, '0000-00-00', '0000-00-00',
 '', '', 'Theme validation: Active service', '', 0, 0,
 '', 0, '0000-00-00', '', '', '', '', 0, 0, 0, 0,
 NOW(), NOW(), NOW()),
-- Pending
(@client_id, 0, @product_id, 0, @today, 'theme-val-pending-002.example.com', 'Pending',
 '', 1, 100.00, 100.00, 'Monthly', @next_month, @next_month, '0000-00-00', '0000-00-00',
 '', '', 'Theme validation: Pending service', '', 0, 0,
 '', 0, '0000-00-00', '', '', '', '', 0, 0, 0, 0,
 NOW(), NOW(), NOW()),
-- Suspended
(@client_id, 0, @product_id, 0, @today, 'theme-val-suspended-003.example.com', 'Suspended',
 '', 1, 100.00, 100.00, 'Monthly', @yesterday, @yesterday, '0000-00-00', '0000-00-00',
 '', '', 'Theme validation: Suspended service', '', 0, 0,
 'Non-payment', 0, '0000-00-00', '', '', '', '', 0, 0, 0, 0,
 NOW(), NOW(), NOW()),
-- Cancelled
(@client_id, 0, @product_id, 0, @today, 'theme-val-cancelled-004.example.com', 'Cancelled',
 '', 1, 100.00, 100.00, 'Monthly', @yesterday, @yesterday, @today, @today,
 '', '', 'Theme validation: Cancelled service', '', 0, 0,
 '', 0, '0000-00-00', '', '', '', '', 0, 0, 0, 0,
 NOW(), NOW(), NOW());

-- =====================================================
-- Invoices (tblinvoices + tblinvoiceitems)
-- =====================================================

-- Paid invoice
INSERT INTO tblinvoices (userid, invoicenum, date, duedate, datepaid, last_capture_attempt, date_refunded, date_cancelled,
    subtotal, credit, tax, tax2, total, taxrate, taxrate2, status, paymentmethod, paymethodid, notes, created_at, updated_at)
VALUES (@client_id, CONCAT('INV-', UNIX_TIMESTAMP(), '-1'), @yesterday, @today, NOW(), '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00',
    100.00, 0.00, 0.00, 0.00, 100.00, 0.000, 0.000, 'Paid', 'banktransfer', NULL, 'Theme validation: Paid', NOW(), NOW());
SET @paid_inv = LAST_INSERT_ID();
INSERT INTO tblinvoiceitems (invoiceid, userid, type, relid, description, amount, taxed, duedate, paymentmethod, notes)
VALUES (@paid_inv, @client_id, 'Hosting', 0, 'Theme validation - Paid invoice item', 100.00, 0, @today, 'banktransfer', '');

-- Unpaid invoice
INSERT INTO tblinvoices (userid, invoicenum, date, duedate, datepaid, last_capture_attempt, date_refunded, date_cancelled,
    subtotal, credit, tax, tax2, total, taxrate, taxrate2, status, paymentmethod, paymethodid, notes, created_at, updated_at)
VALUES (@client_id, CONCAT('INV-', UNIX_TIMESTAMP(), '-2'), @today, @next_month, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00',
    100.00, 0.00, 0.00, 0.00, 100.00, 0.000, 0.000, 'Unpaid', 'banktransfer', NULL, 'Theme validation: Unpaid', NOW(), NOW());
SET @unpaid_inv = LAST_INSERT_ID();
INSERT INTO tblinvoiceitems (invoiceid, userid, type, relid, description, amount, taxed, duedate, paymentmethod, notes)
VALUES (@unpaid_inv, @client_id, 'Hosting', 0, 'Theme validation - Unpaid invoice item', 100.00, 0, @next_month, 'banktransfer', '');

-- Overdue invoice
INSERT INTO tblinvoices (userid, invoicenum, date, duedate, datepaid, last_capture_attempt, date_refunded, date_cancelled,
    subtotal, credit, tax, tax2, total, taxrate, taxrate2, status, paymentmethod, paymethodid, notes, created_at, updated_at)
VALUES (@client_id, CONCAT('INV-', UNIX_TIMESTAMP(), '-3'), @overdue_date, @overdue_date, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00',
    100.00, 0.00, 0.00, 0.00, 100.00, 0.000, 0.000, 'Unpaid', 'banktransfer', NULL, 'Theme validation: Overdue', NOW(), NOW());
SET @overdue_inv = LAST_INSERT_ID();
INSERT INTO tblinvoiceitems (invoiceid, userid, type, relid, description, amount, taxed, duedate, paymentmethod, notes)
VALUES (@overdue_inv, @client_id, 'Hosting', 0, 'Theme validation - Overdue invoice item', 100.00, 0, @overdue_date, 'banktransfer', '');

SELECT 'Theme validation seeder complete. Login as client.one@venom-codes.test to verify.' AS status;
