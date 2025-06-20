
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // In a real implementation, you would check if setup has been completed
    // This could be by checking for a specific file, database table, or environment variable
    
    // For this example, we'll check if a setup-complete.json file exists
    const setupFilePath = path.join(process.cwd(), "setup-complete.json");
    
    let setupCompleted = false;
    
    try {
      if (fs.existsSync(setupFilePath)) {
        setupCompleted = true;
      }
    } catch (error) {
      console.error("Error checking setup status:", error);
    }
    
    return res.status(200).json({ setupCompleted });
  } catch (error) {
    console.error("Error checking setup status:", error);
    return res.status(500).json({ 
      message: "Failed to check setup status", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
