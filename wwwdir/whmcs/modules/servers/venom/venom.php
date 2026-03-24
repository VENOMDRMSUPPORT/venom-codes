<?php
/**
 * Venom Server Module
 * WHMCS Server Module for Venom IPTV Panel Licensing
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

function Venom_MetaData()
{
    return [
        'DisplayName' => 'Venom IPTV Panel',
        'APIVersion' => '1.1',
        'RequiresServer' => true,
        'AutoProvision' => true,
    ];
}

function Venom_ConfigOptions($params)
{
    return [
        'license_type' => [
            'Type' => 'dropdown',
            'Options' => [
                'trial' => 'Trial (7 Days)',
                'pro' => 'Pro Monthly',
                'ultra' => 'Ultra Monthly',
            ],
            'Default' => 'pro',
            'Description' => 'Select license tier',
        ],
        'server_limit' => [
            'Type' => 'text',
            'Size' => '10',
            'Default' => '1',
            'Description' => 'Max servers allowed',
        ],
        'lb_included' => [
            'Type' => 'text',
            'Size' => '10',
            'Default' => '0',
            'Description' => 'Load balancers included',
        ],
        'lb_limit' => [
            'Type' => 'text',
            'Size' => '10',
            'Default' => '0',
            'Description' => 'Max additional LBs (0=unlimited)',
        ],
    ];
}

function Venom_CreateAccount($params)
{
    $licenseKey = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 16));

    try {
        $hostingId = (int) $params['serviceid'];
        $serverLimit = !empty($params['configoption2']) ? (int) $params['configoption2'] : 1;
        $lbIncluded = !empty($params['configoption3']) ? (int) $params['configoption3'] : 0;
        $lbLimit = !empty($params['configoption4']) ? (int) $params['configoption4'] : 0;

        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        $status = 'active';
        if ($params['configoption1'] === 'trial') {
            $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
            $status = 'trial';
        }

        $sql = "INSERT INTO mod_venom_licenses 
            (hosting_id, license_key, status, server_limit, lb_included, lb_limit, expires_at) 
            VALUES (%d, '%s', '%s', %d, %d, %d, '%s')";
        
        $result = full_query(sprintf(
            $sql,
            $hostingId,
            db_escape_string($licenseKey),
            db_escape_string($status),
            $serverLimit,
            $lbIncluded,
            $lbLimit,
            db_escape_string($expiresAt)
        ));

        $licenseId = mysql_insert_id();

        $serverSql = "INSERT INTO mod_venom_servers 
            (license_id, server_type, server_label, hostname, ip_address, status) 
            VALUES (%d, 'main', '%s', '%s', '%s', 'active')";
        
        full_query(sprintf(
            $serverSql,
            $licenseId,
            db_escape_string('Main Server'),
            db_escape_string($params['serverhostname']),
            db_escape_string($params['serverip'])
        ));

        full_query("UPDATE tblhosting SET domain = '" . db_escape_string($licenseKey) . "' WHERE id = " . $hostingId);

        return 'success';

    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_SuspendAccount($params)
{
    try {
        $hostingId = (int) $params['serviceid'];
        
        full_query("UPDATE mod_venom_licenses SET status = 'suspended' 
            WHERE hosting_id = " . $hostingId);
        
        full_query("UPDATE mod_venom_servers SET status = 'suspended' 
            WHERE license_id = (SELECT id FROM mod_venom_licenses WHERE hosting_id = " . $hostingId . ")");

        return 'success';
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_UnsuspendAccount($params)
{
    try {
        $hostingId = (int) $params['serviceid'];
        
        full_query("UPDATE mod_venom_licenses SET status = 'active' 
            WHERE hosting_id = " . $hostingId);
        
        full_query("UPDATE mod_venom_servers SET status = 'active' 
            WHERE license_id = (SELECT id FROM mod_venom_licenses WHERE hosting_id = " . $hostingId . ")");

        return 'success';
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_TerminateAccount($params)
{
    try {
        $hostingId = (int) $params['serviceid'];
        
        full_query("UPDATE mod_venom_licenses SET status = 'cancelled' 
            WHERE hosting_id = " . $hostingId);
        
        full_query("DELETE FROM mod_venom_servers 
            WHERE license_id = (SELECT id FROM mod_venom_licenses WHERE hosting_id = " . $hostingId . ")");

        return 'success';
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_Renew($params)
{
    try {
        $hostingId = (int) $params['serviceid'];
        $newExpiry = date('Y-m-d H:i:s', strtotime('+30 days'));

        full_query("UPDATE mod_venom_licenses 
            SET status = 'active', expires_at = '" . db_escape_string($newExpiry) . "', last_renewal_at = NOW() 
            WHERE hosting_id = " . $hostingId);

        return 'success';
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_ChangePackage($params)
{
    try {
        $hostingId = (int) $params['serviceid'];
        $serverLimit = !empty($params['configoption2']) ? (int) $params['configoption2'] : 1;
        $lbIncluded = !empty($params['configoption3']) ? (int) $params['configoption3'] : 0;
        $lbLimit = !empty($params['configoption4']) ? (int) $params['configoption4'] : 0;

        full_query("UPDATE mod_venom_licenses 
            SET server_limit = " . $serverLimit . ", lb_included = " . $lbIncluded . ", lb_limit = " . $lbLimit . " 
            WHERE hosting_id = " . $hostingId);

        return 'success';
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function Venom_AdminCustomButtonArray()
{
    return [
        'Regenerate Key' => 'regenerate_key',
        'Sync Status' => 'sync_status',
    ];
}

function Venom_regenerate_key($params)
{
    $newKey = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 16));
    $hostingId = (int) $params['serviceid'];

    full_query("UPDATE mod_venom_licenses SET license_key = '" . db_escape_string($newKey) . "' 
        WHERE hosting_id = " . $hostingId);
    full_query("UPDATE tblhosting SET domain = '" . db_escape_string($newKey) . "' WHERE id = " . $hostingId);

    return 'License key regenerated successfully';
}

function Venom_sync_status($params)
{
    return 'Status synced successfully';
}

function Venom_ClientArea($params)
{
    $result = full_query("SELECT * FROM mod_venom_licenses WHERE hosting_id = " . (int) $params['serviceid']);
    $license = mysql_fetch_assoc($result);

    if (!$license) {
        return [
            'templatefile' => 'error',
            'vars' => ['error' => 'License not found'],
        ];
    }

    $serversResult = full_query("SELECT * FROM mod_venom_servers WHERE license_id = " . (int) $license['id']);
    $servers = [];
    while ($row = mysql_fetch_assoc($serversResult)) {
        $servers[] = $row;
    }

    $lbsResult = full_query("SELECT * FROM mod_venom_load_balancers WHERE license_id = " . (int) $license['id']);
    $loadBalancers = [];
    while ($row = mysql_fetch_assoc($lbsResult)) {
        $loadBalancers[] = $row;
    }

    return [
        'templatefile' => 'clientarea',
        'vars' => [
            'license' => $license,
            'servers' => $servers,
            'loadBalancers' => $loadBalancers,
        ],
    ];
}
