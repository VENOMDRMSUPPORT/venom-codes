<?php

declare(strict_types=1);

require __DIR__ . '/../../init.php';

use WHMCS\Database\Capsule;

$expectedCount = (int) Capsule::table('tblclients')
    ->where('status', 'Active')
    ->count();

$actualCount = (int) Capsule::table('tblcontacts')
    ->where('email', 'like', 'seed.contact.%@venom.local')
    ->count();

$missingMappings = (int) Capsule::table('tblclients as c')
    ->leftJoin('tblcontacts as ct', function ($join) {
        $join->on('ct.userid', '=', 'c.id')
            ->where('ct.email', 'like', 'seed.contact.%@venom.local');
    })
    ->where('c.status', 'Active')
    ->whereNull('ct.id')
    ->count();

if ($expectedCount !== $actualCount || $missingMappings > 0) {
    fwrite(STDERR, "Contacts seeder test failed\n");
    fwrite(STDERR, "Expected active clients: {$expectedCount}\n");
    fwrite(STDERR, "Actual seeded contacts: {$actualCount}\n");
    fwrite(STDERR, "Missing client->contact mappings: {$missingMappings}\n");
    exit(1);
}

echo "Contacts seeder test passed\n";
echo "Seeded contacts: {$actualCount}\n";
