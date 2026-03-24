-- VENOM CODE - Pricing & Addons Setup

-- ============================================
-- PRICING - Weekly Trial (Product ID: 3)
-- Weekly: $50
-- ============================================
INSERT INTO `tblpricing` (
    `type`, `currency`, `relid`,
    `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
    `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
) VALUES (
    'product', 1, 3,
    '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
    '50.00', '0.00', '0.00', '0.00', '0.00', '0.00'
);

-- ============================================
-- PRICING - Monthly Basic (Product ID: 4)
-- Monthly: $100, Quarterly: $285, Annually: $1000
-- ============================================
INSERT INTO `tblpricing` (
    `type`, `currency`, `relid`,
    `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
    `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
) VALUES (
    'product', 1, 4,
    '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
    '100.00', '285.00', '0.00', '1000.00', '0.00', '0.00'
);

-- ============================================
-- PRICING - Monthly Premium (Product ID: 5)
-- Monthly: $300, Quarterly: $850, Annually: $2900
-- ============================================
INSERT INTO `tblpricing` (
    `type`, `currency`, `relid`,
    `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
    `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
) VALUES (
    'product', 1, 5,
    '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
    '300.00', '850.00', '0.00', '2900.00', '0.00', '0.00'
);

-- ============================================
-- ADDON: Extra Load Balancer Server ($10/month)
-- ============================================
INSERT INTO `tbladdons` (
    `packages`, `name`, `description`, `billingcycle`, `allowqty`, `tax`,
    `showorder`, `hidden`, `retired`, `downloads`, `autoactivate`,
    `suspendproduct`, `welcomeemail`, `type`, `module`, `server_group_id`,
    `prorate`, `weight`, `autolinkby`
) VALUES (
    '3,4,5', 'Extra Load Balancer', 'Add additional Load Balancer server capacity. $10 per LB per month.',
    'Monthly', 1, 1, 1, 0, 0, '', '', 0, 0, 'server', '', 0, 0, 10, ''
);

SET @ADDON_LB_ID = LAST_INSERT_ID();

INSERT INTO `tblpricing` (
    `type`, `currency`, `relid`,
    `msetupfee`, `qsetupfee`, `ssetupfee`, `asetupfee`, `bsetupfee`, `tsetupfee`,
    `monthly`, `quarterly`, `semiannually`, `annually`, `biennially`, `triennially`
) VALUES (
    'addon', 1, @ADDON_LB_ID,
    '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
    '10.00', '0.00', '0.00', '0.00', '0.00', '0.00'
);

SELECT 'Pricing and addons setup completed!' as status;
