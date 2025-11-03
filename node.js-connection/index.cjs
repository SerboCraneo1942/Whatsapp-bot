// index.cjs - versión sin Baileys (CommonJS)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
globalThis.crypto = crypto;

const axios = require("axios");
const http = require("http");
const express = require("express");

// CONFIG
const PYTHON_URL = process.env.PYTHON_URL || "http://python-core:10000";
const PYTHON_PING = `${PYTHON_URL.replace(/\/$/, "")}/ping`;
const PYTHON_HANDLE = `${PYTHON_URL.replace(/\/$/, "")}/handle`;
const PORT = parseInt(process.env.PORT || "10000", 10);

// Ruta del flag en el contenedor para controlar en caliente
const FLAG_PATH = process.env.DISABLE_WA_FLAG_PATH || "/app/.DISABLE_WA";

// Helper: llamada a Python
async function callPython(text) {
  try {
    const res = await axios.post(PYTHON_HANDLE, { text }, { timeout: 8000 });
    return res.data;
  } catch (err) {
    console.error("callPython failed:", err && err.message ? err.message : err);
    return { __error: err && err.message ? err.message : "Error llamando a Python" };
  }
}

// Guard placeholder
function isWaDisabled() {
  if (process.env.DISABLE_WA === "1" || process.env.DISABLE_WA === "true") return true;
  try { return fs.existsSync(FLAG_PATH); } catch (e) { return false; }
}

// Express app (health + optional admin endpoints)
const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Node service activo\n");
});

app.get("/health", function (req, res) {
  res.status(200).json({ status: "ok" });
});

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;
if (ADMIN_TOKEN) {
  app.post("/admin/wa/disable", function (req, res) {
    var t = req.header("x-admin-token");
    if (t !== ADMIN_TOKEN) return res.status(403).send("forbidden");
    try {
      fs.mkdirSync(path.dirname(FLAG_PATH), { recursive: true });
      fs.writeFileSync(FLAG_PATH, "disabled-by:" + new Date().toISOString());
      console.log("🔒 .DISABLE_WA created by admin endpoint");
      return res.status(200).send("ok");
    } catch (e) {
      console.error("admin disable error:", e && e.message ? e.message : e);
      return res.status(500).send("error");
    }
  });

  app.post("/admin/wa/enable", function (req, res) {
    var t = req.header("x-admin-token");
    if (t !== ADMIN_TOKEN) return res.status(403).send("forbidden");
    try {
      if (fs.existsSync(FLAG_PATH)) fs.unlinkSync(FLAG_PATH);
      console.log("🔓 .DISABLE_WA removed by admin endpoint");
      return res.status(200).send("ok");
    } catch (e) {
      console.error("admin enable error:", e && e.message ? e.message : e);
      return res.status(500).send("error");
    }
  });
} else {
  console.log("⚠️ ADMIN_TOKEN not set; admin endpoints disabled (recommended).");
}

// Global handlers to avoid process exit on unexpected errors
process.on("unhandledRejection", function (reason) {
  console.error("unhandledRejection:", reason);
});
process.on("uncaughtException", function (err) {
  console.error("uncaughtException:", err);
  // no process.exit to keep server alive for debugging
});

// Start HTTP server (no Baileys started)
var server = http.createServer(app);
server.listen(PORT, async function () {
  console.log(">>> Node listening on port", PORT);
  try {
    var r = await axios.get(PYTHON_PING, { timeout: 3000 });
    console.log(">>> Python ping OK:", typeof r.data === "object" ? "object" : String(r.data));
  } catch (e) {
    console.log(">>> Python ping failed:", e && e.message ? e.message : e);
  }

  if (isWaDisabled()) {
    console.log("⚠️ WhatsApp integration inactive (guard present).");
  } else {
    console.log("⚠️ WhatsApp integration not installed in this build.");
  }
});