import mysql from "mysql2/promise";

/**
 * Fix script for WHMCS Load Balancer Configurable Option
 *
 * PROBLEM DIAGNOSED:
 * - Config Option ID 2 (Type: Quantity) has NO sub-options
 * - Without sub-options, pricing cannot be calculated
 * - Also has conflicting Addon ID 7
 *
 * SOLUTION:
 * 1. Create a sub-option for Config Option ID 2 with $10/month pricing
 * 2. Hide the conflicting Addon to prevent conflicts
 */

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 7999,
  user: 'admin',
  password: 'habiba77Hm',
  database: 'whmcs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 50,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: false,
});

async function fixLoadBalancer() {
  console.log("\n=== WHMCS Load Balancer Fix Script ===\n");

  // Verify current state
  console.log("1. Verifying current state...");
  const [configOptions] = await pool.query<any[]>(
    "SELECT id, gid, optionname, optiontype, qtyminimum, qtymaximum FROM tblproductconfigoptions WHERE id = 2"
  );

  if (configOptions.length === 0) {
    console.log("   ERROR: Config Option ID 2 not found!");
    return;
  }

  const opt = configOptions[0];
  console.log(`   Found: "${opt.optionname}" (Type: ${opt.optiontype}, Min: ${opt.qtyminimum}, Max: ${opt.qtymaximum})`);

  // Check existing sub-options
  const [existingSubs] = await pool.query<any[]>(
    "SELECT id FROM tblproductconfigoptionssub WHERE configid = 2"
  );
  console.log(`   Existing sub-options: ${existingSubs.length}`);

  if (existingSubs.length > 0) {
    console.log("   WARNING: Sub-options already exist. Skipping creation.");
    console.log("   Existing sub-options:");
    for (const sub of existingSubs) {
      console.log(`     - Sub-option ID: ${sub.id}`);
    }
  } else {
    // Create sub-option for pricing
    console.log("\n2. Creating sub-option for pricing...");
    const insertResult = await pool.query<any>(
      "INSERT INTO tblproductconfigoptionssub (configid, optionname, sortorder, hidden) VALUES (?, ?, ?, ?)",
      [2, "Extra Load Balancer", 1, 0]
    );
    const subOptionId = insertResult[0].insertId;
    console.log(`   ✓ Created sub-option ID: ${subOptionId}`);

    // Add pricing: $10.00 monthly (with 0 setup fees)
    console.log("\n3. Adding pricing ($10.00 monthly)...");
    await pool.query<any>(
      "INSERT INTO tblpricing (type, relid, currency, msetupfee, qsetupfee, ssetupfee, asetupfee, bsetupfee, tsetupfee, monthly, quarterly, semiannually, annually, biennially, triennially) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ["configoptions", subOptionId, "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "10.00", "0.00", "0.00", "0.00", "0.00", "0.00"]
    );
    console.log("   ✓ Pricing set: $10.00/month");
  }

  // Hide conflicting addon
  console.log("\n4. Hiding conflicting Addon ID 7...");
  const [addonCheck] = await pool.query<any[]>(
    "SELECT id, name, hidden FROM tbladdons WHERE id = 7"
  );

  if (addonCheck.length > 0) {
    const currentHidden = addonCheck[0].hidden;
    console.log(`   Current hidden status: ${currentHidden}`);

    if (currentHidden === 0) {
      await pool.query<any>(
        "UPDATE tbladdons SET hidden = 1 WHERE id = 7"
      );
      console.log("   ✓ Addon ID 7 is now hidden");
    } else {
      console.log("   Addon already hidden, skipping");
    }
  } else {
    console.log("   Addon ID 7 not found, skipping");
  }

  // Verify Monthly Basic is linked to Config Group 3
  console.log("\n5. Verifying product links...");
  const [links] = await pool.query<any[]>(
    "SELECT gid, pid FROM tblproductconfiglinks WHERE pid = 4"
  );

  if (links.length === 0) {
    console.log("   WARNING: Monthly Basic (ID 4) is NOT linked to any config group!");
    console.log("   Creating link to Config Group 3...");
    await pool.query<any>(
      "INSERT INTO tblproductconfiglinks (gid, pid) VALUES (?, ?)",
      [3, 4]
    );
    console.log("   ✓ Created link: Product ID 4 -> Config Group 3");
  } else {
    console.log("   ✓ Monthly Basic is properly linked to Config Group 3");
  }

  // Verify Weekly Trial is NOT linked
  const [trialLinks] = await pool.query<any[]>(
    "SELECT gid, pid FROM tblproductconfiglinks WHERE pid = 3"
  );

  if (trialLinks.length > 0) {
    console.log("\n   WARNING: Weekly Trial (ID 3) is linked to config groups!");
    console.log("   Removing links from Weekly Trial...");
    for (const link of trialLinks) {
      await pool.query<any>(
        "DELETE FROM tblproductconfiglinks WHERE pid = 3 AND gid = ?",
        [link.gid]
      );
      console.log(`   ✓ Removed link to Config Group ${link.gid}`);
    }
  } else {
    console.log("   ✓ Weekly Trial is NOT linked to any config group (correct)");
  }

  // Final verification
  console.log("\n=== FINAL VERIFICATION ===\n");

  const [finalSubs] = await pool.query<any[]>(
    "SELECT id, optionname, hidden FROM tblproductconfigoptionssub WHERE configid = 2"
  );
  console.log(`Config Option 2 sub-options: ${finalSubs.length}`);
  for (const sub of finalSubs) {
    const [pricing] = await pool.query<any[]>(
      "SELECT monthly, quarterly, semiannually, annually FROM tblpricing WHERE type = 'configoptions' AND relid = ?",
      [sub.id]
    );
    console.log(`  - Sub-option ${sub.id}: "${sub.optionname}" (Hidden: ${sub.hidden})`);
    if (pricing.length > 0) {
      console.log(`    Pricing: Monthly=$${pricing[0].monthly}, Quarterly=$${pricing[0].quarterly}, Annual=$${pricing[0].annually}`);
    }
  }

  console.log("\n=== FIX COMPLETE ===\n");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixLoadBalancer().catch(console.error);
}
