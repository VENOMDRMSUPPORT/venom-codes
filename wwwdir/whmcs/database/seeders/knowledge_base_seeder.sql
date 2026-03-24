-- =====================================================
-- Venom Codes — Knowledge Base
-- Server Licensing & Infrastructure Solutions
-- 4 sections with 13 articles (English)
-- =====================================================
-- Run via PowerShell:
-- Get-Content "F:\xampp\htdocs\venom-codes.test\client\database\seeders\knowledge_base_seeder.sql" -Raw | & "F:\xampp\mysql\bin\mysql.exe" -h localhost -P 3306 -u admin -p"habiba77Hm@" venom-codes
-- =====================================================

-- -----------------------------------------------------
-- RESET: Clear existing KB data before seeding
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `tblknowledgebaselinks`;
TRUNCATE TABLE `tblknowledgebase`;
TRUNCATE TABLE `tblknowledgebasecats`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- SECTION 1: Getting Started
-- -----------------------------------------------------
INSERT INTO `tblknowledgebasecats` (`parentid`, `name`, `description`, `hidden`, `catid`, `language`)
VALUES (0, 'Getting Started', 'Access your account and take your first steps with Venom Codes', '', 0, '');

SET @cat1_id = LAST_INSERT_ID();

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Access Your Client Area',
  '<p>To access your Venom Codes client area:</p><ol><li>Go to our website and click <strong>Client Login</strong> or <strong>Client Area</strong></li><li>Enter your email address and password</li><li>Click <strong>Login</strong></li></ol><p>If you forgot your password, click "Forgot Password?" and we will send you a reset link to your email.</p><p>From the client area you can view your licenses, manage billing, renewals, and submit support tickets.</p>',
  0, 0, 0, '', 1, 0, ''
);
SET @art1_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat1_id, @art1_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Change Your Password',
  '<p>To change your client area password:</p><ol><li>Log in to your client area</li><li>Click on your name in the top right corner</li><li>Select <strong>Account Details</strong> or <strong>Profile</strong></li><li>Enter your current password</li><li>Enter your new password twice to confirm</li><li>Click <strong>Save Changes</strong></li></ol><p>Choose a strong password with a mix of letters, numbers, and symbols.</p>',
  0, 0, 0, '', 2, 0, ''
);
SET @art2_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat1_id, @art2_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'Understanding Your Dashboard',
  '<p>Your client area dashboard shows an overview of your account:</p><ul><li><strong>Active Licenses</strong> – Your server licenses and their status</li><li><strong>Unpaid Invoices</strong> – Any outstanding payments</li><li><strong>Open Support Tickets</strong> – Your active support requests</li><li><strong>Recent Announcements</strong> – Important updates from us</li></ul><p>Use the sidebar menu to navigate to specific sections. You can view license details, activation status, and renewal dates from your dashboard.</p>',
  0, 0, 0, '', 3, 0, ''
);
SET @art3_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat1_id, @art3_id);

-- -----------------------------------------------------
-- SECTION 2: Licenses & Activation
-- -----------------------------------------------------
INSERT INTO `tblknowledgebasecats` (`parentid`, `name`, `description`, `hidden`, `catid`, `language`)
VALUES (0, 'Licenses & Activation', 'License activation, installation, and hardware binding', '', 0, '');

SET @cat2_id = LAST_INSERT_ID();

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Activate Your License',
  '<p>License activation is instant — typically within 30 seconds of purchase. No manual review or approval is required.</p><ol><li>Log in to your client area</li><li>Go to <strong>Services</strong> → <strong>My Services</strong></li><li>Find your license and click on it</li><li>Copy your license key or use the activation link provided</li><li>Follow the installation instructions for your environment</li></ol><p>Your license key is hardware-bound and tied to your server. If you need to move to a new server, contact support for license transfer.</p>',
  0, 0, 0, '', 1, 0, ''
);
SET @art4_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat2_id, @art4_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'Understanding Hardware-Bound Licensing',
  '<p>Our licenses use hardware-bound keys to prevent unauthorized sharing and ensure secure deployment.</p><p><strong>What this means:</strong></p><ul><li>Each license is tied to the specific server or machine where it is activated</li><li>Tamper-proof and audit-ready for enterprise environments</li><li>Encrypted validation prevents unauthorized use</li></ul><p>If you need to move your license to a different server (e.g. hardware upgrade, migration), please open a support ticket. We will assist you with the license transfer with zero downtime.</p>',
  0, 0, 0, '', 2, 0, ''
);
SET @art5_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat2_id, @art5_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Upgrade Your Plan',
  '<p>You can upgrade from Trial to Pro or Ultra at any time. Your existing deployment stays online during the transition with zero downtime.</p><ol><li>Log in to your client area</li><li>Go to <strong>Services</strong> → <strong>My Services</strong></li><li>Select your license and click <strong>Upgrade</strong></li><li>Choose the new plan (Pro or Ultra)</li><li>Complete the payment process</li></ol><p>Once upgraded, your license will automatically reflect the new features (e.g. load balancer support, multi-server). No reinstallation required.</p>',
  0, 0, 0, '', 3, 0, ''
);
SET @art6_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat2_id, @art6_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'Load Balancer Setup (Pro & Ultra)',
  '<p>Pro includes 1 load balancer. Additional ones cost $15/mo each. Ultra includes unlimited load balancers at no extra cost. All provisioned instantly.</p><ol><li>Log in to your client area</li><li>Go to your license details</li><li>Click <strong>Add Load Balancer</strong> (Pro) or manage multiple (Ultra)</li><li>Complete provisioning — typically under 30 seconds</li></ol><p>Built-in load balancer management lets you add capacity on demand with instant provisioning.</p>',
  0, 0, 0, '', 4, 0, ''
);
SET @art7_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat2_id, @art7_id);

