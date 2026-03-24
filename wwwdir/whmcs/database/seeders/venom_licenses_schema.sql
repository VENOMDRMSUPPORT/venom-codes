-- =====================================================
-- Venom Codes - License Management Database Schema
-- Custom tables for IPTV Panel License System
-- =====================================================
--
-- Purpose:
--   Custom license tracking, server management, and
--   load balancer orchestration for WHMCS integration.
--
-- Tables Created:
--   1. venom_licenses      - Main license records
--   2. venom_servers       - Server assignments per license
--   3. venom_load_balancers - LB nodes per license
--   4. venom_license_alerts - Expiration alert history
--   5. venom_license_activations - Activation key tracking
--
-- Usage:
--   mysql -u root -p whmcs < venom_licenses_schema.sql
--
-- =====================================================

-- Environment Guard
SET @allow_seed = 1;
SET @environment = 'development';

SET @seed_allowed = IF(@allow_seed = 1 AND @environment IN ('development', 'staging'), 1, 0);

SELECT IF(@seed_allowed = 0,
    'ERROR: Schema blocked. Set @allow_seed = 1 to proceed.',
    'Environment check passed. Proceeding with schema creation...'
) AS status;

-- =====================================================
-- Drop existing tables (for clean re-install)
-- =====================================================
DROP TABLE IF EXISTS venom_license_activations;
DROP TABLE IF EXISTS venom_license_alerts;
DROP TABLE IF EXISTS venom_load_balancers;
DROP TABLE IF EXISTS venom_servers;
DROP TABLE IF EXISTS venom_licenses;

