import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { 
  mockAssets, 
  mockUsers, 
  mockComponents, 
  mockAccessories, 
  mockLicenses, 
  mockZabbixVMs, 
  mockActivityLogs,
  mockBitLockerKeys // Added import for BitLocker keys
} from "@/lib/mockData";
import { hash } from "bcrypt";
import fs from "fs/promises"; // Use promises for async file operations
import path from "path"; // Import path module

// This would normally be in a separate utility file
const createTables = async (pool: Pool) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Create assets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        asset_tag VARCHAR(50) UNIQUE NOT NULL,
        serial_number VARCHAR(100) UNIQUE,
        model VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        manufacturer VARCHAR(100),
        purchase_date DATE,
        purchase_cost DECIMAL(10, 2),
        warranty_expires DATE,
        assigned_to INTEGER,
        location VARCHAR(100),
        notes TEXT,
        ip_address VARCHAR(15),
        mac_address VARCHAR(17),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        department VARCHAR(100),
        position VARCHAR(100),
        phone VARCHAR(20),
        location VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create components table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        serial_number VARCHAR(100),
        manufacturer VARCHAR(100),
        model VARCHAR(100),
        purchase_date DATE,
        purchase_cost DECIMAL(10, 2),
        asset_id INTEGER REFERENCES assets(id),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create accessories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS accessories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        manufacturer VARCHAR(100),
        model VARCHAR(100),
        purchase_date DATE,
        purchase_cost DECIMAL(10, 2),
        quantity INTEGER DEFAULT 1,
        quantity_available INTEGER DEFAULT 1,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create licenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS licenses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        software VARCHAR(100) NOT NULL,
        key VARCHAR(255) NOT NULL,
        seats INTEGER DEFAULT 1,
        seats_available INTEGER DEFAULT 1,
        purchase_date DATE,
        expiration_date DATE,
        purchase_cost DECIMAL(10, 2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create zabbix_vms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS zabbix_vms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        ip_address VARCHAR(15),
        status VARCHAR(20) NOT NULL,
        cpu_usage DECIMAL(5, 2),
        memory_usage DECIMAL(5, 2),
        disk_usage DECIMAL(5, 2),
        os VARCHAR(100),
        last_check TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create activity_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        item_type VARCHAR(50) NOT NULL,
        item_id INTEGER NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create bitlocker_keys table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bitlocker_keys (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES assets(id),
        recovery_key VARCHAR(255) NOT NULL,
        drive_letter VARCHAR(5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create network_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS network_settings (
        id SERIAL PRIMARY KEY,
        dns1 VARCHAR(15) NOT NULL,
        dns2 VARCHAR(15) NOT NULL,
        default_gateway VARCHAR(15),
        subnet_mask VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default network settings
    await client.query(`
      INSERT INTO network_settings (dns1, dns2, default_gateway, subnet_mask)
      VALUES ('107.105.134.9', '107.105.134.8', '192.168.1.1', '255.255.255.0')
      ON CONFLICT DO NOTHING
    `);
    
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const importMockData = async (pool: Pool, importOptions: any) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Import assets
    if (importOptions.assets) {
      for (const asset of mockAssets) {
        await client.query(`
          INSERT INTO assets (
            asset_tag, serial_number, model, status, category, 
            manufacturer, purchase_date, purchase_cost, warranty_expires, 
            location, notes, ip_address, mac_address
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (asset_tag) DO NOTHING
        `, [
          asset.assetTag,
          asset.serialNumber,
          asset.model,
          asset.status,
          asset.category,
          asset.manufacturer,
          asset.purchaseDate,
          asset.purchaseCost,
          asset.warrantyExpires,
          asset.location,
          asset.notes,
          asset.ipAddress,
          asset.macAddress
        ]);
      }
    }
    
    // Import users
    if (importOptions.users) {
      for (const user of mockUsers) {
        await client.query(`
          INSERT INTO users (
            name, email, department, position, phone, location, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (email) DO NOTHING
        `, [
          user.name,
          user.email,
          user.department,
          user.position,
          user.phone,
          user.location,
          user.isActive
        ]);
      }
    }
    
    // Import components
    if (importOptions.components) {
      for (const component of mockComponents) {
        // Find the corresponding asset's numeric ID
        const asset = mockAssets.find(a => a.id === parseInt(component.assetId || '0')); // Parse assetId string to number
        const assetDbId = asset ? asset.id : null; // Use the numeric ID or null if not found/assigned

        await client.query(`
          INSERT INTO components (
            name, category, serial_number, manufacturer, model, 
            purchase_date, purchase_cost, status, asset_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
        `, [
          component.name,
          component.category,
          component.serialNumber,
          component.manufacturer,
          component.model,
          component.purchaseDate,
          component.purchaseCost,
          component.status,
          assetDbId // Use the numeric asset ID
        ]);
      }
    }
    
    // Import accessories
    if (importOptions.accessories) {
      for (const accessory of mockAccessories) {
        await client.query(`
          INSERT INTO accessories (
            name, category, manufacturer, model, purchase_date, 
            purchase_cost, quantity, quantity_available, location
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
        `, [
          accessory.name,
          accessory.category,
          accessory.manufacturer,
          accessory.model,
          accessory.purchaseDate,
          accessory.purchaseCost,
          accessory.quantity,
          accessory.quantityAvailable,
          accessory.location
        ]);
      }
    }
    
    // Import licenses
    if (importOptions.licenses) {
      for (const license of mockLicenses) {
        await client.query(`
          INSERT INTO licenses (
            name, software, key, seats, seats_available, 
            purchase_date, expiration_date, purchase_cost, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
        `, [
          license.name,
          license.software,
          license.key,
          license.seats,
          license.seatsAvailable,
          license.purchaseDate,
          license.expirationDate,
          license.purchaseCost,
          license.notes
        ]);
      }
    }
    
    // Import Zabbix VMs
    if (importOptions.zabbixVms) {
      for (const vm of mockZabbixVMs) {
        await client.query(`
          INSERT INTO zabbix_vms (
            name, ip_address, status, cpu_usage, memory_usage, 
            disk_usage, os, last_check
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING
        `, [
          vm.name,
          vm.ipAddress,
          vm.status,
          vm.cpuUsage,
          vm.memoryUsage,
          vm.diskUsage,
          vm.os,
          vm.lastCheck
        ]);
      }
    }
    
    // Import activity logs
    if (importOptions.activityLogs) {
      for (const log of mockActivityLogs) {
        // Parse string IDs to integers for DB insertion
        const userIdInt = parseInt(log.userId || '0');
        const itemIdInt = parseInt(log.itemId || '0');

        // Basic check if parsing failed (optional, depends on how strict you want to be)
        if (isNaN(userIdInt) || isNaN(itemIdInt)) {
          console.warn(`Skipping activity log due to invalid ID: UserID='${log.userId}', ItemID='${log.itemId}'`);
          continue; 
        }

        await client.query(`
          INSERT INTO activity_logs (
            user_id, action, item_type, item_id, details, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [
          userIdInt, // Use parsed integer user ID
          log.action,
          log.itemType,
          itemIdInt, // Use parsed integer item ID
          log.details,
          log.timestamp
        ]);
      }
    }

    // Import Bitlocker Keys (assuming type fix applied previously)
    if (importOptions.bitlockerKeys) {
       // This import was missing, adding it now.
       // Also assuming mockBitLockerKeys exists in mockData import
       for (const key of mockBitLockerKeys) {
         const assetIdInt = parseInt(key.assetId || '0'); // Parse string ID to integer

         if (isNaN(assetIdInt)) {
            console.warn(`Skipping BitLocker key due to invalid asset ID: '${key.assetId}'`);
            continue;
         }

         await client.query(`
            INSERT INTO bitlocker_keys (asset_id, recovery_key, created_at)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
         `, [
            assetIdInt, // Use parsed integer asset ID
            key.recoveryKey,
            key.createdAt
         ]);
       }
    }
    
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createAdminUser = async (pool: Pool, admin: any) => {
  const client = await pool.connect();
  
  try {
    // Hash the password
    const hashedPassword = await hash(admin.password, 10);
    
    // Insert the admin user
    const result = await client.query(`
      INSERT INTO users (name, email, password, is_admin)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id
    `, [admin.name, admin.email, hashedPassword]);
    
    return result.rows[0].id;
  } finally {
    client.release();
  }
};

// Function to mark setup as complete
const markSetupComplete = async () => {
  const setupFilePath = path.join(process.cwd(), "setup-complete.json");
  try {
    await fs.writeFile(setupFilePath, JSON.stringify({ completed: true, timestamp: new Date().toISOString() }));
    console.log("Setup marked as complete.");
  } catch (error) {
    console.error("Error marking setup as complete:", error);
    // Decide if this should throw or just log
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { admin, database, importOptions } = req.body;

  if (!admin || !database) {
    return res.status(400).json({ message: "Missing required setup parameters" });
  }

  const pool = new Pool({
    host: database.host,
    port: parseInt(database.port),
    database: database.database,
    user: database.username,
    password: database.password,
  });

  try {
    console.log("Starting setup process...");

    // Step 1: Create database tables
    console.log("Creating database tables...");
    await createTables(pool);
    console.log("Database tables created successfully.");
    
    // Step 2: Create admin user
    console.log("Creating admin user...");
    const adminId = await createAdminUser(pool, admin);
    console.log(`Admin user created successfully with ID: ${adminId}`);
    
    // Step 3: Import mock data if requested
    console.log("Importing mock data...");
    await importMockData(pool, importOptions);
    console.log("Mock data imported successfully.");
    
    // Step 4: Mark setup as complete by creating the flag file
    console.log("Marking setup as complete...");
    await markSetupComplete();
    
    // Step 5: Save database configuration to .env or config file (Placeholder)
    // In a real implementation, you would save these credentials securely
    console.log("Database configuration saving placeholder.");
    
    // Return success
    console.log("Setup completed successfully.");
    return res.status(200).json({ 
      message: "Setup completed successfully",
      adminId
    });
  } catch (error) {
    // Enhanced error logging
    console.error("---------------------");
    console.error("SETUP FAILED:", error);
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    } else {
      console.error("Unknown error object:", error);
    }
     console.error("---------------------");
    
    return res.status(500).json({ 
      message: "Failed to complete setup", 
      // Provide more specific error details if possible and safe
      error: error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error during setup" 
    });
  } finally {
    // End the pool
    console.log("Closing database connection pool.");
    await pool.end();
  }
}