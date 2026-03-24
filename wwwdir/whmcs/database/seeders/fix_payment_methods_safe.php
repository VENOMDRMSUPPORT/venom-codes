<?php

declare(strict_types=1);

require __DIR__ . '/../../init.php';

use WHMCS\Database\Capsule;

$now = date('Y-m-d H:i:s');
$demoDescriptions = [
    'Demo Remote Bank Account - Primary',
    'Demo Remote Card - Backup',
];

Capsule::connection()->transaction(function () use ($now, $demoDescriptions) {
    $payMethodIds = Capsule::table('tblpaymethods')
        ->whereIn('description', $demoDescriptions)
        ->pluck('id')
        ->map(static fn($id) => (int) $id)
        ->all();

    if (!empty($payMethodIds)) {
        Capsule::table('tblcreditcards')->whereIn('pay_method_id', $payMethodIds)->delete();
        Capsule::table('tblbankaccts')->whereIn('pay_method_id', $payMethodIds)->delete();
        Capsule::table('tblpaymethods')->whereIn('id', $payMethodIds)->delete();
    }

    $ownerUserIds = Capsule::table('tblusers_clients')
        ->where('owner', 1)
        ->orderBy('auth_user_id', 'asc')
        ->pluck('auth_user_id')
        ->map(static fn($id) => (int) $id)
        ->all();

    foreach ($ownerUserIds as $index => $userId) {
        $payMethodId = (int) Capsule::table('tblpaymethods')->insertGetId([
            'userid' => $userId,
            'description' => 'Demo Remote Bank Account - Primary',
            'contact_id' => 0,
            'contact_type' => 'Client',
            'payment_id' => 0,
            'payment_type' => 'RemoteBankAccount',
            'gateway_name' => 'banktransfer',
            'order_preference' => $index,
            'created_at' => $now,
            'updated_at' => $now,
            'deleted_at' => null,
        ]);

        $rawBankData = json_encode([
            'accountHolderName' => 'Demo User ' . $userId,
            'accountNumber' => '00000000',
            'routingNumber' => '000000',
            'bankName' => 'Demo Bank',
            'accountType' => 'checking',
        ], JSON_UNESCAPED_SLASHES);

        $encryptedBankData = encrypt($rawBankData ?: 'demo-bank-data');

        $bankAcctId = (int) Capsule::table('tblbankaccts')->insertGetId([
            'pay_method_id' => $payMethodId,
            'bank_name' => 'Demo Bank',
            'acct_type' => 'Checking',
            'bank_data' => $encryptedBankData,
            'created_at' => $now,
            'updated_at' => $now,
            'deleted_at' => null,
        ]);

        Capsule::table('tblpaymethods')
            ->where('id', $payMethodId)
            ->update([
                'payment_id' => $bankAcctId,
                'updated_at' => $now,
            ]);
    }
});

echo "Safe payment methods fix applied\n";
