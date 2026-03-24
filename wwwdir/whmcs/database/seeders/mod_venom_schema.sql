-- =====================================================
-- Venom Codes - WHMCS Module Database Schema
-- Prefix: mod_venom_ (WHMCS module convention)
-- =====================================================
--
-- Purpose:
--   Custom license tracking for IPTV Panel that integrates
--   with WHMCS without modifying core tables.
--
-- Module Type: Hybrid (Server Module + Addon)
--   - Server Module: modules/servers/venom/
--   - Addon Module: modules/addons/venom_license_manager/
--
-- Tables:
--   1. mod_venom_licenses      - License tracking
--   2. mod_venom_servers       - Server assignments
--   3. mod_venom_load_balancers - LB nodes
--   4. mod_venom_alerts        - Alert history
--   5. mod_venom_activations   - Activation keys
--
-- =====================================================

SET @allow_seed = 1;
SET @environment = 'development';
SET @seed_allowed = IF(@allow_seed = 1 AND @environment IN ('development', 'staging'), 1, 0);

-- =====================================================
-- Drop existing tables
-- =====================================================
DROP TABLE IF EXISTS mod_venom_activations;
DROP TABLE IF EXISTS mod_venom_alerts;
DROP TABLE IF EXISTS mod_venom_load_balancers;
DROP TABLE IF EXISTS mod_venom_servers;
DROP TABLE IF EXISTS mod_venom_licenses;

-- =====================================================
-- Table: mod_venom_licenses
-- Links WHMCS hosting_id to license management
-- =====================================================
CREATE TABLE mod_venom_licenses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hosting_id INT UNSIGNED NOT NULL,
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

    UNIQUE INDEX idx_hosting_id (hosting_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at),
    INDEX idx_license_key (license_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: mod_venom_servers
-- Server assignments per license (via hosting_id link)
-- =====================================================
CREATE TABLE mod_venom_servers (
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

    CONSTRAINT fk_venom_servers_license FOREIGN KEY (license_id)
        REFERENCES mod_venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: mod_venom_load_balancers
-- Load balancer nodes
-- =====================================================
CREATE TABLE mod_venom_load_balancers (
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
    INDEX idx_status (status),

    CONSTRAINT fk_venom_lb_license FOREIGN KEY (license_id)
        REFERENCES mod_venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: mod_venom_alerts
-- Alert history (7-day expiry warnings, etc.)
-- =====================================================
CREATE TABLE mod_venom_alerts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_id INT UNSIGNED NOT NULL,
    alert_type ENUM('expiry_7_days', 'expiry_3_days', 'expiry_1_day', 'expired', 'suspension', 'reactivation') NOT NULL,
    alert_message TEXT NOT NULL,
    sent_via ENUM('email', 'system') DEFAULT 'email',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at DATETIME NULL,

    INDEX idx_license_id (license_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_sent_at (sent_at),

    CONSTRAINT fk_venom_alerts_license FOREIGN KEY (license_id)
        REFERENCES mod_venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: mod_venom_activations
-- License activation keys for API validation
-- =====================================================
CREATE TABLE mod_venom_activations (
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

    INDEX idx_license_id (license_id),
    INDEX idx_activation_key (activation_key),
    INDEX idx_domain (domain),
    INDEX idx_is_revoked (is_revoked),

    CONSTRAINT fk_venom_activations_license FOREIGN KEY (license_id)
        REFERENCES mod_venom_licenses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Verification
-- =====================================================
SHOW TABLES LIKE 'mod_venom_%';
SELECT 'Module schema created successfully!' AS status;