-- -----------------------------------------------------
-- SECTION 3: Billing & Renewals
-- -----------------------------------------------------
INSERT INTO `tblknowledgebasecats` (`parentid`, `name`, `description`, `hidden`, `catid`, `language`)
VALUES (0, 'Billing & Renewals', 'Invoices, payment methods, and license renewal', '', 0, '');

SET @cat3_id = LAST_INSERT_ID();

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Pay an Invoice',
  '<p>To pay an outstanding invoice:</p><ol><li>Go to <strong>Billing</strong> → <strong>Invoices</strong></li><li>Find the invoice you want to pay</li><li>Click <strong>View Invoice</strong></li><li>Click <strong>Pay Now</strong></li><li>Select your payment method</li><li>Complete the payment process</li></ol><p>Once paid, you will receive a confirmation email. You can download a PDF receipt from the invoice page.</p>',
  0, 0, 0, '', 1, 0, ''
);
SET @art8_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat3_id, @art8_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Update Your Payment Method',
  '<p>To add or update your saved payment method:</p><ol><li>Go to <strong>Billing</strong> → <strong>Payment Methods</strong></li><li>Click <strong>Add New Payment Method</strong> (or edit existing)</li><li>Enter your card details</li><li>Click <strong>Save</strong></li></ol><p>Saved payment methods are used for automatic license renewal. Seamless renewal with zero service interruption — set it and forget it.</p>',
  0, 0, 0, '', 2, 0, ''
);
SET @art9_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat3_id, @art9_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'What Happens When My License Expires?',
  '<p>You will receive reminders before expiration. If not renewed, your license will gracefully deactivate. Your data and configurations are preserved for 30 days.</p><p><strong>Renewal timeline:</strong></p><ul><li>Invoices are generated before the renewal date</li><li>Email reminders at 14, 7, and 1 day before due</li><li>If you have a saved payment method, we will attempt automatic payment</li><li>Services may deactivate if payment is not received by the due date</li></ul><p>To avoid interruption, ensure your payment method is up to date.</p>',
  0, 0, 0, '', 3, 0, ''
);
SET @art10_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat3_id, @art10_id);

-- -----------------------------------------------------
-- SECTION 4: Support & Contact
-- -----------------------------------------------------
INSERT INTO `tblknowledgebasecats` (`parentid`, `name`, `description`, `hidden`, `catid`, `language`)
VALUES (0, 'Support & Contact', 'How to get help and contact our support team', '', 0, '');

SET @cat4_id = LAST_INSERT_ID();

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Open a Support Ticket',
  '<p>To get help from our support team:</p><ol><li>Log in to your client area</li><li>Go to <strong>Support</strong> → <strong>Open Ticket</strong></li><li>Select the appropriate department</li><li>Select the related service (if applicable)</li><li>Enter a clear subject and describe your issue</li><li>Attach any relevant files or screenshots</li><li>Click <strong>Submit</strong></li></ol><p>You will receive an email when we reply. Technical support is available around the clock.</p>',
  0, 0, 0, '', 1, 0, ''
);
SET @art11_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat4_id, @art11_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'Support Response Times',
  '<p>We aim to respond to all support tickets as quickly as possible:</p><ul><li><strong>General Support</strong> – Within 24 hours</li><li><strong>Billing</strong> – Within 24 hours</li><li><strong>Technical</strong> – Within 12 hours</li></ul><p>Response times may vary during peak periods. For urgent issues, please mention "Urgent" in your ticket subject. Technical support is available around the clock.</p>',
  0, 0, 0, '', 2, 0, ''
);
SET @art12_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat4_id, @art12_id);

INSERT INTO `tblknowledgebase` (`title`, `article`, `views`, `useful`, `votes`, `private`, `order`, `parentid`, `language`)
VALUES (
  'How to Search the Knowledge Base',
  '<p>Before opening a ticket, try searching our Knowledge Base for instant answers:</p><ol><li>Go to <strong>Support</strong> → <strong>Knowledge Base</strong></li><li>Use the search box to find articles by keyword</li><li>Browse categories by topic</li><li>Click any article to read the full guide</li></ol><p>Our Knowledge Base covers common questions about licenses, activation, billing, and renewals.</p>',
  0, 0, 0, '', 3, 0, ''
);
SET @art13_id = LAST_INSERT_ID();
INSERT INTO `tblknowledgebaselinks` (`categoryid`, `articleid`) VALUES (@cat4_id, @art13_id);

-- =====================================================
-- Done! 4 sections with 13 articles for Venom Codes.
-- =====================================================
