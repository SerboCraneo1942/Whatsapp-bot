// index.js corregido - CommonJS, no modifica Python, usa PYTHON_URL (no localhost), valida y registra logs mínimos.
const crypto = require("crypto")
global.crypto = crypto

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const { Boom } = require("@hapi/boom")
const axios = require("axios")
const http = require("http")

// CONFIG: no usar localhost. Ajustar en Render la variable PYTHON_URL al host real del servicio Python.
const PYTHON_URL = process.env.PYTHON_URL || "http://python-core:10000"
const PYTHON_PING = `${PYTHON_URL.replace(/\/$/, "")}/ping`
const PYTHON_HANDLE = `${PYTHON_URL.replace(/\/$/, "")}/handle`
const PORT = process.env.PORT || 10000

async function callPython(text) {
  try {
    const res = await axios.post(PYTHON_HANDLE, { text }, { timeout: 8000 })
    return res.data
  } catch (err) {
    return { __error: err.message || "Error llamando a Python" }
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update || {}

    if (qr) {
      console.log("📲 QR:", qr)
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error && new Boom(lastDisconnect.error).output?.statusCode
      const shouldReconnect = statusCode !== 401
      console.log("⚠️ connection closed; statusCode:", statusCode, "reconnect:", shouldReconnect)
      if (shouldReconnect) {
        setTimeout(() => startBot().catch(e => console.error("startBot restart error:", e.message)), 1500)
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp connection open")
    }
  })

  sock.ev.on("messages.upsert", async (m) => {
    try {
      if (!m || !Array.isArray(m.messages) || m.messages.length === 0) return

      const incoming = m.messages[0]
      if (!incoming || incoming.key?.fromMe) return
      const from = incoming.key.remoteJid
      if (!from) return

      const text =
        incoming.message?.conversation ||
        incoming.message?.extendedTextMessage?.text ||
        incoming.message?.imageMessage?.caption ||
        ""

      if (!text || typeof text !== "string") return

      console.log("📩 received from", from, ":", text)

      // Llamada mínima y segura a Python (no modifica Python)
      console.log(">>> calling Python:", PYTHON_HANDLE)
      const pythonResp = await callPython(text)

      if (pythonResp && pythonResp.__error) {
        console.error("🐍 python error:", pythonResp.__error)
        return
      }

      const reply = (typeof pythonResp === "string") ? pythonResp : (pythonResp?.reply || JSON.stringify(pythonResp))

      if (!reply || reply === "{}") {
        console.log("🤖 python returned empty/unexpected; skipping send")
        return
      }

      console.log("🧠 python reply:", reply)
      await sock.sendMessage(from, { text: String(reply) })
    } catch (err) {
      console.error("messages.upsert handler failed:", err?.message || err)
    }
  })
}

startBot().catch(err => console.error("startBot error:", err?.message || err))

http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Node service activo\n")
    return
  }
  res.writeHead(404)
  res.end("Not found")
}).listen(PORT, () => {
  console.log(">>> Node listening on port", PORT)
  // Ping a Python para visibilidad en logs; no modifica ni exige cambios en Python.
  axios.get(PYTHON_PING, { timeout: 3000 })
    .then(r => console.log(">>> Python ping OK:", typeof r.data === "object" ? "object" : String(r.data)))
    .catch(e => console.log(">>> Python ping failed:", e.message))
})