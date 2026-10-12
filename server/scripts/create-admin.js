import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Set ADMIN_EMAIL to a valid email address.");
  process.exit(1);
}
if (!password || password.length < 12) {
  console.error("Set ADMIN_PASSWORD to a password with at least 12 characters.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email`,
    [email, passwordHash]
  );

  if (result.rowCount === 0) {
    console.log("That admin email already exists. No account or password was changed.");
  } else {
    console.log(`Created admin account for ${result.rows[0].email}.`);
  }
} catch (error) {
  console.error("Could not create admin. Confirm the schema has been applied and the database is reachable.");
  console.error(error instanceof Error ? error.message : "Unknown database error");
  process.exitCode = 1;
} finally {
  await pool.end();
}
