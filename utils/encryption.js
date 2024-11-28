import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const encryptionKey = process.env.ENCRYPTION_KEY || "my_secure_key_32_chars"; // Use a secure 32-character key
const encryptionIV = process.env.ENCRYPTION_IV || "my_secure_iv_16_chars"; // Use a secure 16-character IV

// Helper function to encrypt data
export function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    Buffer.from(encryptionIV)
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Helper function to decrypt data
export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    Buffer.from(encryptionIV)
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
