<?php
/**
 * VENOM CODE - License Expiry Alert Hook
 * Sends alerts 7 days before license expiration
 */

use WHMCS\Database\Capsule;

if (!defined('WHMCS')) {
    exit;
}

/**
 * Send expiry reminder emails 7 days before expiration
 */
function venom_licenseExpiryAlert()
{
    $daysBeforeExpiry = 7;
    
    try {
        $threshold = date('Y-m-d', strtotime('+' . $daysBeforeExpiry . ' days'));
        $today = date('Y-m-d');
        
        $services = Capsule::table('tblhosting')
            ->join('tblclients', 'tblhosting.userid', '=', 'tblclients.id')
            ->join('tblproducts', 'tblhosting.packageid', '=', 'tblproducts.id')
            ->where('tblhosting.domainstatus', 'Active')
            ->where('tblhosting.nextduedate', $threshold)
            ->where('tblproducts.gid', 1) // IPTV Licenses group
            ->select(
                'tblhosting.id as service_id',
                'tblhosting.domain as license_key',
                'tblhosting.nextduedate',
                'tblclients.id as client_id',
                'tblclients.firstname',
                'tblclients.lastname',
                'tblclients.email',
                'tblproducts.name as product_name'
            )
            ->get();
        
        foreach ($services as $service) {
            $emailTemplate = 'License Expiry Reminder';
            $hookValues = [
                'license_key' => $service->license_key ?: 'N/A',
                'product_name' => $service->product_name,
                'expiry_date' => $service->nextduedate,
                'client_id' => $service->client_id,
                'service_id' => $service->service_id,
            ];
            
            sendMessage($emailTemplate, $service->client_id, $hookValues);
        }
        
    } catch (\Exception $e) {
        logActivity('VENOM License Expiry Alert Error: ' . $e->getMessage());
    }
}

/**
 * Check and alert for expired licenses
 */
function venom_checkExpiredLicenses()
{
    $today = date('Y-m-d');
    
    try {
        $expiredServices = Capsule::table('tblhosting')
            ->join('tblclients', 'tblhosting.userid', '=', 'tblclients.id')
            ->join('tblproducts', 'tblhosting.packageid', '=', 'tblproducts.id')
            ->where('tblhosting.domainstatus', 'Active')
            ->where('tblhosting.nextduedate', '<', $today)
            ->where('tblproducts.gid', 1) // IPTV Licenses group
            ->select(
                'tblhosting.id as service_id',
                'tblhosting.domain as license_key',
                'tblhosting.nextduedate',
                'tblclients.id as client_id',
                'tblclients.firstname',
                'tblclients.lastname',
                'tblclients.email',
                'tblproducts.name as product_name'
            )
            ->get();
        
        foreach ($expiredServices as $service) {
            sendMessage('License Expired Notice', $service->client_id, [
                'license_key' => $service->license_key ?: 'N/A',
                'product_name' => $service->product_name,
                'expiry_date' => $service->nextduedate,
            ]);
            
            Capsule::table('tblhosting')
                ->where('id', $service->service_id)
                ->update(['domainstatus' => 'Suspended']);
        }
        
    } catch (\Exception $e) {
        logActivity('VENOM License Expiry Check Error: ' . $e->getMessage());
    }
}

/**
 * Hook: Run daily cron check
 */
add_hook('DailyCronJob', 1, function($vars) {
    venom_licenseExpiryAlert();
    venom_checkExpiredLicenses();
});

/**
 * Hook: Add license info to client area
 */
add_hook('ClientAreaHomeOutput', 1, function($vars) {
    return $vars;
});

/**
 * Hook: License status in service details
 */
add_hook('ServiceDetailsOutput', 1, function($service) {
    if ($service['model']->product->groupId == 1) {
        return [
            'License Key' => $service['model']->domain ?: 'Not assigned',
            'Status' => ucfirst($service['model']->domainStatus),
        ];
    }
});
