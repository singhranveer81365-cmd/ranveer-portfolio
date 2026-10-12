import "dotenv/config";
import bcrypt from "bcryptjs";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import { Pool } from "pg";
import { z } from "zod";

const port = Number(process.env.PORT || 4000);
const sessionSecret = process.env.SESSION_SECRET || "";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required. Configure it in the API host environment.");
  process.exit(1);
}
if (sessionSecret.length < 32 || sessionSecret.includes("replace-with")) {
  console.error("SESSION_SECRET must be a unique random secret of at least 32 characters.");
  process.exit(1);
}

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    // No Origin is normal for health checks and server-to-server clients.
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed"));
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "100kb" }));

// Reject cross-origin browser writes even when a client attempts to send a
// simple form request without needing a CORS preflight.
app.use("/api", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: "Origin is not allowed" });
  }
  return next();
});

const PgSessionStore = connectPgSimple(session);
app.use(session({
  name: "portfolio.sid",
  store: new PgSessionStore({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAME_SITE === "none" ? "none" : "lax",
    maxAge: 8 * 60 * 60 * 1000,
  },
}));

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function requireAdmin(req, res, next) {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
}

function parseId(value) {
  const result = z.coerce.number().int().positive().safeParse(value);
  return result.success ? result.data : null;
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

app.get("/api/health", asyncRoute(async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true, service: "portfolio-api", database: "connected" });
}));

app.post("/api/auth/login", loginLimiter, asyncRoute(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Enter a valid email and password." });
  }

  const email = parsed.data.email.toLowerCase();
  const result = await pool.query(
    "SELECT id, email, password_hash FROM admins WHERE lower(email) = $1 LIMIT 1",
    [email]
  );
  const admin = result.rows[0];
  const passwordMatches = admin
    ? await bcrypt.compare(parsed.data.password, admin.password_hash)
    : false;

  if (!admin || !passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => error ? reject(error) : resolve());
  });
  req.session.adminId = String(admin.id);
  req.session.adminEmail = admin.email;
  await new Promise((resolve, reject) => {
    req.session.save((error) => error ? reject(error) : resolve());
  });

  return res.json({ admin: { id: String(admin.id), email: admin.email } });
}));

app.get("/api/auth/me", requireAdmin, (req, res) => {
  res.json({ admin: { id: req.session.adminId, email: req.session.adminEmail } });
});

app.post("/api/auth/logout", requireAdmin, asyncRoute(async (req, res) => {
  await new Promise((resolve, reject) => {
    req.session.destroy((error) => error ? reject(error) : resolve());
  });
  res.clearCookie("portfolio.sid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAME_SITE === "none" ? "none" : "lax",
  });
  res.status(204).end();
}));

const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().max(500).default(""),
  description: z.string().max(12_000).default(""),
  tech_stack: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  live_url: z.string().url().nullable().default(null),
  repository_url: z.string().url().nullable().default(null),
  image_url: z.string().url().nullable().default(null),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(-10_000).max(10_000).default(0),
  is_published: z.boolean().default(false),
});

const experienceSchema = z.object({
  organisation: z.string().trim().min(1).max(180),
  role: z.string().trim().min(1).max(180),
  period: z.string().max(100).default(""),
  description: z.string().max(8_000).default(""),
  sort_order: z.number().int().min(-10_000).max(10_000).default(0),
  is_published: z.boolean().default(false),
});

const skillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100).default("General"),
  sort_order: z.number().int().min(-10_000).max(10_000).default(0),
  is_published: z.boolean().default(true),
});

const resources = {
  projects: {
    table: "projects",
    schema: projectSchema,
    columns: ["title", "slug", "summary", "description", "tech_stack", "live_url", "repository_url", "image_url", "featured", "sort_order", "is_published"],
    publicOrder: "sort_order ASC, updated_at DESC",
  },
  experiences: {
    table: "experiences",
    schema: experienceSchema,
    columns: ["organisation", "role", "period", "description", "sort_order", "is_published"],
    publicOrder: "sort_order ASC, created_at DESC",
  },
  skills: {
    table: "skills",
    schema: skillSchema,
    columns: ["name", "category", "sort_order", "is_published"],
    publicOrder: "category ASC, sort_order ASC, name ASC",
  },
};

