-- VENOM CODE - Custom Fields for License Management

-- ============================================
-- CUSTOM FIELDS
-- ============================================

-- Weekly Trial (Product ID: 3) Custom Fields
INSERT INTO `tblcustomfields` (`type`, `relid`, `fieldname`, `fieldtype`, `fieldoptions`, `regexpr`, `adminonly`, `required`, `showorder`, `showinvoice`, `sortorder`, `description`) VALUES
('product', 3, 'License Key', 'text', '', '', 'on', '', '', '', 1, 'Auto-generated unique license key'),
('product', 3, 'Server Limit', 'dropdown', '1', '', 'on', 'on', '', '', 2, 'Maximum servers allowed on this license'),
('product', 3, 'Load Balancer Limit', 'dropdown', '0', '', 'on', 'on', '', '', 3, 'Maximum Load Balancers allowed'),
('product', 3, 'Addons Enabled', 'yesno', '', '', 'on', 'on', '', '', 4, 'Whether addons can be activated');

-- Monthly Basic (Product ID: 4) Custom Fields
INSERT INTO `tblcustomfields` (`type`, `relid`, `fieldname`, `fieldtype`, `fieldoptions`, `regexpr`, `adminonly`, `required`, `showorder`, `showinvoice`, `sortorder`, `description`) VALUES
('product', 4, 'License Key', 'text', '', '', 'on', '', '', '', 1, 'Auto-generated unique license key'),
('product', 4, 'Main Server Limit', 'dropdown', '1', '', 'on', 'on', '', '', 2, 'Maximum main servers allowed'),
('product', 4, 'Load Balancer Limit', 'dropdown', '1,2,3,4,5,6,7,8,9,10', '', 'on', 'on', '', '', 3, 'Maximum Load Balancers allowed'),
('product', 4, 'Extra LB Price', 'text', '10.00', '', 'on', 'on', '', '', 4, 'Price charged per extra Load Balancer');

-- Monthly Premium (Product ID: 5) Custom Fields
INSERT INTO `tblcustomfields` (`type`, `relid`, `fieldname`, `fieldtype`, `fieldoptions`, `regexpr`, `adminonly`, `required`, `showorder`, `showinvoice`, `sortorder`, `description`) VALUES
('product', 5, 'License Key', 'text', '', '', 'on', '', '', '', 1, 'Auto-generated unique license key'),
('product', 5, 'Main Server Limit', 'dropdown', '1', '', 'on', 'on', '', '', 2, 'Maximum main servers allowed'),
('product', 5, 'Load Balancer Limit', 'text', 'Unlimited', '', 'on', 'on', '', '', 3, 'Load Balancers allowed'),
('product', 5, 'All Addons Enabled', 'yesno', '', '', 'on', 'on', '', '', 4, 'All addons enabled by default');

SELECT 'Custom fields created successfully!' as status;