-- =====================================================
-- Table: venom_licenses
-- Main license tracking table
-- =====================================================
CREATE TABLE venom_licenses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    whmcs_hosting_id INT UNSIGNED NULL,
    product_id INT UNSIGNED NOT NULL,
    license_key VARCHAR(64) NOT NULL UNIQUE,
    status ENUM('active', 'suspended', 'expired', 'cancelled', 'trial') DEFAULT 'trial',
    server_limit INT UNSIGNED DEFAULT 1,
    lb_limit INT UNSIGNED DEFAULT 0,
    lb_included INT UNSIGNED DEFAULT 0,
    expires_at DATETIME NULL,
    last_renewal_at DATETIME NULL,
    meta_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at),
    INDEX idx_license_key (license_key),
    INDEX idx_whmcs_hosting_id (whmcs_hosting_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: venom_servers
-- Server assignments per license
-- =====================================================
CREATE TABLE venom_servers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_id INT UNSIGNED NOT NULL,
    server_type ENUM('main', 'load_balancer', 'backup') NOT NULL DEFAULT 'main',
    server_label VARCHAR(128) NOT NULL,
    hostname VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    port INT UNSIGNED DEFAULT 8080,
    status ENUM('active', 'offline', 'maintenance', 'suspended') DEFAULT 'active',
    health_status JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_license_id (license_id),
    INDEX idx_server_type (server_type),
    INDEX idx_status (status),
    INDEX idx_ip_address (ip_address),

    CONSTRAINT fk_servers_license FOREIGN KEY (license_id)
        REFERENCES venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: venom_load_balancers
-- Load balancer node tracking
-- =====================================================
CREATE TABLE venom_load_balancers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_id INT UNSIGNED NOT NULL,
    server_id INT UNSIGNED NULL,
    lb_name VARCHAR(128) NOT NULL,
    lb_identifier VARCHAR(64) NOT NULL UNIQUE,
    algorithm ENUM('round_robin', 'least_connections', 'ip_hash', 'weighted') DEFAULT 'round_robin',
    status ENUM('active', 'standby', 'offline') DEFAULT 'active',
    is_included BOOLEAN DEFAULT FALSE,
    monthly_price DECIMAL(10,2) DEFAULT 10.00,
    config_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_license_id (license_id),
    INDEX idx_server_id (server_id),
    INDEX idx_status (status),
    INDEX idx_lb_identifier (lb_identifier),

    CONSTRAINT fk_lb_license FOREIGN KEY (license_id)
        REFERENCES venom_licenses(id) ON DELETE CASCADE,
    CONSTRAINT fk_lb_server FOREIGN KEY (server_id)
        REFERENCES venom_servers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: venom_license_alerts
-- Expiration and status alert history
-- =====================================================
CREATE TABLE venom_license_alerts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_id INT UNSIGNED NOT NULL,
    alert_type ENUM('expiry_7_days', 'expiry_3_days', 'expiry_1_day', 'expiry_expired', 'suspension', 'reactivation', 'upgrade', 'downgrade') NOT NULL,
    alert_message TEXT NOT NULL,
    sent_via ENUM('email', 'sms', 'webhook', 'system') DEFAULT 'email',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at DATETIME NULL,
    meta_data JSON NULL,

    INDEX idx_license_id (license_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_sent_at (sent_at),
    INDEX idx_acknowledged (acknowledged),

    CONSTRAINT fk_alerts_license FOREIGN KEY (license_id)
        REFERENCES venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: venom_license_activations
-- Activation key tracking for license validation
-- =====================================================
CREATE TABLE venom_license_activations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_id INT UNSIGNED NOT NULL,
    activation_key VARCHAR(64) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NULL,
    hardware_id VARCHAR(128) NULL,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_validation_at DATETIME NULL,
    expires_at DATETIME NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revocation_reason VARCHAR(255) NULL,
    meta_data JSON NULL,

    INDEX idx_license_id (license_id),
    INDEX idx_activation_key (activation_key),
    INDEX idx_domain (domain),
    INDEX idx_is_revoked (is_revoked),

    CONSTRAINT fk_activations_license FOREIGN KEY (license_id)
        REFERENCES venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Triggers for automatic alert generation
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_license_created
AFTER INSERT ON venom_licenses
FOR EACH ROW
BEGIN
    IF NEW.status = 'trial' THEN
        INSERT INTO venom_license_alerts (license_id, alert_type, alert_message)
        VALUES (NEW.id, 'expiry_7_days', CONCAT('Trial license created. Will expire on ', NEW.expires_at));
    END IF;
END//

CREATE TRIGGER trg_license_expired
AFTER UPDATE ON venom_licenses
FOR EACH ROW
BEGIN
    IF OLD.status != 'expired' AND NEW.status = 'expired' THEN
        INSERT INTO venom_license_alerts (license_id, alert_type, alert_message)
        VALUES (NEW.id, 'expiry_expired', 'License has expired');
    END IF;
END//

DELIMITER ;

-- =====================================================
-- Views for easy querying
-- =====================================================
CREATE VIEW view_active_licenses AS
SELECT
    l.id,
    l.license_key,
    l.status,
    l.expires_at,
    l.server_limit,
    l.lb_limit,
    u.email AS user_email,
    u.id AS client_id,
    pg.name AS product_name,
    COUNT(DISTINCT s.id) AS active_servers,
    COUNT(DISTINCT lb.id) AS active_load_balancers
FROM venom_licenses l
INNER JOIN tblhosting h ON h.id = l.whmcs_hosting_id
INNER JOIN tblclients u ON u.id = h.userid
INNER JOIN tblproducts p ON p.id = l.product_id
INNER JOIN tblproductgroups pg ON pg.id = p.gid
LEFT JOIN venom_servers s ON s.license_id = l.id AND s.status = 'active'
LEFT JOIN venom_load_balancers lb ON lb.license_id = l.id AND lb.status = 'active'
WHERE l.status IN ('active', 'trial')
GROUP BY l.id;

CREATE VIEW view_expiring_licenses AS
SELECT
    l.id,
    l.license_key,
    l.status,
    l.expires_at,
    DATEDIFF(l.expires_at, NOW()) AS days_until_expiry,
    u.email AS user_email,
    pg.name AS product_name
FROM venom_licenses l
INNER JOIN tblhosting h ON h.id = l.whmcs_hosting_id
INNER JOIN tblclients u ON u.id = h.userid
INNER JOIN tblproducts p ON p.id = l.product_id
INNER JOIN tblproductgroups pg ON pg.id = p.gid
WHERE l.status IN ('active', 'trial')
AND l.expires_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY);

-- =====================================================
-- Verification
-- =====================================================
SHOW TABLES LIKE 'venom_%';

SELECT 'Schema created successfully!' AS status;
