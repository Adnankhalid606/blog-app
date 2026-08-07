import dotenv from "dotenv";
dotenv.config();

export const validateEnv = () => {
  const requiredEnvVars = [
    "JWT_SECRET",
    "DB_HOST",
    "DB_USER",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const dbName = process.env.DB_NAME || process.env.DB_DATABASE;
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (!dbName) {
    missingVars.push("DB_NAME / DB_DATABASE");
  }

  if (missingVars.length > 0) {
    console.error("==================================================");
    console.error("FATAL ERROR: Missing required environment variables:");
    missingVars.forEach((v) => console.error(`  - ${v}`));
    console.error("Server execution halted. Please check your .env file.");
    console.error("==================================================");
    process.exit(1);
  }
};