for (const [resourceName, config] of Object.entries(resources)) {
  app.get(`/api/public/${resourceName}`, asyncRoute(async (_req, res) => {
    const result = await pool.query(
      `SELECT * FROM ${config.table} WHERE is_published = TRUE ORDER BY ${config.publicOrder}`
    );
    res.json({ data: result.rows });
  }));

  app.get(`/api/admin/${resourceName}`, requireAdmin, asyncRoute(async (_req, res) => {
    const result = await pool.query(
      `SELECT * FROM ${config.table} ORDER BY sort_order ASC, updated_at DESC`
    );
    res.json({ data: result.rows });
  }));

  app.post(`/api/admin/${resourceName}`, requireAdmin, asyncRoute(async (req, res) => {
    const parsed = config.schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid content", details: parsed.error.issues });
    }
    const body = parsed.data;
    const columns = Object.keys(body).filter((key) => config.columns.includes(key));
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = columns.map((column) => body[column]);
    const result = await pool.query(
      `INSERT INTO ${config.table} (${columns.join(", ")})
       VALUES (${placeholders.join(", ")}) RETURNING *`,
      values
    );
    return res.status(201).json({ data: result.rows[0] });
  }));

  app.patch(`/api/admin/${resourceName}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid record ID" });

    const parsed = config.schema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid content", details: parsed.error.issues });
    }
    const columns = Object.keys(parsed.data).filter((key) => config.columns.includes(key));
    if (columns.length === 0) {
      return res.status(400).json({ error: "Provide at least one field to update." });
    }
    const values = columns.map((column) => parsed.data[column]);
    const assignments = columns.map((column, index) => `${column} = $${index + 1}`);
    values.push(id);
    const result = await pool.query(
      `UPDATE ${config.table}
       SET ${assignments.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });
    return res.json({ data: result.rows[0] });
  }));

  app.delete(`/api/admin/${resourceName}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid record ID" });
    const result = await pool.query(`DELETE FROM ${config.table} WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });
    return res.status(204).end();
  }));
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(180).default(""),
  message: z.string().trim().min(5).max(8_000),
  website: z.string().max(200).optional(), // Honeypot field; should be left empty.
});

app.post("/api/contact", contactLimiter, asyncRoute(async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please check your contact details and message." });
  }
  if (parsed.data.website) return res.status(204).end();

  const { name, email, subject, message } = parsed.data;
  await pool.query(
    "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
    [name, email, subject, message]
  );
  return res.status(201).json({ ok: true });
}));

app.get("/api/admin/messages", requireAdmin, asyncRoute(async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, subject, message, is_read, archived_at, created_at FROM contact_messages ORDER BY archived_at NULLS FIRST, created_at DESC LIMIT 200"
  );
  res.json({ data: result.rows });
}));

app.patch("/api/admin/messages/:id", requireAdmin, asyncRoute(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid message ID" });
  const parsed = z.object({
    is_read: z.boolean().optional(),
    archived: z.boolean().optional(),
  }).strict().safeParse(req.body);
  if (!parsed.success || Object.keys(parsed.data || {}).length === 0) {
    return res.status(400).json({ error: "Provide is_read and/or archived." });
  }

  const updates = [];
  const values = [];
  if (parsed.data.is_read !== undefined) {
    values.push(parsed.data.is_read);
    updates.push(`is_read = $${values.length}`);
  }
  if (parsed.data.archived !== undefined) {
    values.push(parsed.data.archived);
    updates.push(`archived_at = $${values.length} `);
  }
  if (parsed.data.archived !== undefined) {
    // Replace the assignment above with a database timestamp or NULL.
    updates[updates.length - 1] = `archived_at = CASE WHEN $${values.length} THEN NOW() ELSE NULL END`;
  }
  values.push(id);
  const result = await pool.query(
    `UPDATE contact_messages SET ${updates.join(", ")} WHERE id = $${values.length}
     RETURNING id, name, email, subject, message, is_read, archived_at, created_at`,
    values
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Message not found" });
  return res.json({ data: result.rows[0] });
}));

app.get("/api/admin/settings", requireAdmin, asyncRoute(async (_req, res) => {
  const result = await pool.query("SELECT key, value, updated_at FROM site_settings ORDER BY key ASC");
  res.json({ data: result.rows });
}));

app.put("/api/admin/settings/:key", requireAdmin, asyncRoute(async (req, res) => {
  const key = req.params.key;
  if (!/^[a-z][a-z0-9_-]{0,63}$/.test(key)) {
    return res.status(400).json({ error: "Invalid setting key." });
  }
  if (!Object.prototype.hasOwnProperty.call(req.body || {}, "value")) {
    return res.status(400).json({ error: "A value field is required." });
  }
  const encoded = JSON.stringify(req.body.value);
  if (encoded === undefined || encoded.length > 10_000) {
    return res.status(400).json({ error: "Setting value is missing or too large." });
  }
  const result = await pool.query(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING key, value, updated_at`,
    [key, encoded]
  );
  return res.json({ data: result.rows[0] });
}));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, _req, res, _next) => {
  if (res.headersSent) return;
  if (error?.code === "23505") {
    return res.status(409).json({ error: "A record with that unique value already exists." });
  }
  if (error?.message === "Origin is not allowed") {
    return res.status(403).json({ error: "Origin is not allowed." });
  }
  console.error("API request failed:", error instanceof Error ? error.message : "Unknown error");
  return res.status(500).json({ error: "An unexpected server error occurred." });
});

const server = app.listen(port, () => {
  console.log(`Portfolio API listening on port ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down portfolio API.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
