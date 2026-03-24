-- VENOM CODE - WHMCS Products & Services Setup
-- Complete SQL script with all required fields

-- ============================================
-- PRODUCT GROUPS
-- ============================================
INSERT INTO `tblproductgroups` (`name`, `slug`, `headline`, `tagline`, `orderfrmtpl`, `disabledgateways`, `hidden`, `order`, `icon`) VALUES
('IPTV Licenses', 'iptv-licenses', 'Premium IPTV License Management', 'Choose the perfect plan for your needs', '', '', 0, 1, ''),
('Server Addons', 'server-addons', 'Enhance Your License', 'Extend your server capabilities', '', '', 0, 2, '');

-- ============================================
-- PRODUCTS - Weekly Trial ($50/week)
-- ============================================
INSERT INTO `tblproducts` (
    `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`,
    `welcomeemail`, `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`,
    `paytype`, `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
    `configoption1`, `configoption2`, `configoption3`, `configoption4`,
    `configoption5`, `configoption6`, `configoption7`, `configoption8`,
    `configoption9`, `configoption10`, `configoption11`, `configoption12`,
    `configoption13`, `configoption14`, `configoption15`, `configoption16`,
    `configoption17`, `configoption18`, `configoption19`, `configoption20`,
    `configoption21`, `configoption22`, `configoption23`, `configoption24`,
    `freedomain`, `freedomainpaymentterms`, `freedomaintlds`,
    `recurringcycles`, `autoterminatedays`, `autoterminateemail`, `configoptionsupgrade`,
    `billingcycleupgrade`, `upgradeemail`, `overagesenabled`, `overagesdisklimit`,
    `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
    `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`,
    `order`, `retired`, `is_featured`, `color`, `tagline`, `short_description`
) VALUES (
    'hosting', 1, 'Weekly Trial', 'weekly-trial',
    'Perfect for testing our platform. Includes 1 server with no Load Balance.',
    0, 0, 0, 0, 0, 0, 0, 0, 'recurring', 0, '', 'on', '', 0,
    '1', '0', '0', '0',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '',
    0, 0, 0, 0,
    '', 0, '', 0, 0, 0, 0,
    1, 0, '', 0,
    1, 0, 0, '', '1 Server Only | No LB', ''
);

-- ============================================
-- PRODUCTS - Monthly Basic ($100/month)
-- ============================================
INSERT INTO `tblproducts` (
    `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`,
    `welcomeemail`, `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`,
    `paytype`, `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
    `configoption1`, `configoption2`, `configoption3`, `configoption4`,
    `configoption5`, `configoption6`, `configoption7`, `configoption8`,
    `configoption9`, `configoption10`, `configoption11`, `configoption12`,
    `configoption13`, `configoption14`, `configoption15`, `configoption16`,
    `configoption17`, `configoption18`, `configoption19`, `configoption20`,
    `configoption21`, `configoption22`, `configoption23`, `configoption24`,
    `freedomain`, `freedomainpaymentterms`, `freedomaintlds`,
    `recurringcycles`, `autoterminatedays`, `autoterminateemail`, `configoptionsupgrade`,
    `billingcycleupgrade`, `upgradeemail`, `overagesenabled`, `overagesdisklimit`,
    `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
    `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`,
    `order`, `retired`, `is_featured`, `color`, `tagline`, `short_description`
) VALUES (
    'hosting', 1, 'Monthly Basic', 'monthly-basic',
    'For small to medium deployments. 1 Main Server + 1 Load Balancer included.',
    0, 0, 0, 0, 0, 0, 0, 0, 'recurring', 0, '', 'on', '', 0,
    '1', '1', '10', '1',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '',
    0, 0, 0, 0,
    '', 0, '', 0, 0, 0, 0,
    1, 0, '', 0,
    2, 0, 1, '', 'Main + 1 LB | Extra LB $10', ''
);

-- ============================================
-- PRODUCTS - Monthly Premium ($300/month)
-- ============================================
INSERT INTO `tblproducts` (
    `type`, `gid`, `name`, `slug`, `description`, `hidden`, `showdomainoptions`,
    `welcomeemail`, `stockcontrol`, `qty`, `proratabilling`, `proratadate`, `proratachargenextmonth`,
    `paytype`, `allowqty`, `subdomain`, `autosetup`, `servertype`, `servergroup`,
    `configoption1`, `configoption2`, `configoption3`, `configoption4`,
    `configoption5`, `configoption6`, `configoption7`, `configoption8`,
    `configoption9`, `configoption10`, `configoption11`, `configoption12`,
    `configoption13`, `configoption14`, `configoption15`, `configoption16`,
    `configoption17`, `configoption18`, `configoption19`, `configoption20`,
    `configoption21`, `configoption22`, `configoption23`, `configoption24`,
    `freedomain`, `freedomainpaymentterms`, `freedomaintlds`,
    `recurringcycles`, `autoterminatedays`, `autoterminateemail`, `configoptionsupgrade`,
    `billingcycleupgrade`, `upgradeemail`, `overagesenabled`, `overagesdisklimit`,
    `overagesbwlimit`, `overagesdiskprice`, `overagesbwprice`,
    `tax`, `affiliateonetime`, `affiliatepaytype`, `affiliatepayamount`,
    `order`, `retired`, `is_featured`, `color`, `tagline`, `short_description`
) VALUES (
    'hosting', 1, 'Monthly Premium', 'monthly-premium',
    'For enterprise deployments. 1 Main Server + Unlimited Load Balancers.',
    0, 0, 0, 0, 0, 0, 0, 0, 'recurring', 0, '', 'on', '', 0,
    '1', '999', '0', '1',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '',
    0, 0, 0, 0,
    '', 0, '', 0, 0, 0, 0,
    1, 0, '', 0,
    3, 0, 0, '', 'Main + Unlimited LB', ''
);

SELECT 'Product groups and products created successfully!' as status;
