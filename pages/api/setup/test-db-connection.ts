
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { host, port, database, username, password } = req.body;

  if (!host || !port || !database || !username) {
    return res.status(400).json({ message: "Missing required database connection parameters" });
  }

  const pool = new Pool({
    host,
    port: parseInt(port),
    database,
    user: username,
    password,
    // Set a short connection timeout for testing
    connectionTimeoutMillis: 5000,
  });

  try {
    // Test the connection
    const client = await pool.connect();
    client.release();
    
    // Return success
    return res.status(200).json({ message: "Connection successful" });
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ 
      message: "Failed to connect to database", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  } finally {
    // End the pool
    await pool.end();
  }
}
