import mysql from "mysql2/promise";

/**
 * Diagnostic script to analyze WHMCS products and configurable options
 * Run with: npx tsx src/lib/diagnose-products.ts
 */

// Direct connection to WHMCS database
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

interface Product extends Record<string, unknown> {
  id: number;
  name: string;
  type: string;
  gid: number;
}

interface ConfigOption extends Record<string, unknown> {
  id: number;
  gid: number;
  optionname: string;
  optiontype: string;
  qtyminimum: number;
  qtymaximum: number;
}

interface ConfigOptionSub extends Record<string, unknown> {
  id: number;
  configid: number;
  optionname: string;
  sortorder: number;
  hidden: number;
}

interface ConfigLink extends Record<string, unknown> {
  gid: number;
  pid: number;
}

interface Addon extends Record<string, unknown> {
  id: number;
  name: string;
  packages: string;
}

interface Pricing extends Record<string, unknown> {
  type: string;
  relid: number;
  currency: number;
  monthly: number;
  quarterly: number;
  semiannually: number;
  annually: number;
  biennially: number;
  triennially: number;
}

export async function diagnoseLoadBalancers() {
  console.log("\n=== WHMCS Load Balancer Diagnostic ===\n");

  // 1. Find Monthly Basic and Weekly Trial products
  console.log("1. Finding products...");
  const [products] = await pool.query<Product[]>(
    "SELECT id, name, type, gid FROM tblproducts WHERE name IN ('Monthly Basic', 'Weekly Trial') OR name LIKE '%Basic%' OR name LIKE '%Trial%'"
  );

  let monthlyBasicId: number | null = null;
  let weeklyTrialId: number | null = null;

  for (const p of products) {
    const name = String(p.name);
    console.log(`   - Product ID ${p.id}: "${name}" (Type: ${p.type}, Group: ${p.gid})`);
    if (name.toLowerCase().includes("monthly") && name.toLowerCase().includes("basic")) {
      monthlyBasicId = p.id;
    }
    if (name.toLowerCase().includes("weekly") && name.toLowerCase().includes("trial")) {
      weeklyTrialId = p.id;
    }
  }

  console.log(`\n   Monthly Basic ID: ${monthlyBasicId ?? "NOT FOUND"}`);
  console.log(`   Weekly Trial ID: ${weeklyTrialId ?? "NOT FOUND"}`);

  if (!monthlyBasicId) {
    console.log("\n   ERROR: Monthly Basic product not found!");
    return;
  }

  // 2. Check for existing Configurable Options related to Load Balancer
  console.log("\n2. Checking Configurable Options...");
  const [configOptions] = await pool.query<ConfigOption[]>(
    "SELECT id, gid, optionname, optiontype, qtyminimum, qtymaximum FROM tblproductconfigoptions WHERE optionname LIKE '%Load Balancer%' OR optionname LIKE '%load%' OR optionname LIKE '%balancer%'"
  );

  const loadBalancerOptionIds: number[] = [];
  for (const opt of configOptions) {
    console.log(`   - Config Option ID ${opt.id}: "${opt.optionname}" (Type: ${opt.optiontype}, MinQty: ${opt.qtyminimum}, MaxQty: ${opt.qtymaximum}, Group: ${opt.gid})`);
    if (String(opt.optionname).toLowerCase().includes("load") || String(opt.optionname).toLowerCase().includes("balancer")) {
      loadBalancerOptionIds.push(opt.id);
    }
  }

  // 3. Check Config Option Links (which products are linked to which option groups)
  console.log("\n3. Checking Config Option Links...");
  const [configLinks] = await pool.query<ConfigLink[]>(
    "SELECT gid, pid FROM tblproductconfiglinks"
  );

  for (const link of configLinks) {
    const productName = products.find(p => p.id === link.pid)?.name ?? "Unknown";
    console.log(`   - Product ID ${link.pid} ("${productName}") <- Config Group ID ${link.gid}`);
  }

  // Check if Monthly Basic is linked to any config group
  const monthlyBasicLinks = configLinks.filter(l => l.pid === monthlyBasicId);
  console.log(`\n   Monthly Basic is linked to ${monthlyBasicLinks.length} config group(s):`);
  for (const link of monthlyBasicLinks) {
    console.log(`     - Config Group ID: ${link.gid}`);
  }

  // 4. Check for Config Option Sub-options (pricing)
  console.log("\n4. Checking Config Option Sub-options...");
  for (const optId of loadBalancerOptionIds) {
    const [subOptions] = await pool.query<ConfigOptionSub[]>(
      "SELECT id, configid, optionname, sortorder, hidden FROM tblproductconfigoptionssub WHERE configid = ?",
      [optId]
    );
    console.log(`   - Config Option ${optId} has ${subOptions.length} sub-options:`);
    for (const sub of subOptions) {
      console.log(`     - Sub-option ID ${sub.id}: "${sub.optionname}" (Hidden: ${sub.hidden})`);

      // Get pricing for this sub-option
      const [pricing] = await pool.query<Pricing[]>(
        "SELECT type, relid, monthly, quarterly, semiannually, annually, biennially, triennially FROM tblpricing WHERE type = 'configoptions' AND relid = ?",
        [sub.id]
      );
      for (const p of pricing) {
        console.log(`       - Pricing: Monthly=$${p.monthly}, Quarterly=$${p.quarterly}, SemiAnnually=$${p.semiannually}, Annually=$${p.annually}`);
      }
    }
  }

  // 5. Check for Product Addons related to Load Balancer
  console.log("\n5. Checking Product Addons...");
  const [addons] = await pool.query<Addon[]>(
    "SELECT id, name, packages FROM tbladdons WHERE name LIKE '%Load Balancer%' OR name LIKE '%load%' OR name LIKE '%balancer%'"
  );

  for (const addon of addons) {
    console.log(`   - Addon ID ${addon.id}: "${addon.name}" (Packages: ${addon.packages})`);

    // Get pricing for this addon
    const [pricing] = await pool.query<Pricing[]>(
      "SELECT type, relid, monthly, quarterly, semiannually, annually, biennially, triennially FROM tblpricing WHERE type = 'addon' AND relid = ?",
      [addon.id]
    );
    for (const p of pricing) {
      console.log(`     - Pricing: Monthly=$${p.monthly}, Quarterly=$${p.quarterly}, SemiAnnually=$${p.semiannually}, Annually=$${p.annually}`);
    }
  }

  // 6. Summary and Diagnosis
  console.log("\n=== DIAGNOSIS SUMMARY ===\n");

  if (loadBalancerOptionIds.length > 0 && addons.length > 0) {
    console.log("   CONFLICT: Both Configurable Options AND Addons exist for Load Balancer!");
    console.log("   This can cause pricing calculation issues and duplicate options in the cart.");
  } else if (loadBalancerOptionIds.length > 0) {
    console.log("   Current implementation: Configurable Options");
    console.log("   Need to verify: qtymin=0, qtymax=100, and pricing is set correctly");
  } else if (addons.length > 0) {
    console.log("   Current implementation: Product Addons");
    console.log("   Note: Addons typically don't support quantity selection in standard order forms");
  } else {
    console.log("   NO Load Balancer option found. Need to create from scratch.");
  }

  console.log("\n=== END DIAGNOSTIC ===\n");

  return {
    monthlyBasicId,
    weeklyTrialId,
    loadBalancerOptionIds,
    addonIds: addons.map(a => a.id),
    monthlyBasicLinks,
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  diagnoseLoadBalancers().catch(console.error);
}
