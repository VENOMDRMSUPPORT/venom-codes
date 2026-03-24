-- VENOM CODE - Email Templates Setup

-- ============================================
-- EMAIL TEMPLATES
-- ============================================

-- License Expiry Reminder
INSERT INTO `tblemailtemplates` (
    `type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`,
    `disabled`, `custom`, `language`, `copyto`, `blind_copy_to`, `plaintext`,
    `created_at`, `updated_at`
) VALUES (
    'product', 'License Expiry Reminder', 
    'VENOM CODE - License Expiring Soon',
    '<p>Dear {$client_first_name},</p>
    <p>This is a reminder that your VENOM CODE license is set to expire on <strong>{$expiry_date}</strong>.</p>
    <p><strong>License Details:</strong></p>
    <ul>
        <li>License Key: {$license_key}</li>
        <li>Product: {$product_name}</li>
    </ul>
    <p>To ensure uninterrupted service, please renew your license before the expiration date.</p>
    <p>You can manage your license from your client area.</p>
    <p>Thank you for choosing VENOM CODE.</p>',
    '', 'VENOM CODE', '', 0, 0, 'english', '', '', 0, NOW(), NOW()
);

-- License Expired Notice
INSERT INTO `tblemailtemplates` (
    `type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`,
    `disabled`, `custom`, `language`, `copyto`, `blind_copy_to`, `plaintext`,
    `created_at`, `updated_at`
) VALUES (
    'product', 'License Expired Notice',
    'VENOM CODE - License Expired',
    '<p>Dear {$client_first_name},</p>
    <p>Your VENOM CODE license has expired as of <strong>{$expiry_date}</strong>.</p>
    <p><strong>License Details:</strong></p>
    <ul>
        <li>License Key: {$license_key}</li>
        <li>Product: {$product_name}</li>
    </ul>
    <p>Your service has been temporarily suspended. To restore service, please renew your license immediately.</p>
    <p>Thank you for your understanding.</p>',
    '', 'VENOM CODE', '', 0, 0, 'english', '', '', 0, NOW(), NOW()
);

-- New License Activated
INSERT INTO `tblemailtemplates` (
    `type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`,
    `disabled`, `custom`, `language`, `copyto`, `blind_copy_to`, `plaintext`,
    `created_at`, `updated_at`
) VALUES (
    'product', 'New License Activated',
    'VENOM CODE - License Activated',
    '<p>Dear {$client_first_name},</p>
    <p>Your VENOM CODE license has been successfully activated!</p>
    <p><strong>License Details:</strong></p>
    <ul>
        <li>License Key: {$license_key}</li>
        <li>Product: {$product_name}</li>
        <li>Next Due Date: {$next_due_date}</li>
    </ul>
    <p>You can access your license management area from your client area.</p>
    <p>Thank you for choosing VENOM CODE!</p>',
    '', 'VENOM CODE', '', 0, 0, 'english', '', '', 0, NOW(), NOW()
);

SELECT 'Email templates created successfully!' as status;
