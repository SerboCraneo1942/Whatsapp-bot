// index.js corregido - CommonJS, no modifica Python, usa PYTHON_URL (no localhost), valida y registra logs mínimos.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
global.crypto = crypto;

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const axios = require("axios");
const http = require("http");
const express = require("express");

// CONFIG: no usar localhost. Ajustar en Render la variable PYTHON_URL al host real del servicio Python.
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
    return { __error: err.message || "Error llamando a Python" };
  }
}

// startBot separado para poder invocarlo condicionalmente
async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update || {};

      if (qr) {
        console.log("📲 QR:", qr);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error && new Boom(lastDisconnect.error).output?.statusCode;
        const shouldReconnect = statusCode !== 401;
        console.log("⚠️ connection closed; statusCode:", statusCode, "reconnect:", shouldReconnect);
        if (shouldReconnect) {
          setTimeout(() => startBot().catch(e => console.error("startBot restart error:", e?.message || e)), 1500);
        }
      } else if (connection === "open") {
        console.log("✅ WhatsApp connection open");
      }
    });

    sock.ev.on("messages.upsert", async (m) => {
      try {
        if (!m || !Array.isArray(m.messages) || m.messages.length === 0) return;

        const incoming = m.messages[0];
        if (!incoming || incoming.key?.fromMe) return;
        const from = incoming.key.remoteJid;
        if (!from) return;

        const text =
          incoming.message?.conversation ||
          incoming.message?.extendedTextMessage?.text ||
          incoming.message?.imageMessage?.caption ||
          "";

        if (!text || typeof text !== "string") return;

        console.log("📩 received from", from, ":", text);

        // Llamada mínima y segura a Python (no modifica Python)
        console.log(">>> calling Python:", PYTHON_HANDLE);
        const pythonResp = await callPython(text);

        if (pythonResp && pythonResp.__error) {
          console.error("🐍 python error:", pythonResp.__error);
          return;
        }

        const reply = (typeof pythonResp === "string") ? pythonResp : (pythonResp?.reply || JSON.stringify(pythonResp));

        if (!reply || reply === "{}") {
          console.log("🤖 python returned empty/unexpected; skipping send");
          return;
        }

        console.log("🧠 python reply:", reply);
        await sock.sendMessage(from, { text: String(reply) });
      } catch (err) {
        console.error("messages.upsert handler failed:", err?.message || err);
      }
    });

    console.log("🟢 startBot completed setup (Baileys initialized).");
    return sock;
  } catch (err) {
    console.error("startBot error during setup:", err?.message || err);
    throw err;
  }
}

// Guard para decidir si intentar conectar a WhatsApp
function isWaDisabled() {
  if (process.env.DISABLE_WA === "1" || process.env.DISABLE_WA === "true") return true;
  try {
    return fs.existsSync(FLAG_PATH);
  } catch (e) {
    return false;
  }
}

// Express app (health + optional admin endpoints)
const app = express();
app.use(express.json());

// Health root
app.get("/", (req, res) => {
  res.status(200).send("Node service activo\n");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Optional admin endpoints to toggle the flag in runtime (protected by ADMIN_TOKEN)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;
if (ADMIN_TOKEN) {
  app.post("/admin/wa/disable", (req, res) => {
    const t = req.header("x-admin-token");
    if (t !== ADMIN_TOKEN) return res.status(403).send("forbidden");
    try {
      fs.mkdirSync(path.dirname(FLAG_PATH), { recursive: true });
      fs.writeFileSync(FLAG_PATH, `disabled-by:${new Date().toISOString()}`);
      console.log("🔒 .DISABLE_WA created by admin endpoint");
      return res.status(200).send("ok");
    } catch (e) {
      console.error("admin disable error:", e?.message || e);
      return res.status(500).send("error");
    }
  });

  app.post("/admin/wa/enable", (req, res) => {
    const t = req.header("x-admin-token");
    if (t !== ADMIN_TOKEN) return res.status(403).send("forbidden");
    try {
      if (fs.existsSync(FLAG_PATH)) fs.unlinkSync(FLAG_PATH);
      console.log("🔓 .DISABLE_WA removed by admin endpoint");
      return res.status(200).send("ok");
    } catch (e) {
      console.error("admin enable error:", e?.message || e);
      return res.status(500).send("error");
    }
  });
} else {
  console.log("⚠️ ADMIN_TOKEN not set; admin endpoints disabled (recommended for safety).");
}

// Start HTTP server and then decide about Baileys
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(">>> Node listening on port", PORT);

  // Ping a Python para visibilidad en logs; no modifica ni exige cambios en Python.
  axios.get(PYTHON_PING, { timeout: 3000 })
    .then(r => console.log(">>> Python ping OK:", typeof r.data === "object" ? "object" : String(r.data)))
    .catch(e => console.log(">>> Python ping failed:", e?.message || e));

  // Decide si iniciar Baileys
  if (isWaDisabled()) {
    console.log("⚠️ Baileys disabled by guard (DISABLE_WA env or FLAG_PATH). Skipping WhatsApp connection.");
  } else {
    // Intentar iniciar el bot; errores quedarán en logs pero no deben matar el servidor HTTP
    startBot()
      .then(() => console.log("✅ startBot started (async)"))
      .catch(err => console.error("startBot initial error:", err?.message || err));
  }
});